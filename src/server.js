import "dotenv/config";
import qrcode from "qrcode-terminal";

import client6261 from "./whatsapp/client6261.js";
import client7493 from "./whatsapp/client7493.js";

const ALLOWED_GROUPS = [
  process.env.ALLOWED_GROUP_1,
  process.env.ALLOWED_GROUP_2,
  process.env.ALLOWED_GROUP_3,
];

const NUMBER_7493 = process.env.NUMBER_7493;
const NUMBER_7942 = process.env.NUMBER_7942;

/**
 * QR Events
 */
client6261.on("qr", (qr) => {
  console.log("\nSCAN QR FOR 6261\n");
  qrcode.generate(qr, { small: true });
});

client7493.on("qr", (qr) => {
  console.log("\nSCAN QR FOR 7493\n");
  qrcode.generate(qr, { small: true });
});

/**
 * Ready Events
 */
client6261.on("ready", () => {
  console.log("6261 READY");
});

client7493.on("ready", () => {
  console.log("7493 READY");
});

/**
 * BOT 1
 * Groups -> 7493
 */
client6261.on("message", async (msg) => {
  try {
    const groupId = msg.from;

    if (!ALLOWED_GROUPS.includes(groupId)) {
      return;
    }

    console.log("GROUP -> 7493");

    if (msg.hasMedia) {
      const media = await msg.downloadMedia();

      if (media) {
        await client6261.sendMessage(NUMBER_7493, media, {
          caption: msg.body || "",
        });
      }

      return;
    }

    await client6261.sendMessage(NUMBER_7493, msg.body || "");
  } catch (err) {
    console.error("GROUP RELAY ERROR", err);
  }
});

/**
 * BOT 2
 * 7493 Inbox -> 7942
 */
client7493.on("message", async (msg) => {
  try {
    if (msg.fromMe) return;

    console.log("7493 -> 7942");

    if (msg.hasMedia) {
      const media = await msg.downloadMedia();

      if (media) {
        await client7493.sendMessage(NUMBER_7942, media, {
          caption: msg.body || "",
        });
      }

      return;
    }

    await client7493.sendMessage(NUMBER_7942, msg.body || "");
  } catch (err) {
    console.error("7942 RELAY ERROR", err);
  }
});

client6261.initialize();
client7493.initialize();
