import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await page.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle" });
await page.waitForTimeout(300);
await page.screenshot({ path: "screenshots/deco-login-crop.png", clip: { x: 1000, y: 0, width: 600, height: 400 } });
await browser.close();
