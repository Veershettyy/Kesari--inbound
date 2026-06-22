import os

# ── Source website ────────────────────────────────────────────
BASE_URL = "https://inbound.kesariselect.com/INT"

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
}

# ── Scraper settings ──────────────────────────────────────────
REQUEST_DELAY_SECONDS = 1        # be respectful to the server
REQUEST_TIMEOUT       = 30
MAX_PAGES             = 100      # safety cap

# ── Pipeline schedule ─────────────────────────────────────────
CHECK_INTERVAL_HOURS = 24        # how often to check for changes

# ── HTML tags whose text should NOT be translated ─────────────
SKIP_TAGS = {"script", "style", "head", "meta", "link", "noscript", "code", "pre"}

# ── Proper nouns to never translate ──────────────────────────
PRESERVE_WORDS = [
    "KESARi", "Kesari", "India", "INBOUND",
    "Rajasthan", "Kerala", "Goa", "Mumbai", "Delhi", "Agra",
    "Varanasi", "Jaipur", "Udaipur", "Ladakh", "Kashmir",
    "Himachal", "Gujarat", "Maharashtra", "Karnataka", "Tamil Nadu",
]

# ── MyMemory API ─────────────────────────────────────────────
# Free, no key needed, 5000 words/day
# Language codes for MyMemory (en|target format)
MYMEMORY_LANG_CODES = {
    "es": "es",
    "fr": "fr",
    "hi": "hi",
    "de": "de",
    "ja": "ja",
    "pt": "pt",
    "it": "it",
    "zh": "zh-CN",
    "ar": "ar",
}
