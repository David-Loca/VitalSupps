import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const errors = [];
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle" });
await page.waitForSelector("text=Admin Access");
await page.waitForTimeout(300);
await page.screenshot({ path: "screenshots/deco-login.png" });

await page.fill("#password", "admin123");
await page.click('button[type="submit"]');
await page.waitForSelector("text=Website Editor", { timeout: 15000 });
await page.waitForTimeout(500);
await page.screenshot({ path: "screenshots/deco-hero.png", fullPage: true });

await page.click("text=WhatsApp & CTA");
await page.waitForTimeout(400);
await page.screenshot({ path: "screenshots/deco-whatsapp.png", fullPage: true });

await page.click("text=Blogs");
await page.waitForTimeout(2000);
await page.screenshot({ path: "screenshots/deco-blogs.png", fullPage: true });

await page.click("text=Products");
await page.waitForTimeout(2000);
await page.screenshot({ path: "screenshots/deco-products.png", fullPage: true });

// Preview panel
await page.click("text=Homepage");
await page.waitForTimeout(300);
await page.locator('button[aria-label="Live preview"]').click();
await page.waitForTimeout(3000);
await page.screenshot({ path: "screenshots/deco-preview.png" });

console.log("CONSOLE_ERRORS:", JSON.stringify(errors, null, 2));
await browser.close();
