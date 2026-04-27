"""
Daily data generator — fetches all data and writes data/daily.json.
The Next.js frontend reads this file to render the dashboard.
"""

import json
import os
from datetime import datetime
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

import config
from fetchers import weather, news, stocks, sports, ai_content
import discord_notify


def main():
    now = datetime.utcnow()
    date_str    = now.strftime("%A, %B %-d, %Y")
    updated_str = now.strftime("%-I:%M %p UTC")

    print(f"[{now.isoformat()}] Generating daily data for {date_str}")

    # ── Fetch ──────────────────────────────────────────────
    print("  Weather...", end=" ", flush=True)
    weather_data = weather.fetch(config.CITY, config.COUNTRY_CODE)
    print("ok" if not weather_data.get("error") else f"ERROR: {weather_data.get('message')}")

    print("  News...", end=" ", flush=True)
    news_data = news.fetch(config.NEWS_CATEGORIES, config.NEWS_COUNTRY, config.NEWS_PER_CATEGORY)
    print(f"ok ({len(news_data.get('articles', []))} articles)" if not news_data.get("error") else f"ERROR: {news_data.get('message')}")

    print("  Stocks...", end=" ", flush=True)
    stocks_data = stocks.fetch(config.STOCKS_WATCHLIST)
    print(f"ok ({len(stocks_data.get('tickers', []))} tickers)" if not stocks_data.get("error") else f"ERROR: {stocks_data.get('message')}")

    print("  Sports...", end=" ", flush=True)
    sports_data = sports.fetch(config.PL_TEAMS)
    print(f"ok ({len(sports_data.get('matches', []))} matches)" if not sports_data.get("error") else f"ERROR: {sports_data.get('message')}")

    print("  AI content (Claude)...", end=" ", flush=True)
    ai_data = ai_content.fetch(config.EXAM_FOCUS)
    print("ok" if not ai_data.get("error") else f"ERROR: {ai_data.get('message')}")

    # ── Assemble JSON ─────────────────────────────────────
    pl_content = ai_data.pop("pl_content", {}) if not ai_data.get("error") else {}
    market_sentiment = ai_data.pop("market_sentiment", None) if not ai_data.get("error") else None

    daily = {
        "generated_at": updated_str,
        "date": date_str,
        "weather": weather_data,
        "stocks": stocks_data,
        "news": news_data,
        "sports": sports_data,
        "pl_content": pl_content,
        "ai": {
            **ai_data,
            "market_sentiment": market_sentiment,
        },
    }

    # ── Write JSON ────────────────────────────────────────
    out_dir = Path(__file__).parent / "data"
    out_dir.mkdir(exist_ok=True)
    out_path = out_dir / "daily.json"
    out_path.write_text(json.dumps(daily, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"  Wrote {out_path}")

    # ── Discord ───────────────────────────────────────────
    print("  Discord...", end=" ", flush=True)
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
