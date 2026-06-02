import pkg from "whatsapp-web.js";

const { Client, LocalAuth } = pkg;

const client6261 = new Client({
  authStrategy: new LocalAuth({
    clientId: "bot6261",
  }),
  puppeteer: {
    executablePath: process.env.CHROME_PATH,
    headless: true,
    userDataDir: "/tmp/chrome-bot6261",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-web-resources",
      "--disable-extensions",
      "--disable-default-apps",
      "--disable-preconnect",
      "--disable-sync",
      "--disable-component-updates",
    ],
  },
});

export default client6261;
