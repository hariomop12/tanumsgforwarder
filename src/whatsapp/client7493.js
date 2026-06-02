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
      "--disable-software-rasterizer",
      "--disable-sync",
      "--disable-component-updates",
      "--disable-default-apps",
      "--disable-preconnect",
      "--disable-breakpad",
      "--no-service-autorun",
      "--metrics-recording-only",
      "--safebrowsing-disable-auto-update",
      "--disable-background-networking",
      "--disable-client-side-phishing-detection",
      "--no-first-run",
      "--no-pings",
    ],
  },
});

export default client7493;
