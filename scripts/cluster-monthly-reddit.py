#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Monthly LG Reddit – 월드컵 시청을 위해 TV 관련 고려하는 '인텐트' 기준 클러스터링"""

import csv
import re

INPUT_CSV = "public/data/monthly/reddit_g.csv"
OUTPUT_CSV = "public/data/monthly/reddit_cluster_results.csv"

# 인텐트: 월드컵 시청하기 위해 사람들이 TV 관련해서 고려하는 것 (구체적 인텐트 우선 배치)
CLUSTERS = [
    {
        "id": "C03",
        "label": "4K·화질 맞추려는 인텐트 (4K / Picture Quality for World Cup)",
        "keywords": [
            "4k", "4K", "HDR", "UHD", "picture", "quality", "image quality", "good picture",
            "washed", "washed out", "look like crap", "OLED", "Peacock", "fox sports",
        ],
    },
    {
        "id": "C04",
        "label": "케이블 없이·합법적으로 보려는 인텐트 (Watch Without Cable / Legally)",
        "keywords": [
            "without cable", "without …", "legally", "legally watch", "cable", "antenna",
        ],
    },
    {
        "id": "C07",
        "label": "스트리밍 품질 불만·문제 (Streaming Quality Complaints)",
        "keywords": [
            "crap", "horrible", "DAZN", "complaint", "issues", "feed", "debate",
        ],
    },
    {
        "id": "C08",
        "label": "언제·일정으로 볼지 고민 (When / Schedule to Watch)",
        "keywords": [
            "stay awake", "schedule", "games", "2026", "when", "time",
        ],
    },
    {
        "id": "C02",
        "label": "TV 살지·업그레이드할지 고민 (Buy/Upgrade TV for World Cup)",
        "keywords": [
            "buy", "purchase", "best TV", "TV for sports", "should i buy", "time to buy",
            "wait", "Black Friday", "Christmas", "deals", "parents", "Costco", "Curry",
            "Prime", "April", "smart tv", "buy a tv", "buying a tv",
        ],
    },
    {
        "id": "C06",
        "label": "기기·앱·설정 고민 (Device / App / Setup for World Cup)",
        "keywords": [
            "Roku", "LG", "device", "setup", "app", "on TV", "YouTubeTV", "DirectvStream",
            "adding sports channels", "stream on TV", "30 TVs",
        ],
    },
    {
        "id": "C01",
        "label": "어떤 서비스·채널로 볼지 고민 (Which Service/Channel to Watch)",
        "keywords": [
            "watch", "stream", "streaming", "service", "channel", "package", "best way",
            "how to watch", "where to watch", "which channel", "which service", "best streaming",
            "best app", "commentary", "full HD", "HD", "find", "live stream",
        ],
    },
    {
        "id": "C05",
        "label": "어느 채널·지역에서 나오는지 확인 (Which Channel / Regional Availability)",
        "keywords": [
            "rights", "broadcast", "BBC", "ITV", "Fox", "Fubo", "Sling", "exclusive",
            "coverage", "announces", "scores", "opt against", "televise", "NZ", "Australia",
            "Belgium", "qualifying", "draw", "games will be", "TV information",
        ],
    },
    {
        "id": "C09",
        "label": "다른 사람 시청법 궁금·논의 (How Others Watch / Discussion)",
        "keywords": [
            "how are you watching", "watching", "discussion", "discussions about",
            "people", "why do people", "audience", "record-breaking",
        ],
    },
]


def tokenize(text):
    if not text:
        return []
    text = re.sub(r"[^\w\s]", " ", text)
    return [w.lower() for w in text.split() if len(w) >= 2]


def infer_intent_terms(title):
    """제목에서 '월드컵 시청 위해 TV 고려' 인텐트 유추"""
    t = title.lower()
    extra = []
    if re.search(r"\b(how to watch|best way to watch|where to watch|any way to watch)\b", t):
        extra.extend(["watch", "how to watch", "best way", "service"])
    if re.search(r"\b(which channel|which service|what service|on what .* service)\b", t):
        extra.extend(["channel", "service", "package"])
    if re.search(r"\b(without cable|without …|legally watch)\b", t):
        extra.extend(["without cable", "legally"])
    if re.search(r"\b(should i buy|best time to buy|buy .* tv)\b", t):
        extra.extend(["buy", "purchase", "TV"])
    if re.search(r"\b(record-breaking|announces|scores exclusive|broadcast rights)\b", t):
        extra.extend(["rights", "broadcast", "coverage"])
    if re.search(r"\b(how are you watching|discussions about)\b", t):
        extra.extend(["watching", "discussion"])
    return extra


def score_post(title, title_tokens, cluster_keywords):
    combined = " ".join(title_tokens) + " " + title.lower() + " " + " ".join(infer_intent_terms(title))
    tokens_set = set(title_tokens) | set(infer_intent_terms(title))
    score = 0
    for kw in cluster_keywords:
        kw_lower = kw.lower()
        if " " in kw_lower:
            if kw_lower in combined:
                score += 2
            continue
        # 2글자 이하 토큰이 긴 키워드에 포함되는 건 제외 (예: 'in' → 'information')
        for t in tokens_set:
            if len(t) <= 2 and len(kw_lower) > 3:
                if t in kw_lower:
                    continue  # skip false positive
            if kw_lower in t or t in kw_lower:
                score += 1
                break
        else:
            if kw_lower in combined and len(kw_lower) >= 3:
                score += 1
    return score


def main():
    rows = []
    with open(INPUT_CSV, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            no = row.get("No", "").strip()
            title = row.get("Reddit 스레드 제목", row.get("title", "")).strip()
            subreddit = row.get("Subreddit", row.get("subreddit", "")).strip()
            url = row.get("링크", row.get("url", "")).strip()
            if not url or not title:
                continue
            rows.append({"no": no, "title": title, "subreddit": subreddit, "url": url})

    for row in rows:
        tokens = tokenize(row["title"])
        best_id, best_label, best_keywords, best_score = None, None, None, -1
        for c in CLUSTERS:
            s = score_post(row["title"], tokens, c["keywords"])
            if s > best_score:
                best_score = s
                best_id, best_label = c["id"], c["label"]
                best_keywords = c["keywords"]
        if best_id is None or best_score == 0:
            best_id, best_label = CLUSTERS[-1]["id"], CLUSTERS[-1]["label"]
            best_keywords = CLUSTERS[-1]["keywords"]
        row["cluster_id"] = best_id
        row["cluster_label"] = best_label
        row["cluster_top_terms"] = ", ".join(best_keywords[:10])

    out_rows = [
        {
            "No": r["no"],
            "title": r["title"],
            "subreddit": r["subreddit"],
            "url": r["url"],
            "cluster_id": r["cluster_id"],
            "cluster_label": r["cluster_label"],
            "cluster_top_terms": r["cluster_top_terms"],
        }
        for r in rows
    ]

    with open(OUTPUT_CSV, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["No", "title", "subreddit", "url", "cluster_id", "cluster_label", "cluster_top_terms"])
        w.writeheader()
        w.writerows(out_rows)

    from collections import Counter
    counts = Counter(r["cluster_id"] for r in rows)
    print("Cluster counts (인텐트 기준):", dict(counts))
    print(f"Written {len(out_rows)} rows -> {OUTPUT_CSV}")


if __name__ == "__main__":
    main()
