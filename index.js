import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import express from "express";

import {
  fetchHackerNews,
  fetchProductHunt,
  fetchDevTo,
  fetchReddit
} from "./sources.js";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: false
});

const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// keep alive (Railway)
const app = express();
app.get("/", (req, res) => res.send("BD Intelligence Bot Running"));
app.listen(process.env.PORT || 3000);

// prevent spam duplicates
const seen = new Set();

function classify(score) {
  if (score >= 3) return "🔥 HOT";
  if (score >= 1) return "⚡ WARM";
  return "💤 LOW";
}

function send(item) {
  if (seen.has(item.title)) return;
  seen.add(item.title);

  if (item.score < 1) return; // filter noise

  const msg = `
🚀 BD SIGNAL (${classify(item.score)})

📌 ${item.title}
📊 Source: ${item.source}
📈 Score: ${item.score}/5

🔗 ${item.url}
`;

  bot.sendMessage(CHAT_ID, msg);
}

// main scan loop
async function scan() {
  try {
    const data = await Promise.all([
      fetchHackerNews(),
      fetchProductHunt(),
      fetchDevTo(),
      fetchReddit()
    ]);

    const all = data.flat();
    all.forEach(send);

  } catch (err) {
    console.error("Scan error:", err.message);
  }
}

setInterval(scan, 4 * 60 * 1000);

console.log("BD Intelligence Bot Running...");
scan();
