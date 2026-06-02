import pkg from "whatsapp-web.js";

const { Client, LocalAuth } = pkg;

const client7493 = new Client({
  authStrategy: new LocalAuth({
    clientId: "relay7493",
  }),
  puppeteer: {
    executablePath: process.env.CHROME_PATH,
    headless: true,
    userDataDir: "/tmp/chrome-bot7493",
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

export default client7493;
