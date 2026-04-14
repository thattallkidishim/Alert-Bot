import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import express from "express";

import {
  fetchHackerNews,
  fetchProductHunt,
  fetchCrypto
} from "./sources.js";

import { filterNew } from "./utils.js";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: false
});

const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// keep Railway alive
const app = express();
app.get("/", (req, res) => res.send("BD Alert Bot Running"));
app.listen(process.env.PORT || 3000);

// send message helper
function send(item) {
  const message = `
🚀 NEW SIGNAL DETECTED

📌 ${item.title}
🔗 ${item.url}
📊 Source: ${item.source}
`;

  bot.sendMessage(CHAT_ID, message);
}

// main loop
async function scan() {
  try {
    const hn = await fetchHackerNews();
    const ph = await fetchProductHunt();
    const crypto = await fetchCrypto();

    const all = [...hn, ...ph, ...crypto];
    const fresh = filterNew(all);

    fresh.forEach(send);

  } catch (err) {
    console.error("Scan error:", err.message);
  }
}

// run every 5 minutes
setInterval(scan, 5 * 60 * 1000);

console.log("BD Alert Bot is running...");
scan();
