"""
Send a daily summary embed to Discord via a webhook.
Set the DISCORD_WEBHOOK_URL environment variable (or GitHub Actions secret).
"""

import os
import requests


def send(
    date_str: str,
    weather: dict,
    stocks: dict,
    sports: dict,
    news: dict,
    ai: dict,
    dashboard_url: str,
) -> None:
    webhook_url = os.environ.get("DISCORD_WEBHOOK_URL", "")
    if not webhook_url:
        print("DISCORD_WEBHOOK_URL not set — skipping notification.")
        return

    # ── Weather snippet ────────────────────────────────────
    if not weather.get("error"):
        weather_line = (
            f"{weather['icon']} **{weather['city']}** — "
            f"{weather['temp_f']}°F, {weather['description']}"
        )
    else:
        weather_line = "Weather unavailable"

    # ── Top 3 stocks ───────────────────────────────────────
    stock_lines = []
    for s in (stocks.get("items") or [])[:4]:
        if s.get("error"):
            continue
        arrow = "▲" if s["up"] else "▼"
        stock_lines.append(f"{s['symbol']} {arrow} ${s['price']:,.2f} ({s['change_pct']:+.2f}%)")
    stocks_text = "  |  ".join(stock_lines) if stock_lines else "Markets unavailable"

    # ── Sports snippet ─────────────────────────────────────
    sport_lines = []
    for m in (sports.get("matches") or [])[:3]:
        if m["status"] == "FINISHED":
            sport_lines.append(f"{m['home']} {m['home_score']}–{m['away_score']} {m['away']}")
        elif m["status"] in ("SCHEDULED", "TIMED"):
            sport_lines.append(f"{m['home']} vs {m['away']} @ {m['time']}")
    sports_text = "\n".join(sport_lines) if sport_lines else "No PL matches today"

    # ── Top news headline ──────────────────────────────────
    articles = news.get("articles") or []
    top_headline = articles[0]["title"] if articles else "No headlines"

    # ── AI snippet ─────────────────────────────────────────
    jp_line = ""
    if not ai.get("error") and "japanese" in ai:
        jp = ai["japanese"]
        jp_line = f"{jp['word']} ({jp['reading']}) — {jp['meaning']}"

    finance_title = ""
    if not ai.get("error") and "finance_topic" in ai:
        finance_title = ai["finance_topic"]["title"]

    # ── Build embed ────────────────────────────────────────
    embed = {
        "title": f"📊 Daily Dashboard — {date_str}",
        "url": dashboard_url,
        "color": 0x3b82f6,  # blue
        "description": (
            f"Your daily briefing is ready. [View full dashboard]({dashboard_url})"
        ),
        "fields": [
            {
                "name": "🌤️ Weather",
                "value": weather_line,
                "inline": False,
            },
            {
                "name": "📈 Markets",
                "value": stocks_text,
                "inline": False,
            },
            {
                "name": "⚽ Premier League",
                "value": sports_text,
                "inline": False,
            },
            {
                "name": "📰 Top Story",
                "value": top_headline,
                "inline": False,
            },
        ],
        "footer": {
            "text": "Daily Dashboard • Powered by Claude",
        },
    }

    if finance_title:
        embed["fields"].append({
            "name": "💼 Finance Deep-Dive",
            "value": finance_title,
            "inline": True,
        })

    if jp_line:
        embed["fields"].append({
            "name": "🇯🇵 Japanese Word",
            "value": jp_line,
            "inline": True,
        })

    payload = {"embeds": [embed]}
    r = requests.post(webhook_url, json=payload, timeout=10)
    r.raise_for_status()
