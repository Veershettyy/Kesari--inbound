"""
translator.py
─────────────
Translates HTML files from INT/ENG/ into every target language.
Uses MyMemory API — completely free, no API key, no signup needed.

MyMemory API:
  URL: https://api.mymemory.translated.net/get?q={text}&langpair=en|{lang}
  Limit: 5000 words/day free (enough for demo)
  No key required for basic usage

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

import os, json, time, glob
import requests
from bs4 import BeautifulSoup, NavigableString, Comment
from config import (
    INT_DIR, ENG_DIR, LANGUAGES, SKIP_TAGS,
    PRESERVE_WORDS, MYMEMORY_LANG_CODES,
)

MYMEMORY_URL  = "https://api.mymemory.translated.net/get"
MAX_CHARS     = 450    # MyMemory limit per request
REQUEST_DELAY = 0.5    # seconds between API calls to avoid rate limit


# ── MyMemory translation ──────────────────────────────────────

def translate_text(text: str, lang_code: str) -> str:
    """Translate a single piece of text using MyMemory API."""
    target = MYMEMORY_LANG_CODES.get(lang_code, lang_code)

    try:
        response = requests.get(
            MYMEMORY_URL,
            params={"q": text, "langpair": f"en|{target}"},
            timeout=10,
        )
        data = response.json()

        if data.get("responseStatus") == 200:
            return data["responseData"]["translatedText"]
        else:
            return text  # fallback to English

    except Exception as exc:
        print(f"      ✗ API error: {exc} — keeping original")
        return text


def translate_chunks(text: str, lang_code: str) -> str:
    """Split long text into chunks and translate each."""
    if len(text) <= MAX_CHARS:
        result = translate_text(text, lang_code)
        time.sleep(REQUEST_DELAY)
        return result

    # Split by sentence endings to keep meaning intact
    sentences = text.replace(". ", ".|").replace("! ", "!|").replace("? ", "?|").split("|")
    translated_parts = []
    current_chunk    = ""

    for sentence in sentences:
        if len(current_chunk) + len(sentence) < MAX_CHARS:
            current_chunk += sentence + " "
        else:
            if current_chunk.strip():
                translated_parts.append(translate_text(current_chunk.strip(), lang_code))
                time.sleep(REQUEST_DELAY)
            current_chunk = sentence + " "

    if current_chunk.strip():
        translated_parts.append(translate_text(current_chunk.strip(), lang_code))
        time.sleep(REQUEST_DELAY)

    return " ".join(translated_parts)


# ── HTML translation ──────────────────────────────────────────

def should_preserve(text: str) -> bool:
    """Return True if text should not be translated."""
    text = text.strip()
    if len(text) < 2:
        return True
    # Pure numbers, codes, or package IDs
    if text.isdigit():
        return True
    if any(text.startswith(code) for code in ["INBOUND-", "FIT-INBOUND-"]):
        return True
    return False


def translate_html(html: str, lang_code: str) -> str:
    """Translate all visible text in HTML, leaving images/scripts/links untouched."""
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

    for i, node in enumerate(nodes):
        original    = node.strip()
        translated  = translate_chunks(original, lang_code)
        node.replace_with(NavigableString(translated))

        if (i + 1) % 10 == 0:
            print(f"      {i+1}/{len(nodes)} nodes done")

    return str(soup)


# ── File-level operations ─────────────────────────────────────

def translate_file(eng_path: str, lang_code: str):
    """Translate one HTML file and write to INT/{lang_code}/."""
    rel_path = os.path.relpath(eng_path, ENG_DIR)
    out_path = os.path.join(INT_DIR, lang_code, rel_path)

    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    with open(eng_path, "r", encoding="utf-8") as fh:
        html = fh.read()

    print(f"\n    [{lang_code}] {rel_path}")
    translated_html = translate_html(html, lang_code)

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
