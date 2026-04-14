import Parser from "rss-parser";
import axios from "axios";

const parser = new Parser();

// Hacker News (real startup + tech signals)
export async function fetchHackerNews() {
  const res = await axios.get(
    "https://hn.algolia.com/api/v1/search_by_date?query=startup&tags=story"
  );

  return res.data.hits.slice(0, 5).map(post => ({
    title: post.title,
    url: post.url || `https://news.ycombinator.com/item?id=${post.objectID}`,
    source: "Hacker News"
  }));
}

// Product Hunt RSS (new product launches)
export async function fetchProductHunt() {
  const feed = await parser.parseURL("https://www.producthunt.com/feed");

  return feed.items.slice(0, 5).map(item => ({
    title: item.title,
    url: item.link,
    source: "Product Hunt"
  }));
}

// CoinGecko (new crypto tokens signal)
export async function fetchCrypto() {
  const res = await axios.get(
    "https://api.coingecko.com/api/v3/coins/list"
  );

  return res.data.slice(0, 5).map(coin => ({
    title: coin.name,
    url: `https://www.coingecko.com/en/coins/${coin.id}`,
    source: "CoinGecko"
  }));
}
