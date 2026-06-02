import pkg from "whatsapp-web.js";

const { Client, LocalAuth } = pkg;

const client7493 = new Client({
  authStrategy: new LocalAuth({
    clientId: "relay7493",
  }),
  puppeteer: {
    executablePath: process.env.CHROME_PATH,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-web-resources",
      "--disable-extensions",
      "--disable-default-apps",
      "--disable-preconnect",
      "--single-process",
    ],
  },
});

export default client7493;
