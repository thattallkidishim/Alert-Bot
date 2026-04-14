import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import express from "express";

import { fetchHackerNews } from "./sources.js";
import { filterNew } from "./utils.js";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: false
});

const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

/**
 * KEEP RAILWAY ALIVE
 */
const app = express();
app.get("/", (req, res) => res.send("BD Intelligence Bot Running"));
app.listen(process.env.PORT || 3000);

/**
 * CLASSIFY SIGNAL STRENGTH
 */
function classify(score) {
  if (score >= 3) return "🔥 HOT";
  if (score >= 1) return "⚡ WARM";
  return "💤 LOW";
}

/**
 * SEND TELEGRAM MESSAGE
 */
function send(item) {
  if (!item.title) return;
  if (item.score < 1) return;

  bot.sendMessage(
    CHAT_ID,
    `🚀 BD SIGNAL (${classify(item.score)})

📌 ${item.title}
📊 Source: ${item.source}
📈 Score: ${item.score}/5

🔗 ${item.url}`
  );
}

/**
 * MAIN SCAN LOOP
 */
async function scan() {
  try {
    const hn = await fetchHackerNews();

    const all = [...hn];
    const fresh = filterNew(all);

    fresh.forEach(send);

  } catch (err) {
    console.log("Scan error:", err.message);
  }
}

setInterval(scan, 5 * 60 * 1000);

console.log("🚀 BD Intelligence Bot Running...");
scan();
