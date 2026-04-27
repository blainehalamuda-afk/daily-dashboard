"""
Generate all daily educational and analytical content using the Claude API.
Returns a single dict with: cfa_frm, finance_topic, japanese, ai_strategy, market_sentiment, pl_content
"""

import json
import os
import random
import anthropic


def fetch(exam_focus: str = "BOTH") -> dict:
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        return {"error": True, "message": "ANTHROPIC_API_KEY not set"}

    if exam_focus == "BOTH":
        exam = random.choice(["CFA Level 1", "CFA Level 2", "FRM Part 1", "FRM Part 2"])
    elif exam_focus == "CFA":
        exam = random.choice(["CFA Level 1", "CFA Level 2"])
    else:
        exam = random.choice(["FRM Part 1", "FRM Part 2"])

    prompt = f"""You are an expert educator, financial analyst, and AI strategist.
Generate daily content for a personal intelligence dashboard.
Return ONLY valid JSON — no markdown, no commentary. Exactly this structure:

{{
  "cfa_frm": {{
    "exam": "{exam}",
    "topic": "<topic area, e.g. Fixed Income, Credit Risk, Derivatives>",
    "question": "<exam-style multiple choice question>",
    "options": {{"A": "<text>", "B": "<text>", "C": "<text>", "D": "<text>"}},
    "correct": "<A/B/C/D>",
    "explanation": "<2-4 sentences explaining the correct answer and concept>"
  }},
  "finance_topic": {{
    "title": "<4-7 word topic title>",
    "subtitle": "<one sentence description>",
    "paragraphs": ["<para 1: define & introduce>", "<para 2: real-world context or example>", "<para 3: investor/risk manager implication>"],
    "key_takeaways": ["<takeaway 1>", "<takeaway 2>", "<takeaway 3>"]
  }},
  "japanese": {{
    "word": "<word in kanji/hiragana>",
    "reading": "<romaji>",
    "meaning": "<English meaning>",
    "part_of_speech": "<noun/verb/adjective/adverb>",
    "example_jp": "<natural example sentence>",
    "example_romaji": "<romanized>",
    "example_en": "<English translation>",
    "grammar_point": "<grammar pattern name, e.g. '〜ています'>",
    "grammar_explanation": "<1-2 beginner-friendly sentences>",
    "memory_tip": "<vivid mnemonic>"
  }},
  "ai_strategy": {{
    "headline": "<compelling 8-12 word headline about AI in finance/strategy/careers>",
    "summary": "<3-4 sentence summary of a key AI development relevant to finance professionals>",
    "concepts": [
      {{"term": "<AI/ML term 1>", "definition": "<plain-English definition relevant to finance>"}},
      {{"term": "<AI/ML term 2>", "definition": "<plain-English definition relevant to finance>"}},
      {{"term": "<AI/ML term 3>", "definition": "<plain-English definition relevant to finance>"}}
    ],
    "career_insight": "<2-3 sentences on how AI is changing finance/risk/strategy careers and what skills matter>"
  }},
  "market_sentiment": "<2-3 sentence AI-generated summary of current market conditions, macro themes, and sentiment — written like a brief morning note from a sell-side analyst>",
  "pl_content": {{
    "transfer_news": [
      {{"headline": "<transfer rumor or news headline>", "summary": "<1-2 sentence summary>", "clubs": ["<club1>", "<club2>"]}},
      {{"headline": "<transfer rumor or news headline>", "summary": "<1-2 sentence summary>", "clubs": ["<club1>", "<club2>"]}}
    ],
    "match_preview": {{
      "home": "<home team>",
      "away": "<away team>",
      "date": "<day and time>",
      "preview": "<2-3 sentence match preview covering form, stakes, and storylines>",
      "key_players": ["<player 1>", "<player 2>", "<player 3>"]
    }},
    "injury_news": [
      {{"player": "<name>", "team": "<team>", "status": "<Out/Doubtful/Recovering>", "return": "<expected return timeframe>"}},
      {{"player": "<name>", "team": "<team>", "status": "<Out/Doubtful/Recovering>", "return": "<expected return timeframe>"}}
    ]
  }}
}}

Quality guidelines:
- CFA/FRM: real exam-difficulty, tests deep conceptual understanding
- Finance topic: genuinely interesting, relevant to current markets
- Japanese: JLPT N5/N4, practical everyday vocabulary
- AI Strategy: focused on finance/risk/strategy professionals, not generic
- Market sentiment: sounds like Bloomberg morning note — specific macro themes
- PL Content: realistic current-season scenarios (may be illustrative if you lack live data)"""

    try:
        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=3000,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = message.content[0].text.strip()

        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        data = json.loads(raw)
        data["error"] = False
        return data

    except json.JSONDecodeError as exc:
        return {"error": True, "message": f"JSON parse error: {exc}"}
    except Exception as exc:
        return {"error": True, "message": str(exc)}
