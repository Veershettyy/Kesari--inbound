"""
scraper.py
──────────
Downloads all pages from the live KESARi Inbound website and saves them
to INT/ENG/. Tracks a SHA-256 hash of each page so we only re-download
(and later re-translate) pages whose content has actually changed.

Change-detection strategy
─────────────────────────
  hashes.json  →  { url: sha256_hash }
  On each run:
    new_hash == stored_hash  →  skip (content unchanged)
    new_hash != stored_hash  →  save HTML, update hash, add to changed list
  The changed list is returned so the translator only re-processes what changed.
"""

import os, json, time, hashlib
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from config import (
    BASE_URL, ENG_DIR, HASHES_FILE,
    REQUEST_DELAY_SECONDS, REQUEST_TIMEOUT, MAX_PAGES,
)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0 Safari/537.36"
    )
}


def sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def url_to_filepath(url: str) -> str:
    """Convert a URL to a local file path inside ENG_DIR."""
    parsed = urlparse(url)
    path   = parsed.path.strip("/")

    # bare domain or trailing slash → index.html
    if not path:
        path = "index.html"
    elif not os.path.splitext(path)[1]:   # no extension → directory → index.html
        path = path + "/index.html"

    return os.path.join(ENG_DIR, path)


def save_html(url: str, html: str) -> str:
    filepath = url_to_filepath(url)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as fh:
        fh.write(html)
    return filepath


def load_hashes() -> dict:
    if os.path.exists(HASHES_FILE):
        with open(HASHES_FILE, "r") as fh:
            return json.load(fh)
    return {}


def save_hashes(hashes: dict):
    with open(HASHES_FILE, "w") as fh:
        json.dump(hashes, fh, indent=2)


def find_internal_links(html: str, current_url: str) -> list[str]:
    """Return all internal links found in the page."""
    soup  = BeautifulSoup(html, "html.parser")
    links = []
    for tag in soup.find_all("a", href=True):
        full = urljoin(current_url, tag["href"])
        # Keep only links that stay within our target site
        if full.startswith(BASE_URL) and "#" not in full:
            links.append(full.split("?")[0])   # strip query strings
    return list(set(links))


def scrape(verbose: bool = True) -> list[str]:
    """
    Crawl the KESARi website starting from BASE_URL.
    Returns list of URLs whose content changed since last run.
    """
    hashes   = load_hashes()
    visited  = set()
    queue    = [BASE_URL]
    changed  = []
    session  = requests.Session()
    session.headers.update(HEADERS)

    while queue and len(visited) < MAX_PAGES:
        url = queue.pop(0)
        if url in visited:
            continue
        visited.add(url)

        try:
            if verbose:
                print(f"  GET  {url}")
            resp = session.get(url, timeout=REQUEST_TIMEOUT)

            if resp.status_code != 200:
                print(f"       ✗ HTTP {resp.status_code}")
                continue

            html     = resp.text
            new_hash = sha256(html)

            if hashes.get(url) == new_hash:
                if verbose:
                    print(f"       ↩  no change")
            else:
                filepath = save_html(url, html)
                hashes[url] = new_hash
                changed.append(url)
                if verbose:
                    print(f"       ✔  saved → {os.path.relpath(filepath)}")

            # Discover more pages
            for link in find_internal_links(html, url):
                if link not in visited:
                    queue.append(link)

            time.sleep(REQUEST_DELAY_SECONDS)

        except Exception as exc:
            print(f"       ✗  {exc}")

    save_hashes(hashes)

    if verbose:
        print(f"\nScrape complete — {len(visited)} pages visited, {len(changed)} changed")

    return changed


if __name__ == "__main__":
    print(f"Starting scrape of {BASE_URL}\n")
    changed_pages = scrape()
    print(f"\nChanged pages ({len(changed_pages)}):")
    for p in changed_pages:
        print(f"  {p}")
