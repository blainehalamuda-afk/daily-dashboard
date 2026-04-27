# ─────────────────────────────────────────────
#  USER CONFIGURATION  —  edit these values
# ─────────────────────────────────────────────

# Your city for weather (e.g. "London", "New York", "Chicago")
CITY = "CHARLOTTE"
COUNTRY_CODE = "US"          # ISO 3166-1 alpha-2 country code

# Stocks & crypto tickers (Yahoo Finance format)
# Equities: "AAPL", "TSLA", "NVDA"
# Crypto:   "BTC-USD", "ETH-USD", "SOL-USD"
STOCKS_WATCHLIST = [
    "SPY",
    "AAPL",
    "NVDA",
    "TSLA",
    "BTC-USD",
    "ETH-USD",
]

# Premier League teams you care about (used to highlight matches)
# Leave empty to show all PL matches for the day/round
PL_TEAMS = []  # e.g. ["Arsenal", "Chelsea", "Manchester City"]

# News categories fetched from NewsAPI
# Options: business, entertainment, health, science, sports, technology, general
NEWS_CATEGORIES = ["business", "technology", "general"]
NEWS_COUNTRY = "us"   # ISO country code for news
NEWS_PER_CATEGORY = 3  # headlines per category

# Dashboard public URL (set after enabling GitHub Pages)
DASHBOARD_URL = "https://blainehalamuda-afk.github.io/daily-dashboard/"

# What time the daily digest runs (only for display in the Discord message)
SCHEDULE_LABEL = "8:00 AM ET"

# CFA / FRM lesson settings
# Set to "CFA", "FRM", or "BOTH" to alternate randomly
EXAM_FOCUS = "BOTH"
