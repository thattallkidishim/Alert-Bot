import axios from "axios";
import Parser from "rss-parser";

const parser = new Parser();

// keyword scoring engine
function scoreItem(text) {
  const keywords = [
    "startup",
    "launch",
    "funding",
    "partnership",
    "ecosystem",
    "AI",
    "API",
    "growth",
    "raises",
    "seed"
  ];

  let score = 0;
  const lower = text.toLowerCase();

  keywords.forEach(k => {
    if (lower.includes(k)) score++;
  });

  return score;
}

// Hacker News
export async function fetchHackerNews() {
  const res = await axios.get(
    "https://hn.algolia.com/api/v1/search_by_date?query=startup"
  );

  return res.data.hits.map(p => ({
    title: p.title,
    url: p.url || `https://news.ycombinator.com/item?id=${p.objectID}`,
    source: "Hacker News",
    score: scoreItem(p.title)
  }));
}

// Product Hunt
export async function fetchProductHunt() {
  const feed = await parser.parseURL("https://www.producthunt.com/feed");

  return feed.items.map(i => ({
    title: i.title,
    url: i.link,
    source: "Product Hunt",
    score: scoreItem(i.title)
  }));
}

// Dev.to (startup/dev signals)
export async function fetchDevTo() {
  const res = await axios.get("https://dev.to/api/articles?per_page=20");

  return res.data.map(a => ({
    title: a.title,
    url: a.url,
    source: "Dev.to",
    score: scoreItem(a.title)
  }));
}

// Reddit (startup signal feed)
export async function fetchReddit() {
  const res = await axios.get(
    "https://www.reddit.com/r/startups/new.json?limit=10"
  );

  return res.data.data.children.map(post => ({
    title: post.data.title,
    url: "https://reddit.com" + post.data.permalink,
    source: "Reddit",
    score: scoreItem(post.data.title)
  }));
}
