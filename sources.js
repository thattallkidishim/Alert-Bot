import axios from "axios";

/**
 * SAFE BD SIGNAL SCORER
 */
function scoreItem(text) {
  if (!text || typeof text !== "string") return 0;

  const t = text.toLowerCase();

  const keywords = [
    // Funding signals (highest value)
    "raised",
    "funding",
    "seed",
    "series a",
    "series b",
    "series c",
    "investment",
    "backed",
    "venture",

    // Growth signals
    "launch",
    "beta",
    "waitlist",
    "growth",
    "traction",
    "scale",
    "users",

    // Partnership signals
    "partnership",
    "integration",
    "collaboration",
    "ecosystem",
    "strategic",

    // Product signals
    "api",
    "platform",
    "protocol",
    "sdk",
    "developer",

    // AI signals (very important now)
    "ai",
    "agent",
    "automation",
    "llm",
    "openai",

    // Market signals
    "acquisition",
    "acquired",
    "valuation",
    "startup",
    "unicorn"
  ];

  let score = 0;

  for (const k of keywords) {
    if (t.includes(k)) score++;
  }

  return score;
}

/**
 * ONLY RELIABLE SOURCE (NO RSS, NO BREAKING APIs)
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
