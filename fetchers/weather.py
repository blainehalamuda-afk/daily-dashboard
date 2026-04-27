"""Fetch current weather and a 3-day forecast from OpenWeatherMap."""

import os
import requests

# Map OWM icon codes to emojis
_ICON_MAP = {
    "01": "☀️",   # clear sky
    "02": "🌤️",  # few clouds
    "03": "⛅",   # scattered clouds
    "04": "☁️",   # broken/overcast clouds
    "09": "🌦️",  # shower rain
    "10": "🌧️",  # rain
    "11": "⛈️",   # thunderstorm
    "13": "❄️",   # snow
    "50": "🌫️",  # mist/fog
}

def _icon(code: str) -> str:
    return _ICON_MAP.get(code[:2], "🌡️")

def _c_to_f(c: float) -> int:
    return round(c * 9 / 5 + 32)

def _mps_to_mph(mps: float) -> int:
    return round(mps * 2.237)


def fetch(city: str, country_code: str = "US") -> dict:
    api_key = os.environ.get("OPENWEATHER_API_KEY", "")
    if not api_key:
        return {"error": True, "message": "OPENWEATHER_API_KEY not set"}

    base = "https://api.openweathermap.org/data/2.5"
    location = f"{city},{country_code}"

    try:
        # Current weather
        r = requests.get(
            f"{base}/weather",
            params={"q": location, "appid": api_key, "units": "metric"},
            timeout=10,
        )
        r.raise_for_status()
        cur = r.json()

        # 5-day / 3-hour forecast — sample at noon each day
        r2 = requests.get(
            f"{base}/forecast",
            params={"q": location, "appid": api_key, "units": "metric", "cnt": 40},
            timeout=10,
        )
        r2.raise_for_status()
        fc_raw = r2.json()["list"]

        # Build a simple 3-day forecast (pick the entry closest to 12:00 for each future day)
        from datetime import datetime, timedelta
        today_str = datetime.utcnow().strftime("%Y-%m-%d")
        daily: dict[str, list] = {}
        for entry in fc_raw:
            day = entry["dt_txt"][:10]
            if day == today_str:
                continue
            daily.setdefault(day, []).append(entry)

        forecast = []
        for day_str in sorted(daily.keys())[:3]:
            entries = daily[day_str]
            noon = min(entries, key=lambda e: abs(int(e["dt_txt"][11:13]) - 12))
            dt = datetime.strptime(day_str, "%Y-%m-%d")
            forecast.append({
                "day": dt.strftime("%a"),
                "icon": _icon(noon["weather"][0]["icon"]),
                "high": _c_to_f(noon["main"]["temp_max"]),
                "low":  _c_to_f(noon["main"]["temp_min"]),
                "description": noon["weather"][0]["description"].title(),
            })

        icon_code = cur["weather"][0]["icon"]
        return {
            "error": False,
            "city": cur["name"],
            "temp_f": _c_to_f(cur["main"]["temp"]),
            "feels_like_f": _c_to_f(cur["main"]["feels_like"]),
            "high_f": _c_to_f(cur["main"]["temp_max"]),
            "low_f": _c_to_f(cur["main"]["temp_min"]),
            "description": cur["weather"][0]["description"].title(),
            "icon": _icon(icon_code),
            "humidity": cur["main"]["humidity"],
            "wind_mph": _mps_to_mph(cur["wind"]["speed"]),
            "forecast": forecast,
        }

    except Exception as exc:
        return {"error": True, "message": str(exc)}
