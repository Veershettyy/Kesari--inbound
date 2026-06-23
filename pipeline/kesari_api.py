"""
kesari_api.py
─────────────
Fetches live package data directly from the KESARi Inbound API.
No scraping needed — the API is public and returns all package fields.
"""

import ssl, json
import urllib.request

API_BASE   = "https://tap.kesariselect.com/tap-api/cms-content/inbound"
PKG_LIST   = f"{API_BASE}/get-package-list"
PKG_DETAIL = f"{API_BASE}/get-package-detail"   # ?item_code=INBOUND-68

# Self-signed cert on their server — skip verification
_CTX = ssl.create_default_context()
_CTX.check_hostname = False
_CTX.verify_mode    = ssl.CERT_NONE


def _get(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20, context=_CTX) as r:
        return json.load(r)


def _places_string(places_list: list) -> str:
    """Convert places array → 'Shillong → Cherrapunji → Jowai → Guwahati'"""
    seen, ordered = set(), []
    for p in sorted(places_list, key=lambda x: int(x.get("sequence_number", 99))):
        name = p.get("Place", "").strip().title()
        if name and name not in seen:
            seen.add(name)
            ordered.append(name)
    return " → ".join(ordered)


def _first_image(img_dict: dict) -> str:
    """Return the first image URL from the package_image dict."""
    if not img_dict:
        return ""
    for key in img_dict:
        if key.startswith("Img ") and not key.startswith("Img Description"):
            val = img_dict[key]
            if val and val.startswith("http"):
                # strip ?filename=... query string for cleaner URL
                return val.split("?")[0]
    return ""


def fetch_all_packages() -> list[dict]:
    """
    Returns list of normalized package dicts matching packages.js schema:
      { code, name, days, nights, places, theme, tags, img }
    """
    raw = _get(PKG_LIST)
    results = []
    for p in raw.get("data", []):
        code = p.get("new_item_code", "").strip()
        if not code:
            continue
        results.append({
            "code":   code,
            "name":   p.get("package_name", "").strip(),
            "days":   int(p.get("number_of_days",  0) or 0),
            "nights": int(p.get("number_of_nights", 0) or 0),
            "places": _places_string(p.get("places") or []),
            "theme":  (p.get("theme") or "").strip().lower().replace(" ", "-"),
            "tags":   (p.get("tags") or "").strip(),
            "img":    _first_image(p.get("package_image") or {}),
        })
    return results


if __name__ == "__main__":
    pkgs = fetch_all_packages()
    print(f"Fetched {len(pkgs)} packages from KESARi API")
    for p in pkgs[:3]:
        print(f"  {p['code']}: {p['name']} ({p['days']}D/{p['nights']}N) — {p['places'][:50]}")
