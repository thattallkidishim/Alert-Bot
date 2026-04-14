import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import express from "express";

import { fetchHackerNews, fetchProductHunt } from "./sources.js";
import { filterNew } from "./utils.js";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: false
});

const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// keep Railway alive
const app = express();
app.get("/", (req, res) => res.send("BD Bot Running"));
app.listen(process.env.PORT || 3000);

// send message
function send(item) {
  bot.sendMessage(
    CHAT_ID,
    `🚀 NEW SIGNAL\n\n${item.title}\n${item.url}\n\nSource: ${item.source}`
  );
}

// main scan
async function scan() {
  const hn = await fetchHackerNews();
  const ph = await fetchProductHunt();

  const all = [...hn, ...ph];
  const fresh = filterNew(all);

  fresh.forEach(send);
}

setInterval(scan, 5 * 60 * 1000);

console.log("Bot running...");
scan();
