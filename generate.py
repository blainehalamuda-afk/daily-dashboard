"""
Main orchestrator — fetches all data, renders the HTML dashboard, and triggers Discord notification.
Run directly (python generate.py) or via GitHub Actions.
"""

import os
import sys
from datetime import datetime
from pathlib import Path

# Load .env for local development
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from jinja2 import Environment, FileSystemLoader

import config
from fetchers import weather, news, stocks, sports, ai_content
import discord_notify


def main():
    now = datetime.utcnow()
    date_str    = now.strftime("%A, %B %-d, %Y")   # e.g. "Monday, April 27, 2026"
    updated_str = now.strftime("%-I:%M %p UTC")

    print(f"[{now.isoformat()}] Generating dashboard for {date_str}")

    # ── Fetch all data ─────────────────────────────────────
    print("  Fetching weather...", end=" ", flush=True)
    weather_data = weather.fetch(config.CITY, config.COUNTRY_CODE)
    print("ok" if not weather_data.get("error") else f"ERROR: {weather_data['message']}")

    print("  Fetching news...", end=" ", flush=True)
    news_data = news.fetch(config.NEWS_CATEGORIES, config.NEWS_COUNTRY, config.NEWS_PER_CATEGORY)
    print(f"ok ({len(news_data.get('articles', []))} articles)" if not news_data.get("error") else f"ERROR: {news_data['message']}")

    print("  Fetching stocks...", end=" ", flush=True)
    stocks_data = stocks.fetch(config.STOCKS_WATCHLIST)
    print(f"ok ({len(stocks_data.get('items', []))} tickers)" if not stocks_data.get("error") else f"ERROR: {stocks_data['message']}")

    print("  Fetching sports...", end=" ", flush=True)
    sports_data = sports.fetch(config.PL_TEAMS)
    print(f"ok ({len(sports_data.get('matches', []))} matches)" if not sports_data.get("error") else f"ERROR: {sports_data['message']}")

    print("  Generating AI content (CFA/FRM, Finance, Japanese)...", end=" ", flush=True)
    ai_data = ai_content.fetch(config.EXAM_FOCUS)
    print("ok" if not ai_data.get("error") else f"ERROR: {ai_data['message']}")

    # ── Render HTML ────────────────────────────────────────
    template_dir = Path(__file__).parent / "templates"
    env = Environment(loader=FileSystemLoader(str(template_dir)), autoescape=True)
    template = env.get_template("dashboard.html")

    html = template.render(
        date=date_str,
        updated_at=updated_str,
        weather=weather_data,
        news=news_data,
        stocks=stocks_data,
        sports=sports_data,
        ai=ai_data,
        dashboard_url=config.DASHBOARD_URL,
    )

    # ── Write to docs/index.html ───────────────────────────
    out_dir = Path(__file__).parent / "docs"
    out_dir.mkdir(exist_ok=True)
    out_path = out_dir / "index.html"
    out_path.write_text(html, encoding="utf-8")
    print(f"  Dashboard written to {out_path}")

    # ── Send Discord notification ──────────────────────────
    print("  Sending Discord notification...", end=" ", flush=True)
    try:
        discord_notify.send(
            date_str=date_str,
            weather=weather_data,
            stocks=stocks_data,
            sports=sports_data,
            news=news_data,
            ai=ai_data,
            dashboard_url=config.DASHBOARD_URL,
        )
        print("ok")
    except Exception as exc:
        print(f"ERROR: {exc}")

    print("Done.")


if __name__ == "__main__":
    main()
