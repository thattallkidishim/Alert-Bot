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
 * KEEP ALIVE
 */
const app = express();
app.get("/", (req, res) => res.send("BD Intelligence Agent Running"));
app.listen(process.env.PORT || 3000);

/**
 * PRIORITY SYSTEM
 */
function priority(score) {
  if (score >= 10) return "P0 (URGENT)";
  if (score >= 6) return "P1 (HIGH)";
  if (score >= 3) return "P2 (WATCH)";
  return "IGNORE";
}

/**
 * TAG SYSTEM
 */
function tag(title) {
  const t = title.toLowerCase();

  if (t.includes("fund") || t.includes("raised")) return "💰 FUNDING";
  if (t.includes("hire") || t.includes("job")) return "💼 HIRING";
  if (t.includes("launch") || t.includes("beta")) return "🚀 LAUNCH";
  if (t.includes("partnership")) return "🤝 PARTNERSHIP";

  return "📊 GENERAL";
}

/**
 * SEND ALERT
 */
function send(item) {
  if (!item.title) return;

  if (item.score < 4) return;

  const pr = priority(item.score);
  if (pr === "IGNORE") return;

  bot.sendMessage(
    CHAT_ID,
    `🚀 BD INTELLIGENCE ALERT

${tag(item.title)} | ${pr}

📌 ${item.title}
👤 Founder / Contact: ${item.founder}
📊 Source: ${item.source}
📈 Score: ${item.score}/15

💡 Action:
${pr === "P0"
  ? "Reach out within 24h — high-value opportunity"
  : pr === "P1"
  ? "Prepare outreach + research founder"
  : "Track movement"}

🔗 ${item.url}`
  );
}

/**
 * MAIN LOOP
 */
async function scan() {
  try {
    const hn = await fetchHackerNews();

    const all = [...hn];
    const fresh = filterNew(all);

    fresh.forEach(send);

  } catch (err) {
    console.log("Error:", err.message);
  }
}

setInterval(scan, 4 * 60 * 1000);

console.log("🚀 BD Intelligence Agent Running...");
scan();
