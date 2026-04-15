import axios from "axios";

/**
 * BD INTELLIGENCE SCORING ENGINE
 */
function scoreItem(text) {
  if (!text || typeof text !== "string") return 0;

  const t = text.toLowerCase();

  let score = 0;

  const money = [
    "raised", "funding", "seed", "series a", "series b", "series c",
    "backed", "venture", "investment", "valuation"
  ];

  const growth = [
    "launch", "beta", "waitlist", "traction", "growth",
    "users", "scale", "expansion"
  ];

  const bd = [
    "partnership", "integration", "collaboration",
    "ecosystem", "strategic"
  ];

  const hiring = [
    "hiring", "join", "team", "career", "recruiting", "job"
  ];

  const tech = [
    "api", "platform", "sdk", "developer",
    "ai", "agent", "automation", "llm"
  ];

  for (const k of money) if (t.includes(k)) score += 4;
  for (const k of growth) if (t.includes(k)) score += 2;
  for (const k of bd) if (t.includes(k)) score += 3;
  for (const k of hiring) if (t.includes(k)) score += 2;
  for (const k of tech) if (t.includes(k)) score += 1;

  return score;
}

/**
 * 🧠 SIMPLE FOUNDER / DECISION MAKER EXTRACTION
 * (ONLY from text — no external scraping)
 */
function extractPeople(text) {
  if (!text || typeof text !== "string") return "Unknown";

  // Common patterns in startup posts
  const patterns = [
    /founded by ([A-Z][a-z]+ [A-Z][a-z]+)/i,
    /by ([A-Z][a-z]+ [A-Z][a-z]+)/i,
    /ceo:? ([A-Z][a-z]+ [A-Z][a-z]+)/i,
    /co-founder:? ([A-Z][a-z]+ [A-Z][a-z]+)/i
  ];

  for (const p of patterns) {
    const match = text.match(p);
    if (match && match[1]) return match[1];
  }

  return "Unknown";
}

/**
 * HACKER NEWS SOURCE
 */
export async function fetchHackerNews() {
  const res = await axios.get(
    "https://hn.algolia.com/api/v1/search_by_date?query=startup"
  );

  return res.data.hits.map(p => ({
    title: p.title || "",
    url: p.url || `https://news.ycombinator.com/item?id=${p.objectID}`,
    source: "Hacker News",
    score: scoreItem(p.title || ""),
    founder: extractPeople(p.title || "")
  }));
}
