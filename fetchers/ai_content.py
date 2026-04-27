"""
Generate daily educational content using the Claude API:
  - CFA / FRM practice question
  - High-finance deep-dive topic
  - Japanese beginner lesson
"""

import json
import os
import random
import anthropic


def fetch(exam_focus: str = "BOTH") -> dict:
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        return {"error": True, "message": "ANTHROPIC_API_KEY not set"}

    # Pick which exam to feature today
    if exam_focus == "BOTH":
        exam = random.choice(["CFA Level 1", "CFA Level 2", "FRM Part 1", "FRM Part 2"])
    elif exam_focus == "CFA":
        exam = random.choice(["CFA Level 1", "CFA Level 2"])
    else:
        exam = random.choice(["FRM Part 1", "FRM Part 2"])

    prompt = f"""You are an expert financial educator. Generate daily educational content for a personal finance dashboard.
Return ONLY valid JSON — no markdown fences, no commentary, just the raw JSON object.

{{
  "cfa_frm": {{
    "exam": "{exam}",
    "topic": "<topic area, e.g. Fixed Income, Derivatives, Risk Management>",
    "question": "<exam-style multiple-choice question text>",
    "options": {{
      "A": "<option A>",
      "B": "<option B>",
      "C": "<option C>",
      "D": "<option D>"
    }},
    "correct": "<A, B, C, or D>",
    "explanation": "<2-4 sentence explanation of the correct answer and the underlying concept>"
  }},
  "finance_topic": {{
    "title": "<concise title, 4-7 words>",
    "subtitle": "<one-sentence description of the topic>",
    "paragraphs": [
      "<paragraph 1: introduce and define the concept>",
      "<paragraph 2: real-world context, current relevance, or historical example>",
      "<paragraph 3: implications for investors or risk managers>"
    ],
    "key_takeaways": [
      "<takeaway 1>",
      "<takeaway 2>",
      "<takeaway 3>"
    ]
  }},
  "japanese": {{
    "word": "<word in kanji/hiragana>",
    "reading": "<romaji>",
    "meaning": "<English meaning>",
    "part_of_speech": "<noun / verb / adjective / adverb>",
    "example_jp": "<natural example sentence in Japanese>",
    "example_romaji": "<romanized example>",
    "example_en": "<English translation>",
    "grammar_point": "<name of grammar pattern used in the example, e.g. '〜ています'>",
    "grammar_explanation": "<1-2 beginner-friendly sentences explaining the grammar pattern>",
    "memory_tip": "<fun or vivid mnemonic to remember the word>"
  }}
}}

Guidelines:
- CFA/FRM question must be at actual exam difficulty — test conceptual understanding, not just definitions.
- Finance topic should be something genuinely interesting and relevant to modern markets (avoid overly basic topics).
- Japanese lesson should target JLPT N5/N4 level — everyday vocabulary with a clear, beginner-friendly grammar note.
- All content must be accurate and well-explained."""

    try:
        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2048,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = message.content[0].text.strip()

        # Strip accidental markdown fences
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
