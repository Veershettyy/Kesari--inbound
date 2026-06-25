"""
run.py — standalone pipeline runner (called by scheduler as subprocess)
Runs scrape + translate in its own process, so Playwright Sync API works fine.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

from scraper import scrape
from translator import translate_changed_pages
from config import LANGUAGES
import datetime

now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
print(f'[{now}] Running pipeline...')

changed = scrape(verbose=True)

if changed:
    print(f'\n{len(changed)} page(s) changed — translating into {len(LANGUAGES)} languages...')
    translate_changed_pages(changed)
    print('\n✔ Pipeline complete!')
else:
    print('No changes detected. ✔')
