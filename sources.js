import axios from "axios";
import Parser from "rss-parser";

const parser = new Parser();

// Hacker News signals
export async function fetchHackerNews() {
  const res = await axios.get(
    "https://hn.algolia.com/api/v1/search_by_date?query=startup"
  );

  return res.data.hits.slice(0, 5).map(p => ({
    title: p.title,
    url: p.url || `https://news.ycombinator.com/item?id=${p.objectID}`,
    source: "Hacker News"
  }));
}

// Product Hunt signals
export async function fetchProductHunt() {
  const feed = await parser.parseURL("https://www.producthunt.com/feed");

  return feed.items.slice(0, 5).map(i => ({
    title: i.title,
    url: i.link,
    source: "Product Hunt"
  }));
}
