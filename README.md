# Daily Dashboard

A personal dashboard that auto-generates every morning and delivers a summary to Discord.

**What it includes:**
- Weather forecast (OpenWeatherMap)
- Stock & crypto watchlist (Yahoo Finance — no key needed)
- Premier League scores & standings (football-data.org)
- Top news headlines (NewsAPI)
- CFA / FRM daily practice question (Claude AI)
- Finance deep-dive topic (Claude AI)
- Japanese beginner lesson (Claude AI)

---

## Setup Guide

### 1. Fork / clone this repo to GitHub

```bash
git clone https://github.com/YOUR_USERNAME/daily-dashboard.git
cd daily-dashboard
```

### 2. Get your API keys (all free tiers)

| Service | Where to sign up | Key name |
|---|---|---|
| OpenWeatherMap | https://openweathermap.org/api | `OPENWEATHER_API_KEY` |
| NewsAPI | https://newsapi.org | `NEWS_API_KEY` |
| Anthropic (Claude) | https://console.anthropic.com | `ANTHROPIC_API_KEY` |
| football-data.org | https://www.football-data.org/client/register | `FOOTBALL_DATA_API_KEY` |
| Discord Webhook | See step 4 below | `DISCORD_WEBHOOK_URL` |

### 3. Add secrets to GitHub Actions

In your GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**

Add each key listed in the table above.

### 4. Create a Discord webhook

1. Open Discord → go to a private channel (or create one like `#dashboard`)
2. Click the gear icon → **Integrations → Webhooks → New Webhook**
3. Copy the webhook URL and add it as `DISCORD_WEBHOOK_URL` in GitHub Secrets

### 5. Configure your dashboard

Edit `config.py`:

```python
CITY = "New York"           # your city
COUNTRY_CODE = "US"

STOCKS_WATCHLIST = ["SPY", "AAPL", "NVDA", "TSLA", "BTC-USD", "ETH-USD"]

PL_TEAMS = ["Arsenal"]      # highlight your team (or leave empty for all)

DASHBOARD_URL = "https://YOUR_USERNAME.github.io/daily-dashboard/"
```

### 6. Enable GitHub Pages

1. GitHub repo → **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` | Folder: `/docs`
4. Save — your dashboard will be live at `https://YOUR_USERNAME.github.io/daily-dashboard/`

### 7. Test it manually

Push your changes, then go to **Actions → Daily Dashboard → Run workflow**.

The workflow will:
1. Fetch all data
2. Generate `docs/index.html`
3. Commit & push the file
4. Send you a Discord message with a summary + link

---

## Schedule

The dashboard runs daily at **12:00 UTC (8:00 AM ET)** by default.

To change the time, edit `.github/workflows/daily.yml`:

```yaml
- cron: '0 12 * * *'   # minute hour day month weekday (UTC)
```

Examples:
- `'0 13 * * *'` → 9:00 AM ET
- `'0 14 * * *'` → 10:00 AM ET
- `'30 11 * * *'` → 7:30 AM ET

---

## Local development

```bash
pip install -r requirements.txt

# Create a .env file with your keys:
cp .env.example .env   # then fill in your keys

python generate.py
# Opens docs/index.html with your browser to preview
```

---

## Project structure

```
daily-dashboard/
├── .github/workflows/daily.yml   # GitHub Actions cron job
├── docs/index.html               # Generated dashboard (served by GitHub Pages)
├── fetchers/
│   ├── weather.py                # OpenWeatherMap
│   ├── news.py                   # NewsAPI
│   ├── stocks.py                 # yfinance (no key needed)
│   ├── sports.py                 # football-data.org
│   └── ai_content.py             # Claude API
├── templates/dashboard.html      # Jinja2 HTML template
├── config.py                     # Your settings
├── generate.py                   # Main script
├── discord_notify.py             # Discord webhook sender
└── requirements.txt
```
