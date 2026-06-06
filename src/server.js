import "dotenv/config";
import express from "express";
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
].map((g) => g?.trim());

const NUMBER_7493 = process.env.NUMBER_7493?.trim();
const NUMBER_7942 = process.env.NUMBER_7942?.trim();

console.log("CONFIG:", { ALLOWED_GROUPS, NUMBER_7493, NUMBER_7942 });

const processedIds = new Set();
setInterval(() => {
  if (processedIds.size > 10000) processedIds.clear();
}, 60000);

const qrPng = (name, qr) => {
  toFile(`/tmp/qr-${name}.png`, qr).then(() => {
    console.log(`SCAN QR FOR ${name}: ${BASE}/qr/${name}`);
  });
};

client6261.on("qr", (qr) => {
  console.log("\n=== SCAN QR FOR 6261 ===");
  qrPng("6261", qr);
  qrcode.generate(qr, { small: true });
});

client7493.on("qr", (qr) => {
  console.log("\n=== SCAN QR FOR 7493 ===");
  qrPng("7493", qr);
  qrcode.generate(qr, { small: true });
});

app.get("/qr/:name", (req, res) => {
  res.sendFile(`/tmp/qr-${req.params.name}.png`, (err) => {
    if (err) res.status(404).send("QR not generated yet");
  });
});

client6261.on("ready", () => {
  console.log("6261 READY");
});

client6261.on("disconnected", (reason) => {
  console.log("6261 DISCONNECTED:", reason);
});

client6261.on("auth_failure", (msg) => {
  console.log("6261 AUTH FAILURE:", msg);
});

client7493.on("ready", () => {
  console.log("7493 READY");
});

client7493.on("disconnected", (reason) => {
  console.log("7493 DISCONNECTED:", reason);
});

client7493.on("auth_failure", (msg) => {
  console.log("7493 AUTH FAILURE:", msg);
});

setInterval(() => {
  console.log(`[HEARTBEAT] 6261=${client6261.info?.pushname || "?"} 7493=${client7493.info?.pushname || "?"}`);
}, 120000);

client6261.on("message_create", async (msg) => {
  try {
    if (msg.fromMe) return;
    if (!msg.id?.id || processedIds.has(msg.id.id)) return;
    processedIds.add(msg.id.id);

    if (!ALLOWED_GROUPS.includes(msg.from)) return;

    console.log(`[6261] GROUP -> ${NUMBER_7493} body="${msg.body?.slice(0, 80)}"`);

    if (msg.hasMedia) {
      const media = await msg.downloadMedia();
      if (media) {
        await client6261.sendMessage(NUMBER_7493, media, { caption: msg.body || "" });
      }
      return;
    }

    await client6261.sendMessage(NUMBER_7493, msg.body || "");
  } catch (err) {
    console.error("[6261] ERROR", err);
  }
});

client7493.on("message_create", async (msg) => {
  try {
    if (msg.fromMe) return;
    if (!msg.id?.id || processedIds.has(msg.id.id)) return;
    processedIds.add(msg.id.id);

    console.log(`[7493] "${msg.from}" -> ${NUMBER_7942} body="${msg.body?.slice(0, 80)}"`);

    if (msg.hasMedia) {
      const media = await msg.downloadMedia();
      if (media) {
        await client7493.sendMessage(NUMBER_7942, media, { caption: msg.body || "" });
      }
      return;
    }

    await client7493.sendMessage(NUMBER_7942, msg.body || "");
  } catch (err) {
    console.error("[7493] ERROR", err);
  }
});

client6261.initialize();
client7493.initialize();
