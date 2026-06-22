import os

# ── Source (local React dev server) ───────────────────────────
DEV_SERVER_URL = "http://localhost:5173"

# ── Folder paths ──────────────────────────────────────────────
ROOT_DIR    = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
INT_DIR     = os.path.join(ROOT_DIR, "INT")
ENG_DIR     = os.path.join(INT_DIR, "ENG")
HASHES_FILE = os.path.join(ROOT_DIR, "pipeline", "hashes.json")

# ── Languages to generate ─────────────────────────────────────
LANGUAGES = {
    "es": "Spanish",
    "fr": "French",
    "hi": "Hindi",
    "de": "German",
    "ja": "Japanese",
    "pt": "Portuguese",
    "it": "Italian",
    "zh": "Chinese Simplified",
    "ar": "Arabic",
    "ko": "Korean",
    "ml": "Malayalam",
    "pl": "Polish",
}

# ── All routes to scrape from the React app ───────────────────
# Format: (url_route, relative_file_path_under_INT/ENG/)
PACKAGE_CODES = [
    "FIT-INBOUND-01","FIT-INBOUND-02","FIT-INBOUND-03","FIT-INBOUND-04",
    "FIT-INBOUND-06","FIT-INBOUND-11","FIT-INBOUND-12","FIT-INBOUND-13",
    "FIT-INBOUND-14","FIT-INBOUND-15","FIT-INBOUND-16","FIT-INBOUND-17",
    "FIT-INBOUND-7","FIT-INBOUND-8",
    "INBOUND-01","INBOUND-010","INBOUND-011","INBOUND-012","INBOUND-013",
    "INBOUND-014","INBOUND-015","INBOUND-016","INBOUND-02","INBOUND-03",
    "INBOUND-05","INBOUND-06","INBOUND-07","Inbound-09","INBOUND-12",
    "INBOUND-13","INBOUND-15","INBOUND-17","INBOUND-18","INBOUND-19",
    "INBOUND-20","INBOUND-22","INBOUND-25","INBOUND-28","INBOUND-29",
    "INBOUND-30","INBOUND-33","INBOUND-35","INBOUND-37","INBOUND-38",
    "INBOUND-39","INBOUND-40","INBOUND-41","INBOUND-43","INBOUND-45",
    "INBOUND-47","INBOUND-48","INBOUND-49","INBOUND-50","INBOUND-51",
    "INBOUND-55","INBOUND-56","INBOUND-65","INBOUND-66","INBOUND-68",
    "INBOUND-70","INBOUND-TEST-01","INBOUND-TEST-02","INBOUND-TEST-03",
    "INBOUND-TEST-32","INBOUND-TEST-37",
]

ALL_ROUTES = [
    ("/INT",                           "index.html"),
    ("/INT/explore",                   "explore/index.html"),
    ("/INT/destinations",              "destinations/index.html"),
    ("/INT/packages",                  "packages/index.html"),
    ("/INT/search",                    "search/index.html"),
] + [
    (f"/INT/explore/product-details/{code}",
     f"explore/product-details/{code}/index.html")
    for code in PACKAGE_CODES
]

# ── Scraper settings ──────────────────────────────────────────
WAIT_MS               = 1500   # ms to wait after networkidle for React to settle
CHECK_INTERVAL_HOURS  = 24     # how often to auto-check for changes

# ── HTML tags whose text must NOT be translated ───────────────
SKIP_TAGS = {
    "script", "style", "head", "meta", "link",
    "noscript", "code", "pre", "title",
}

# ── Proper nouns that must never be translated ────────────────
PRESERVE_WORDS = [
    "KESARi", "Kesari", "India", "INBOUND",
    "Rajasthan", "Kerala", "Goa", "Mumbai", "Delhi", "Agra",
    "Varanasi", "Jaipur", "Udaipur", "Ladakh", "Kashmir",
    "Himachal", "Gujarat", "Maharashtra", "Karnataka", "Tamil Nadu",
    "Andaman", "Nicobar", "Lakshadweep", "Pondicherry", "Uttarakhand",
]
