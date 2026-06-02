import pkg from "whatsapp-web.js";

const { Client, LocalAuth } = pkg;

const client6261 = new Client({
  authStrategy: new LocalAuth({
    clientId: "bot6261",
  }),
  puppeteer: {
    executablePath: process.env.CHROME_PATH,
    headless: true,
    userDataDir: "/tmp/chrome-profile-bot6261",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-software-rasterizer",
      "--disable-sync",
      "--disable-component-updates",
      "--disable-default-apps",
      "--disable-preconnect",
      "--disable-breakpad",
      "--no-service-autorun",
      "--metrics-recording-only",
      "--safebrowsing-disable-auto-update",
    ],
  },
});

export default client6261;
