"""
translator.py
─────────────
Translates rendered HTML files from INT/ENG/ into every target language.
Uses Mistral API (mistral-small-latest) for translation.

How it works:
  1. Parse HTML with BeautifulSoup
  2. Collect all visible text nodes (skip script/style/meta)
  3. Batch-send to Mistral → get translated strings back
  4. Swap text nodes in-place
  5. Rewrite internal links to the correct language path
  6. Save to INT/{lang_code}/
"""

import os, json, glob
from mistralai.client import Mistral
from bs4 import BeautifulSoup, NavigableString, Comment
from dotenv import load_dotenv
from config import INT_DIR, ENG_DIR, LANGUAGES, SKIP_TAGS, PRESERVE_WORDS
from link_rewriter import rewrite_links

load_dotenv()

client = Mistral(api_key=os.environ.get("MISTRAL_API_KEY", ""))
MODEL  = "mistral-small-latest"


# ── Text translation ───────────────────────────────────────────

def translate_texts(texts: list, lang_name: str) -> list:
    """Send a batch of plain text strings to Mistral, get translations."""
    if not texts:
        return []

    preserve = ", ".join(PRESERVE_WORDS)
    prompt   = f"""You are a professional travel website translator.
Translate the following English texts to {lang_name}.

Rules:
- Return ONLY a valid JSON array with translations in the exact same order
- Keep proper nouns as-is: {preserve}
- Keep package codes as-is (INBOUND-01, FIT-INBOUND-07, etc.)
- Keep numbers, percentages, and currency as-is
- No markdown, no explanation — only the raw JSON array

Input:
{json.dumps(texts, ensure_ascii=False)}

Output (JSON array only):"""

    response = client.chat.complete(
        model    = MODEL,
        messages = [{"role": "user", "content": prompt}],
    )

    raw = response.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1].rsplit("\n", 1)[0]
        if raw.startswith("json"):
            raw = raw[4:]

    translated = json.loads(raw.strip())

    if len(translated) != len(texts):
        raise ValueError(f"Expected {len(texts)} translations, got {len(translated)}")

    return translated


# ── HTML text extraction and replacement ───────────────────────

def should_skip(text: str) -> bool:
    t = text.strip()
    if len(t) < 2:          return True
    if t.isdigit():         return True
    if t in ("→", "←", "•", "–", "—"): return True
    if t.startswith("INBOUND-") or t.startswith("FIT-"): return True
    return False


def translate_html(html: str, lang_name: str, batch_size: int = 40) -> str:
    """Translate all visible text nodes inside an HTML page."""
    soup  = BeautifulSoup(html, "html.parser")
    nodes = []

    for el in soup.descendants:
        if isinstance(el, Comment):
            continue
        if isinstance(el, NavigableString):
            if el.parent.name in SKIP_TAGS:
                continue
            if should_skip(str(el)):
                continue
            nodes.append(el)

    print(f"      Found {len(nodes)} text nodes to translate")

    for i in range(0, len(nodes), batch_size):
        batch     = nodes[i : i + batch_size]
        originals = [str(n).strip() for n in batch]

        try:
            translated = translate_texts(originals, lang_name)
            for node, tr in zip(batch, translated):
                node.replace_with(NavigableString(tr))
            print(f"      {min(i + batch_size, len(nodes))}/{len(nodes)} translated")
        except Exception as e:
            print(f"      ✗ batch {i//batch_size + 1} failed: {e} — keeping English")

    return str(soup)


# ── File-level operations ──────────────────────────────────────

def translate_file(eng_path: str, lang_code: str):
    """Translate one HTML file → save to INT/{lang_code}/."""
    rel_path = os.path.relpath(eng_path, ENG_DIR)
    out_path = os.path.join(INT_DIR, lang_code, rel_path)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    with open(eng_path, "r", encoding="utf-8") as f:
        html = f.read()

    lang_name = LANGUAGES[lang_code]
    print(f"\n    [{lang_code.upper()}] {rel_path}")

    translated = translate_html(html, lang_name)
    translated = rewrite_links(translated, lang_code)   # fix internal links

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(translated)

    print(f"    ✔ saved → INT/{lang_code}/{rel_path}")


def translate_changed_pages(changed: list):
    """
    Translate only changed pages.
    `changed` is a list of (route, filepath) tuples from scraper.scrape().
    """
    filepaths = [fp for _, fp in changed if os.path.exists(fp)]

    for lang_code in LANGUAGES:
        print(f"\n══ {LANGUAGES[lang_code]} ({lang_code}) ══")
        for eng_path in filepaths:
            translate_file(eng_path, lang_code)


def translate_all_pages():
    """Re-translate every HTML file in INT/ENG/ to all languages."""
    eng_files = glob.glob(os.path.join(ENG_DIR, "**", "*.html"), recursive=True)
    print(f"Found {len(eng_files)} HTML files in INT/ENG/\n")

    for lang_code in LANGUAGES:
        print(f"\n══ {LANGUAGES[lang_code]} ({lang_code}) ══")
        for eng_path in eng_files:
            translate_file(eng_path, lang_code)

    print("\n✔ All translations complete!")


if __name__ == "__main__":
    translate_all_pages()
