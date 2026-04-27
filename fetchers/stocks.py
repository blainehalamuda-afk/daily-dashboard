"""
Fetch stock and crypto prices.
Uses Finnhub (free tier, no IP blocking) — sign up at finnhub.io for a free key.
Falls back to yfinance if FINNHUB_API_KEY is not set.
"""

import os
import requests
import yfinance as yf


_NAMES = {
    "SPY":     "S&P 500 ETF",
    "QQQ":     "Nasdaq ETF",
    "DIA":     "Dow Jones ETF",
    "AAPL":    "Apple",
    "MSFT":    "Microsoft",
    "GOOGL":   "Alphabet",
    "AMZN":    "Amazon",
    "NVDA":    "NVIDIA",
    "TSLA":    "Tesla",
    "META":    "Meta",
    "BTC-USD": "Bitcoin",
    "ETH-USD": "Ethereum",
    "SOL-USD": "Solana",
    "BNB-USD": "BNB",
}

# Finnhub uses different symbols for crypto
_FINNHUB_CRYPTO = {
    "BTC-USD": "BINANCE:BTCUSDT",
    "ETH-USD": "BINANCE:ETHUSDT",
    "SOL-USD": "BINANCE:SOLUSDT",
    "BNB-USD": "BINANCE:BNBUSDT",
}


def _fetch_finnhub(symbol: str, api_key: str) -> dict | None:
    """Fetch a single quote from Finnhub. Returns None on failure."""
    try:
        finnhub_symbol = _FINNHUB_CRYPTO.get(symbol, symbol)
        r = requests.get(
            "https://finnhub.io/api/v1/quote",
            params={"symbol": finnhub_symbol, "token": api_key},
            timeout=10,
        )
        r.raise_for_status()
        data = r.json()
        price = data.get("c")       # current price
        prev  = data.get("pc")      # previous close
        if not price or not prev:
            return None
        change = price - prev
        change_pct = (change / prev) * 100
        is_crypto = symbol.endswith("-USD")
        return {
            "symbol": symbol.replace("-USD", ""),
            "full_symbol": symbol,
            "name": _NAMES.get(symbol, symbol),
            "price": round(price, 2),
            "change": round(change, 2),
            "change_pct": round(change_pct, 2),
            "up": change >= 0,
            "is_crypto": is_crypto,
            "error": False,
        }
    except Exception:
        return None


def _fetch_yfinance(symbol: str) -> dict | None:
    """Fallback: fetch via yfinance."""
    try:
        hist = yf.download(symbol, period="5d", auto_adjust=True, progress=False, threads=False)
        if hist.empty:
            return None
        price = float(hist["Close"].iloc[-1])
        prev  = float(hist["Close"].iloc[-2]) if len(hist) >= 2 else price
        change = price - prev
        change_pct = (change / prev) * 100 if prev else 0
        is_crypto = symbol.endswith("-USD")
        return {
            "symbol": symbol.replace("-USD", ""),
            "full_symbol": symbol,
            "name": _NAMES.get(symbol, symbol),
            "price": round(price, 2),
            "change": round(change, 2),
            "change_pct": round(change_pct, 2),
            "up": change >= 0,
            "is_crypto": is_crypto,
            "error": False,
        }
    except Exception:
        return None


def fetch(watchlist: list[str]) -> dict:
    if not watchlist:
        return {"error": False, "tickers": []}

    finnhub_key = os.environ.get("FINNHUB_API_KEY", "")
    tickers = []

    for symbol in watchlist:
        result = None

        if finnhub_key:
            result = _fetch_finnhub(symbol, finnhub_key)

        if result is None:
            result = _fetch_yfinance(symbol)

        if result is None:
            result = {"symbol": symbol.replace("-USD", ""), "name": _NAMES.get(symbol, symbol), "error": True}

        tickers.append(result)

    return {"error": False, "tickers": tickers}
