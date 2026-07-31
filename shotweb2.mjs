import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const errors = [];
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto("http://localhost:3000/fr/products/methylene-blue/", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.screenshot({ path: "screenshots/web-product-top.png", fullPage: false });

await page.mouse.wheel(0, 1000);
await page.waitForTimeout(500);
await page.screenshot({ path: "screenshots/web-product-benefits.png" });

await page.mouse.wheel(0, 1200);
await page.waitForTimeout(500);
await page.screenshot({ path: "screenshots/web-product-reviews.png" });

await page.mouse.wheel(0, 1400);
await page.waitForTimeout(500);
await page.screenshot({ path: "screenshots/web-product-faq.png" });

console.log("CONSOLE_ERRORS:", JSON.stringify(errors, null, 2));
await browser.close();
