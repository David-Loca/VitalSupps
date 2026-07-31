import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const errors = [];
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto("http://localhost:3000/fr/", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.screenshot({ path: "screenshots/web-home-top.png" });

await page.mouse.wheel(0, 900);
await page.waitForTimeout(600);
await page.screenshot({ path: "screenshots/web-home-scrolled.png" });

await page.mouse.wheel(0, 1200);
await page.waitForTimeout(600);
await page.screenshot({ path: "screenshots/web-home-products.png" });

await page.mouse.wheel(0, 1400);
await page.waitForTimeout(600);
await page.screenshot({ path: "screenshots/web-home-features.png" });

await page.mouse.wheel(0, 1600);
await page.waitForTimeout(600);
await page.screenshot({ path: "screenshots/web-home-faq.png" });

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(600);
await page.screenshot({ path: "screenshots/web-home-footer.png" });

console.log("CONSOLE_ERRORS:", JSON.stringify(errors, null, 2));
await browser.close();
