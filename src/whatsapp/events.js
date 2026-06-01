export const registerEvents = (client) => {
  client.on("message", async (msg) => {
    try {
      // Sirf groups
      if (!msg.from.endsWith("@g.us")) return;

      const target = process.env.TARGET_NUMBER;

      // Original message same ka same
      await msg.forward(target);

      console.log(`Forwarded from ${msg.from} -> ${target}`);
    } catch (err) {
      console.error(err);
    }
  });
};
