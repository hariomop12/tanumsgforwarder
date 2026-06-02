import "dotenv/config";
import express from "express";
import { writeFileSync } from "fs";
import { toFile } from "qrcode";
import qrcode from "qrcode-terminal";

import client6261 from "./whatsapp/client6261.js";
import client7493 from "./whatsapp/client7493.js";

const app = express();
const PORT = process.env.PORT || 3000;

const BASE = process.env.SEVALLA_URL || "";

app.get("/", (_req, res) => res.send("OK"));
app.get("/health", (_req, res) => res.send("OK"));

app.listen(PORT, () => console.log(`Health server on ${PORT}`));

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
const qrPng = (name, qr) => {
  toFile(`/tmp/qr-${name}.png`, qr).then(() => {
    console.log(`SCAN QR FOR ${name}: ${BASE}/qr/${name}`);
  });
};

client6261.on("qr", (qr) => {
  qrPng("6261", qr);
  qrcode.generate(qr, { small: true });
});

client7493.on("qr", (qr) => {
  qrPng("7493", qr);
  qrcode.generate(qr, { small: true });
});

app.get("/qr/:name", (req, res) => {
  res.sendFile(`/tmp/qr-${req.params.name}.png`, (err) => {
    if (err) res.status(404).send("QR not generated yet");
  });
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
