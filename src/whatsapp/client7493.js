import { existsSync } from "fs";
import pkg from "whatsapp-web.js";

const { Client, LocalAuth } = pkg;

const CHROME_PATHS = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  "/usr/bin/chromium-browser",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chrome",
].filter(Boolean);

const executablePath = CHROME_PATHS.find((p) => existsSync(p));

const client7493 = new Client({
  authStrategy: new LocalAuth({
    clientId: "relay7493",
  }),
  puppeteer: {
    executablePath,
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
