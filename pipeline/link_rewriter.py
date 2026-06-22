"""
link_rewriter.py
────────────────
Rewrites internal links inside translated HTML files so that
users stay in their selected language path.

Example:
  English page has:  <a href="/INT/explore">Tour Packages</a>
  German version:    <a href="/INT/de/explore">Tour Packages</a>  ← rewritten

Rules:
  - Only /INT/... links are rewritten
  - Links already containing a lang prefix are left alone
  - External links (http/https), anchors (#), and asset paths are untouched
"""

from bs4 import BeautifulSoup
from config import LANGUAGES

# Route segments that are NOT language codes
NON_LANG_SEGMENTS = {
    "explore", "destinations", "packages", "search",
    "product-details", "ENG",
}


def rewrite_links(html: str, lang_code: str) -> str:
    """
    Replace /INT/<page> with /INT/<lang>/<page> in all anchor hrefs.
    Returns the modified HTML string.
    """
    soup = BeautifulSoup(html, "html.parser")

    for tag in soup.find_all("a", href=True):
        href = tag["href"]

        # Skip external, anchor-only, or non-INT links
        if not href.startswith("/INT/") and href != "/INT":
            continue
        if href.startswith("http"):
            continue

        # Parse the segment after /INT/
        rest = href[5:]   # strip leading "/INT/"
        if not rest:
            # href was exactly "/INT"
            tag["href"] = f"/INT/{lang_code}"
            continue

        first_seg = rest.split("/")[0]

        # If it's already a known language prefix, skip
        if first_seg in LANGUAGES and first_seg != "ENG":
            continue

        # If it's a known route segment (not a lang code), prepend lang
        tag["href"] = f"/INT/{lang_code}/{rest}"

    return str(soup)


if __name__ == "__main__":
    # Quick test
    sample = '<a href="/INT/explore">Tours</a> <a href="/INT/explore/product-details/FIT-01">Detail</a>'
    print(rewrite_links(sample, "de"))
