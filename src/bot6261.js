import "dotenv/config";
import client6261 from "./whatsapp/client6261.js";

const ALLOWED_GROUPS = [
  process.env.ALLOWED_GROUP_1,
  process.env.ALLOWED_GROUP_2,
  process.env.ALLOWED_GROUP_3,
];

const NUMBER_7493 = process.env.NUMBER_7493;

client6261.on("ready", () => {
  console.log("6261 READY");
});

client6261.on("message", async (msg) => {
  try {
    if (!ALLOWED_GROUPS.includes(msg.from)) return;

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
    console.error(err);
  }
});

client6261.initialize();
