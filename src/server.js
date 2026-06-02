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
].map((g) => g?.trim());

const NUMBER_7493 = process.env.NUMBER_7493?.trim();
const NUMBER_7942 = process.env.NUMBER_7942?.trim();

/**
 * QR Events
 */
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

/**
 * Ready Events
 */
client6261.on("ready", () => {
  console.log("6261 READY - waiting for messages...");
});

client6261.on("disconnected", (reason) => {
  console.log("6261 DISCONNECTED:", reason);
});

client6261.on("auth_failure", (msg) => {
  console.log("6261 AUTH FAILURE:", msg);
});

client7493.on("ready", () => {
  console.log("7493 READY - waiting for messages...");
});

client7493.on("disconnected", (reason) => {
  console.log("7493 DISCONNECTED:", reason);
});

client7493.on("auth_failure", (msg) => {
  console.log("7493 AUTH FAILURE:", msg);
});

setInterval(() => {
  console.log(`[HEARTBEAT] 6261=${client6261.info?.pushname || "unknown"} 7493=${client7493.info?.pushname || "unknown"}`);
}, 120000);

/**
 * BOT 1
 * Groups -> 7493
 * Using message_create because `message` event doesn't fire for LID-format contacts
 */
client6261.on("message_create", async (msg) => {
  try {
    if (msg.fromMe) {
      return;
    }

    const groupId = msg.from;
    const isAllowed = ALLOWED_GROUPS.includes(groupId);

    if (!isAllowed) {
      return;
    }

    console.log(`[6261] GROUP "${groupId}" -> FORWARDING TO ${NUMBER_7493} body="${msg.body?.slice(0,80)}"`);

    if (msg.hasMedia) {
      const media = await msg.downloadMedia();

      if (media) {
        await client6261.sendMessage(NUMBER_7493, media, {
          caption: msg.body || "",
        });
        console.log(`[6261] MEDIA FORWARDED`);
      }

      return;
    }

    const sent = await client6261.sendMessage(NUMBER_7493, msg.body || "");
    console.log(`[6261] FORWARDED id=${sent.id?.id}`);
  } catch (err) {
    console.error("[6261] RELAY ERROR", err);
  }
});

/**
 * BOT 2
 * 7493 Inbox -> 7942
 * Using message_create because `message` event doesn't fire for LID-format contacts
 */
client7493.on("message_create", async (msg) => {
  try {
    if (msg.fromMe) {
      return;
    }

    console.log(`[7493] "${msg.from}" -> FORWARDING TO ${NUMBER_7942} body="${msg.body?.slice(0,80)}"`);

    if (msg.hasMedia) {
      const media = await msg.downloadMedia();

      if (media) {
        await client7493.sendMessage(NUMBER_7942, media, {
          caption: msg.body || "",
        });
        console.log(`[7493] MEDIA FORWARDED`);
      }

      return;
    }

    const sent = await client7493.sendMessage(NUMBER_7942, msg.body || "");
    console.log(`[7493] FORWARDED id=${sent.id?.id}`);
  } catch (err) {
    console.error("[7493] RELAY ERROR", err);
  }
});

client6261.initialize();
client7493.initialize();
