"""Fetch stock and crypto prices using yfinance (no API key required)."""

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


def fetch(watchlist: list[str]) -> dict:
    if not watchlist:
        return {"error": False, "tickers": []}

    tickers = []
    for symbol in watchlist:
        try:
            # Download 5 days of history — most reliable method in CI environments
            hist = yf.download(
                symbol,
                period="5d",
                auto_adjust=True,
                progress=False,
                threads=False,
            )

            if hist.empty or len(hist) < 1:
                tickers.append({"symbol": symbol, "name": _NAMES.get(symbol, symbol), "error": True})
                continue

            price = float(hist["Close"].iloc[-1])
            prev_close = float(hist["Close"].iloc[-2]) if len(hist) >= 2 else price
            change = price - prev_close
            change_pct = (change / prev_close) * 100 if prev_close else 0
            is_crypto = symbol.endswith("-USD")

            tickers.append({
                "symbol": symbol.replace("-USD", ""),
                "full_symbol": symbol,
                "name": _NAMES.get(symbol, symbol),
                "price": round(price, 2),
                "change": round(change, 2),
                "change_pct": round(change_pct, 2),
                "up": change >= 0,
                "is_crypto": is_crypto,
                "error": False,
            })

        except Exception as exc:
            tickers.append({"symbol": symbol, "name": _NAMES.get(symbol, symbol), "error": True, "message": str(exc)})

    return {"error": False, "tickers": tickers}
