"""
translator.py
─────────────
Translates HTML files from INT/ENG/ into every target language using Gemini API.
Only translates text nodes — images, links, scripts and styles are untouched.

How giant companies handle translation (research summary)
─────────────────────────────────────────────────────────
• Google        — client-side DOM swap via Translate widget. Fast, but ugly banner,
                  zero SEO value, no control over quality.
• Netflix        — pre-builds one static JSON locale file per language at deploy time
                  via CI pipeline. Zero runtime cost; requires human translators or
                  a translation memory service (Smartling / Crowdin).
• Airbnb        — i18n with SSR; translations are fetched per route from a central
                  translation service backed by human + machine hybrid.
• Booking.com   — URL-based locale (booking.com/en-us vs booking.com/fr).
                  CDN caches fully-rendered translated pages. Best for SEO.
                  Requires translated content to exist in the database.

Our approach (why it fits a static site pipeline)
──────────────────────────────────────────────────
• Like Netflix/Booking.com: pre-built static files per language.
• Unlike them: no human translators needed — Gemini does it automatically.
• Change detection (hashes.json) ensures only changed pages are re-translated.
• Output is plain HTML files — no server, no runtime API calls for end users.
• First run translates everything; subsequent runs re-translate only what changed.

Caching & invalidation
───────────────────────
Layer 1 — hashes.json (file-level)
  If ENG/page hash unchanged → skip translation entirely.
  Hash changes when the English source changes → auto re-translate.

Layer 2 — translated files on disk (INT/es/page.html etc.)
  Already translated files are overwritten only when source hash changes.
  All subsequent user requests read directly from disk — zero API cost.

Why no Redis / in-memory cache here?
  This is a batch pipeline, not a web server. Output is static files.
  The "cache" IS the translated HTML file. Reading a file is instant.
"""

import os, json, re, glob
import google.generativeai as genai
from bs4 import BeautifulSoup, NavigableString, Comment
from dotenv import load_dotenv
from config import (
    INT_DIR, ENG_DIR, LANGUAGES, GEMINI_MODEL,
    SKIP_TAGS, PRESERVE_WORDS,
)

load_dotenv()
genai.configure(api_key=os.environ.get("GEMINI_API_KEY", ""))
model = genai.GenerativeModel(GEMINI_MODEL)


# ── Text extraction ───────────────────────────────────────────

def extract_text_nodes(soup) -> list:
    """Return all NavigableString nodes that contain translatable text."""
    nodes = []
    for element in soup.descendants:
        if isinstance(element, Comment):
            continue
        if isinstance(element, NavigableString):
            if element.parent.name in SKIP_TAGS:
                continue
            text = element.strip()
            if len(text) < 2:
                continue
            nodes.append(element)
    return nodes


# ── Translation ───────────────────────────────────────────────

def build_prompt(texts: list[str], lang_name: str) -> str:
    preserve = ", ".join(PRESERVE_WORDS)
    return f"""You are a professional translator for a luxury travel website.
Translate the list of English texts below into {lang_name}.

Rules:
- Return ONLY a valid JSON array with the translations in the same order as the input
- Preserve proper nouns exactly: {preserve}
- Preserve numbers, currency symbols, package codes (e.g. INBOUND-01, FIT-INBOUND-07)
- Preserve HTML entities (&amp; &nbsp; etc.)
- Do NOT add markdown or any text outside the JSON array

Input array:
{json.dumps(texts, ensure_ascii=False)}

Output (JSON array only):"""


def translate_batch(texts: list[str], lang_name: str) -> list[str]:
    if not texts:
        return []

    prompt   = build_prompt(texts, lang_name)
    response = model.generate_content(prompt)
    raw      = response.text.strip()

    # Strip markdown code fences if present
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    translated = json.loads(raw)

    if len(translated) != len(texts):
        raise ValueError(
            f"Gemini returned {len(translated)} items but expected {len(texts)}"
        )
    return translated


def translate_html(html: str, lang_name: str, batch_size: int = 50) -> str:
    """Translate all text nodes in an HTML string, images untouched."""
    soup  = BeautifulSoup(html, "html.parser")
    nodes = extract_text_nodes(soup)

    if not nodes:
        return html

    # Process in batches to stay within token limits
    for i in range(0, len(nodes), batch_size):
        batch     = nodes[i : i + batch_size]
        originals = [str(n).strip() for n in batch]

        try:
            translated = translate_batch(originals, lang_name)
            for node, translation in zip(batch, translated):
                node.replace_with(NavigableString(translation))
        except Exception as exc:
            print(f"      ✗ batch {i//batch_size + 1} failed: {exc} — keeping English")

    return str(soup)


# ── File-level pipeline ───────────────────────────────────────

def translate_file(eng_path: str, lang_code: str, lang_name: str):
    """Translate one HTML file and write to INT/{lang_code}/."""
    rel_path  = os.path.relpath(eng_path, ENG_DIR)
    out_path  = os.path.join(INT_DIR, lang_code, rel_path)

    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    with open(eng_path, "r", encoding="utf-8") as fh:
        html = fh.read()

    print(f"    {lang_code}  ←  {rel_path}")
    translated_html = translate_html(html, lang_name)

    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write(translated_html)


def translate_changed_pages(changed_urls: list[str]):
    """Translate only the pages that changed in the latest scrape."""
    from scraper import url_to_filepath

    for lang_code, lang_name in LANGUAGES.items():
        print(f"\n  ── {lang_name} ({lang_code}) ──")
        for url in changed_urls:
            eng_path = url_to_filepath(url)
            if os.path.exists(eng_path):
                translate_file(eng_path, lang_code, lang_name)
            else:
                print(f"    ✗ ENG file not found for {url}")


def translate_all_pages():
    """Translate every HTML file in INT/ENG/ into all languages."""
    eng_files = glob.glob(os.path.join(ENG_DIR, "**", "*.html"), recursive=True)
    print(f"Found {len(eng_files)} HTML files in ENG/")

    for lang_code, lang_name in LANGUAGES.items():
        print(f"\n── {lang_name} ({lang_code}) ──")
        for eng_path in eng_files:
            translate_file(eng_path, lang_code, lang_name)

    print("\n✔ All translations complete")


if __name__ == "__main__":
    translate_all_pages()
