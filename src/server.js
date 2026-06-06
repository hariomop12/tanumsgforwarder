import "dotenv/config";
import express from "express";
import { toFile } from "qrcode";
import qrcode from "qrcode-terminal";

import client from "./whatsapp/client.js";

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

const TARGET = process.env.NUMBER_7942?.trim();

console.log("CONFIG:", { ALLOWED_GROUPS, TARGET });

const processedIds = new Set();
setInterval(() => {
  if (processedIds.size > 10000) processedIds.clear();
}, 60000);

const qrPng = (name, qr) => {
  toFile(`/tmp/qr-${name}.png`, qr).then(() => {
    console.log(`SCAN QR: ${BASE}/qr/${name}`);
  });
};

client.on("qr", (qr) => {
  console.log("\n=== SCAN QR ===");
  qrPng("client", qr);
  qrcode.generate(qr, { small: true });
});

app.get("/qr/:name", (req, res) => {
  res.sendFile(`/tmp/qr-${req.params.name}.png`, (err) => {
    if (err) res.status(404).send("QR not generated yet");
  });
});

client.on("ready", () => {
  console.log("READY");
});

client.on("disconnected", (reason) => {
  console.log("DISCONNECTED:", reason);
});

client.on("auth_failure", (msg) => {
  console.log("AUTH FAILURE:", msg);
});

setInterval(() => {
  console.log(`[HEARTBEAT] ${client.info?.pushname || "?"}`);
}, 120000);

client.on("message_create", async (msg) => {
  try {
    if (msg.fromMe) return;
    if (!msg.id?.id || processedIds.has(msg.id.id)) return;
    processedIds.add(msg.id.id);

    if (!ALLOWED_GROUPS.includes(msg.from)) return;

    console.log(`[FORWARD] -> ${TARGET} body="${msg.body?.slice(0, 80)}"`);

    if (msg.hasMedia) {
      const media = await msg.downloadMedia();
      if (media) {
        await client.sendMessage(TARGET, media, { caption: msg.body || "" });
      }
      return;
    }

    await client.sendMessage(TARGET, msg.body || "");
  } catch (err) {
    console.error("[ERROR]", err);
  }
});

client.initialize();
