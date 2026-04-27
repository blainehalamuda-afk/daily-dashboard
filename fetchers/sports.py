"""Fetch Premier League scores and standings from football-data.org (free tier)."""

import os
import requests
from datetime import datetime, timedelta


_BASE = "https://api.football-data.org/v4"
_COMP = "PL"  # Premier League


def fetch(highlight_teams: list[str] | None = None) -> dict:
    api_key = os.environ.get("FOOTBALL_DATA_API_KEY", "")
    if not api_key:
        return {"error": True, "message": "FOOTBALL_DATA_API_KEY not set", "matches": [], "standings": []}

    headers = {"X-Auth-Token": api_key}
    highlight = {t.lower() for t in (highlight_teams or [])}

    # Date window: yesterday through tomorrow (catches finished + scheduled)
    today = datetime.utcnow().date()
    date_from = (today - timedelta(days=1)).isoformat()
    date_to   = (today + timedelta(days=1)).isoformat()

    matches = []
    standings = []

    try:
        r = requests.get(
            f"{_BASE}/competitions/{_COMP}/matches",
            headers=headers,
            params={"dateFrom": date_from, "dateTo": date_to},
            timeout=10,
        )
        r.raise_for_status()
        raw_matches = r.json().get("matches", [])

        for m in raw_matches:
            home = m["homeTeam"]["shortName"] or m["homeTeam"]["name"]
            away = m["awayTeam"]["shortName"] or m["awayTeam"]["name"]
            status = m["status"]
            score = m.get("score", {})
            full_time = score.get("fullTime", {})
            home_score = full_time.get("home")
            away_score = full_time.get("away")

            # Parse UTC date
            utc_dt = m.get("utcDate", "")
            try:
                dt = datetime.strptime(utc_dt, "%Y-%m-%dT%H:%M:%SZ")
                time_str = dt.strftime("%-I:%M %p UTC")
                day_str  = dt.strftime("%b %-d")
            except Exception:
                time_str = ""
                day_str  = ""

            highlighted = bool(highlight) and (
                home.lower() in highlight or away.lower() in highlight
            )

            matches.append({
                "home": home,
                "away": away,
                "home_score": home_score,
                "away_score": away_score,
                "status": status,
                "time": time_str,
                "date": day_str,
                "highlighted": highlighted,
            })

    except Exception as exc:
        return {"error": True, "message": str(exc), "matches": [], "standings": []}

    # Top 6 standings
    try:
        r2 = requests.get(
            f"{_BASE}/competitions/{_COMP}/standings",
            headers=headers,
            timeout=10,
        )
        r2.raise_for_status()
        raw_standings = r2.json().get("standings", [])
        total_table = next((s for s in raw_standings if s["type"] == "TOTAL"), None)
        if total_table:
            for row in total_table["table"][:6]:
                team_name = row["team"]["shortName"] or row["team"]["name"]
                standings.append({
                    "position": row["position"],
                    "team": team_name,
                    "played": row["playedGames"],
                    "won": row["won"],
                    "drawn": row["draw"],
                    "lost": row["lost"],
                    "gd": row["goalDifference"],
                    "points": row["points"],
                    "highlighted": team_name.lower() in highlight,
                })
    except Exception:
        pass  # Standings are optional — don't fail the whole section

    return {"error": False, "matches": matches, "standings": standings}
