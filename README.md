# KESARi Inbound — Multilingual Tourism Website

A multilingual inbound tourism website for KESARi built with React and Vite, supporting **13 languages** with an automated daily translation pipeline powered by Mistral AI.

---

## What This Project Does

- Displays KESARi's inbound tour packages to international visitors in their native language
- Automatically translates content into 12 languages every day using Mistral AI API
- Allows visitors to submit enquiries which are sent to the KESARi team via email
- Provides an admin dashboard for the KESARi team to manage enquiries and tour packages

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + react-i18next |
| Backend | Node.js + Express + MongoDB |
| Translation | Mistral AI API |
| Scraping | Playwright (headless browser) |
| Scheduler | GitHub Actions (daily at 7:30 AM IST) |
| Hosting | Netlify |

---

## Languages Supported

English, Spanish, French, German, Italian, Portuguese, Polish, Hindi, Malayalam, Arabic, Chinese, Japanese, Korean

---

## How the Translation Pipeline Works

```
GitHub Actions (7:30 AM IST daily)
        ↓
Playwright scrapes English website → saves to INT/ENG/
        ↓
SHA-256 checks if any page changed
        ↓
Changed pages sent to Mistral API
        ↓
Mistral translates into 12 languages
        ↓
Saved into INT/es/, INT/fr/, INT/hi/ ... etc
```

1. **GitHub Actions** triggers the pipeline every day automatically
2. **Playwright** opens the English website and saves every page as HTML
3. **SHA-256 hashing** detects if any content has changed since yesterday
4. **Mistral API** translates only the changed pages into all 12 languages
5. Translated content is saved into language folders under `INT/`

---

## Project Structure

```
kesari-inbound/
├── src/                        # React frontend
│   ├── components/             # UI components (Navbar, LanguageSwitcher, etc.)
│   ├── locales/                # Translation JSON files (13 languages)
│   └── data/                   # Tour packages data
│
├── backend/                    # Node.js + Express backend
│   ├── routes/                 # API routes (enquiry, packages, auth)
│   ├── models/                 # MongoDB models
│   ├── services/               # Email service (nodemailer)
│   └── admin/                  # Admin dashboard (HTML + Chart.js)
│
├── pipeline/                   # Auto-translation pipeline
│   ├── scraper.py              # Playwright scraper
│   ├── translator.py           # Mistral API translation
│   ├── run.py                  # Pipeline runner
│   ├── config.py               # Languages and routes config
│   └── pipeline.ipynb          # Jupyter notebook to run manually
│
├── INT/                        # Translated HTML pages
│   ├── ENG/                    # Scraped English pages (source)
│   ├── es/                     # Spanish
│   ├── fr/                     # French
│   ├── de/                     # German
│   └── ...                     # 12 language folders total
│
└── .github/workflows/          # GitHub Actions — daily auto-sync
```

---

## Setup & Running Locally

### Frontend
```bash
npm install
npm run dev
```
Open `http://localhost:5173/INT`

### Backend
```bash
cd backend
npm install
node server.js
```
Admin dashboard at `http://localhost:3001/admin`

### Pipeline
```bash
cd pipeline
pip install -r requirements.txt
python run.py
```
Or open `pipeline/pipeline.ipynb` in Jupyter to run step by step.

---

## Environment Variables

### Backend (`backend/.env`)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail
EMAIL_PASS=your_gmail_app_password
EMAIL_TO=kesari_team_email
```

### Pipeline (`pipeline/.env`)
```
MISTRAL_API_KEY=your_mistral_api_key
```

---

## Key Features

- **13-language switcher** in the navbar — visitors pick their language and the entire website switches
- **Enquiry form** — visitor fills form, KESARi team gets email notification, visitor gets auto-reply
- **Admin dashboard** — view all enquiries, filter by language/status, export CSV, add packages
- **Daily auto-translation** — any update to the English website is automatically translated within 24 hours
- **Change detection** — only changed pages are translated, saving API costs

---

Built during internship at KESARi — Veer Shetty, 2026
