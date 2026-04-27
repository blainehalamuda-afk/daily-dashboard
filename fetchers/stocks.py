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
        return {"error": False, "items": []}

    items = []
    try:
        tickers = yf.Tickers(" ".join(watchlist))
        for symbol in watchlist:
            try:
                t = tickers.tickers[symbol]
                info = t.fast_info

                price = getattr(info, "last_price", None)
                prev_close = getattr(info, "previous_close", None)

                if price is None or prev_close is None:
                    # Fallback: use history
                    hist = t.history(period="2d")
                    if len(hist) >= 2:
                        price = float(hist["Close"].iloc[-1])
                        prev_close = float(hist["Close"].iloc[-2])
                    elif len(hist) == 1:
                        price = float(hist["Close"].iloc[-1])
                        prev_close = price
                    else:
                        items.append({"symbol": symbol, "error": True})
                        continue

                change = price - prev_close
                change_pct = (change / prev_close) * 100 if prev_close else 0

                is_crypto = symbol.endswith("-USD")
                items.append({
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
                items.append({"symbol": symbol, "name": symbol, "error": True, "message": str(exc)})

    except Exception as exc:
        return {"error": True, "message": str(exc), "items": []}

    return {"error": False, "items": items}
