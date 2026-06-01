import "dotenv/config";
import client7493 from "./whatsapp/client7493.js";
import qrcode from "qrcode-terminal";

const NUMBER_7942 = process.env.NUMBER_7942;

client7493.on("qr", (qr) => {
  console.log("\nSCAN QR FOR 7493\n");
  qrcode.generate(qr, { small: true });
});

client7493.on("ready", () => {
  console.log("7493 READY");
});

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
    console.error(err);
  }
});

client7493.initialize();
