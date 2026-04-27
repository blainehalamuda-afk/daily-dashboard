"""Fetch top headlines from NewsAPI.org."""

import os
import requests
from datetime import datetime


def fetch(categories: list[str], country: str = "us", per_category: int = 3) -> dict:
    api_key = os.environ.get("NEWS_API_KEY", "")
    if not api_key:
        return {"error": True, "message": "NEWS_API_KEY not set", "articles": []}

    articles = []
    seen_titles: set[str] = set()

    for category in categories:
        try:
            r = requests.get(
                "https://newsapi.org/v2/top-headlines",
                params={
                    "country": country,
                    "category": category,
                    "pageSize": per_category,
                    "apiKey": api_key,
                },
                timeout=10,
            )
            r.raise_for_status()
            data = r.json()

            for art in data.get("articles", []):
                title = art.get("title", "").strip()
                if not title or title in seen_titles or title == "[Removed]":
                    continue
                seen_titles.add(title)

                # Format published time
                pub_raw = art.get("publishedAt", "")
                try:
                    pub_dt = datetime.strptime(pub_raw, "%Y-%m-%dT%H:%M:%SZ")
                    pub_str = pub_dt.strftime("%-I:%M %p UTC")
                except Exception:
                    pub_str = ""

                articles.append({
                    "title": title,
                    "source": art.get("source", {}).get("name", "Unknown"),
                    "url": art.get("url", "#"),
                    "description": (art.get("description") or "")[:200],
                    "published": pub_str,
                    "category": category.title(),
                })

        except Exception as exc:
            articles.append({
                "title": f"Could not load {category} news: {exc}",
                "source": "Error",
                "url": "#",
                "description": "",
                "published": "",
                "category": category.title(),
            })

    return {"error": False, "articles": articles}
