import pkg from "whatsapp-web.js";

const { Client, LocalAuth } = pkg;

const client6261 = new Client({
  authStrategy: new LocalAuth({
    clientId: "bot6261",
  }),
  puppeteer: {
    executablePath: "/usr/bin/chromium",
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  },
});

export default client6261;
