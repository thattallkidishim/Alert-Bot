import axios from "axios";

/**
 * SAFE + SMART BD SIGNAL SCORING
 * (prevents crashes + improves intelligence quality)
 */
function scoreItem(text) {
  if (!text || typeof text !== "string") return 0;

  const t = text.toLowerCase();

  // 🧠 REAL-WORLD BD / VC / STARTUP SIGNAL KEYWORDS
  const keywords = [
    // Funding signals (VERY HIGH VALUE)
    "raised",
    "funding",
    "seed",
    "pre-seed",
    "series a",
    "series b",
    "series c",
    "investment",
    "backed",
    "venture",
    "round",

    // Growth signals
    "launch",
    "beta",
    "waitlist",
    "growth",
    "users",
    "traction",
    "scale",
    "expansion",

    // Partnership signals
    "partnership",
    "collaboration",
    "integration",
    "ecosystem",
    "strategic",

    // Product signals
    "api",
    "platform",
    "protocol",
    "infrastructure",
    "tool",
    "developer",
    "sdk",

    // AI / Tech trend signals (high BD relevance now)
    "ai",
    "agent",
    "automation",
    "llm",
    "machine learning",
    "openai",
    "model",

    // Market signals
    "acquired",
    "acquisition",
    "valuation",
    "startup",
    "unicorn"
  ];

  let score = 0;

  for (const k of keywords) {
    if (t.includes(k)) {
      score++;
    }
  }

  return score;
}

/**
 * 🔥 HACKER NEWS (most stable BD signal source)
 */
export async function fetchHackerNews() {
  const res = await axios.get(
    "https://hn.algolia.com/api/v1/search_by_date?query=startup"
  );

  return res.data.hits.map(p => ({
    title: p.title || "",
    url: p.url || `https://news.ycombinator.com/item?id=${p.objectID}`,
    source: "Hacker News",
    score: scoreItem(p.title || "")
  }));
}
