"""
scraper.py
──────────
Renders every page of the local React dev server using Playwright
(a headless browser) and saves the fully-rendered HTML to INT/ENG/.

WHY PLAYWRIGHT:
  The KESARi site is a React app — plain HTTP requests only get an
  empty <div id="root">. Playwright launches a real browser, waits
  for JavaScript to finish rendering, then captures the live DOM.

CHANGE DETECTION:
  hashes.json stores SHA-256 of each saved HTML file.
  On each run, only pages whose content changed are returned for
  re-translation — so the pipeline does the minimum work possible.
"""

import os, json, hashlib, subprocess, time
from config import ENG_DIR, HASHES_FILE, DEV_SERVER_URL, ALL_ROUTES, WAIT_MS


def sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def load_hashes() -> dict:
    if os.path.exists(HASHES_FILE):
        with open(HASHES_FILE, "r") as f:
            return json.load(f)
    return {}


def save_hashes(h: dict):
    with open(HASHES_FILE, "w") as f:
        json.dump(h, f, indent=2)


def route_to_filepath(route: str) -> str:
    """Convert a URL route to a local file path under INT/ENG/."""
    path = route.strip("/")
    if not path:
        path = "index.html"
    elif "." not in path.split("/")[-1]:
        path = path + "/index.html"
    return os.path.join(ENG_DIR, path)


def save_html(filepath: str, html: str):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html)


def scrape(verbose: bool = True) -> list:
    """
    Visit every route in ALL_ROUTES using a headless browser.
    Returns list of (route, filepath) tuples where content changed.
    """
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("❌ Playwright not installed. Run: pip install playwright && playwright install chromium")
        return []

    hashes  = load_hashes()
    changed = []

    if verbose:
        print(f"🌐 Scraping {len(ALL_ROUTES)} pages from {DEV_SERVER_URL}\n")

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        page    = browser.new_page()

        for route, rel_path in ALL_ROUTES:
            url      = f"{DEV_SERVER_URL}{route}"
            filepath = os.path.join(ENG_DIR, rel_path)

            try:
                if verbose:
                    print(f"  → {route}")

                page.goto(url, timeout=30000)
                page.wait_for_load_state("networkidle", timeout=15000)
                page.wait_for_timeout(WAIT_MS)   # extra wait for animations

                html     = page.content()
                new_hash = sha256(html)

                if hashes.get(route) == new_hash:
                    if verbose:
                        print(f"     ↩  no change")
                else:
                    save_html(filepath, html)
                    hashes[route] = new_hash
                    changed.append((route, filepath))
                    if verbose:
                        print(f"     ✔  saved → INT/ENG/{rel_path}")

            except Exception as e:
                if verbose:
                    print(f"     ✗  {e}")

        browser.close()

    save_hashes(hashes)

    if verbose:
        print(f"\n✔ Scrape done — {len(changed)} page(s) changed")

    return changed


if __name__ == "__main__":
    changed = scrape()
    print(f"\nChanged: {[r for r, _ in changed]}")
