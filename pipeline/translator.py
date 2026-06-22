"""
translator.py
─────────────
Translates HTML files from INT/ENG/ into every target language.
Uses Mistral API — free tier available at console.mistral.ai

How giant companies handle translation:
  Google      — client-side DOM swap via widget (unprofessional, no SEO)
  Netflix     — pre-builds static JSON per language at deploy time via CI
  Airbnb      — SSR with translations fetched per route from translation service
  Booking.com — URL-based locale with CDN-cached translated pages (best SEO)

Our approach:
  Like Netflix/Booking.com — pre-built static HTML files per language.
  Pipeline runs offline, output is plain HTML. Zero runtime cost for users.
  Change detection ensures only changed pages are re-translated.
"""

import os, json, glob
from mistralai.client import Mistral
from bs4 import BeautifulSoup, NavigableString, Comment
from dotenv import load_dotenv
from config import INT_DIR, ENG_DIR, LANGUAGES, SKIP_TAGS, PRESERVE_WORDS

load_dotenv()

client = Mistral(api_key=os.environ.get("MISTRAL_API_KEY", ""))
MODEL  = "mistral-small-latest"   # free tier eligible


# ── Translation ───────────────────────────────────────────────

def translate_texts(texts: list, lang_name: str) -> list:
    """Send a batch of texts to Mistral and get translations back."""
    if not texts:
        return []

    preserve = ", ".join(PRESERVE_WORDS)
    prompt   = f"""You are a professional travel website translator.
Translate the following English texts to {lang_name}.

Rules:
- Return ONLY a valid JSON array with translations in the exact same order as input
- Preserve proper nouns: {preserve}
- Preserve numbers, package codes (INBOUND-01, FIT-INBOUND-07 etc.)
- No markdown, no explanation — only the JSON array

Input:
{json.dumps(texts, ensure_ascii=False)}

Output (JSON array only):"""

    response = client.chat.complete(
        model    = MODEL,
        messages = [{"role": "user", "content": prompt}],
    )

    raw = response.choices[0].message.content.strip()

    # Strip markdown fences if present
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1].rsplit("\n", 1)[0]
        if raw.startswith("json"):
            raw = raw[4:]

    translated = json.loads(raw.strip())

    if len(translated) != len(texts):
        raise ValueError(f"Expected {len(texts)} translations, got {len(translated)}")

    return translated


# ── HTML translation ──────────────────────────────────────────

def should_preserve(text: str) -> bool:
    text = text.strip()
    if len(text) < 2:
        return True
    if text.isdigit():
        return True
    if any(text.startswith(c) for c in ["INBOUND-", "FIT-INBOUND-"]):
        return True
    return False


def translate_html(html: str, lang_name: str, batch_size: int = 30) -> str:
    """Translate all visible text nodes in HTML — images untouched."""
    soup  = BeautifulSoup(html, "html.parser")
    nodes = []

    for element in soup.descendants:
        if isinstance(element, Comment):
            continue
        if isinstance(element, NavigableString):
            if element.parent.name in SKIP_TAGS:
                continue
            text = element.strip()
            if text and not should_preserve(text):
                nodes.append(element)

    print(f"      Translating {len(nodes)} text nodes...")

    for i in range(0, len(nodes), batch_size):
        batch     = nodes[i : i + batch_size]
        originals = [str(n).strip() for n in batch]

        try:
            translated = translate_texts(originals, lang_name)
            for node, tr in zip(batch, translated):
                node.replace_with(NavigableString(tr))
            print(f"      {min(i+batch_size, len(nodes))}/{len(nodes)} done")
        except Exception as exc:
            print(f"      ✗ batch failed: {exc} — keeping English")

    return str(soup)


# ── File operations ───────────────────────────────────────────

def translate_file(eng_path: str, lang_code: str):
    """Translate one HTML file and write to INT/{lang_code}/."""
    rel_path = os.path.relpath(eng_path, ENG_DIR)
    out_path = os.path.join(INT_DIR, lang_code, rel_path)

    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    with open(eng_path, "r", encoding="utf-8") as fh:
        html = fh.read()

    print(f"\n    [{lang_code}] {rel_path}")
    translated_html = translate_html(html, LANGUAGES[lang_code])

    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write(translated_html)

    print(f"    ✔ saved → {os.path.relpath(out_path)}")


def translate_changed_pages(changed_urls: list):
    """Translate only pages that changed in the latest scrape."""
    from scraper import url_to_filepath

    for lang_code in LANGUAGES:
        print(f"\n── {LANGUAGES[lang_code]} ({lang_code}) ──")
        for url in changed_urls:
            eng_path = url_to_filepath(url)
            if os.path.exists(eng_path):
                translate_file(eng_path, lang_code)
            else:
                print(f"    ✗ not found: {eng_path}")


def translate_all_pages():
    """Translate every HTML file in INT/ENG/ into all languages."""
    eng_files = glob.glob(os.path.join(ENG_DIR, "**", "*.html"), recursive=True)
    print(f"Found {len(eng_files)} HTML files in ENG/\n")

    for lang_code, lang_name in LANGUAGES.items():
        print(f"\n══ {lang_name} ({lang_code}) ══")
        for eng_path in eng_files:
            translate_file(eng_path, lang_code)

    print("\n✔ All translations complete!")


if __name__ == "__main__":
    translate_all_pages()
