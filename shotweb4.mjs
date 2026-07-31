import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const errors = [];
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto("http://localhost:3000/en/blog/", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.screenshot({ path: "screenshots/web-blog-listing-en.png", fullPage: true });

const firstPost = page.locator("nav[aria-label] a").first();
if (await firstPost.count()) {
  await firstPost.click();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(600);
  await page.screenshot({ path: "screenshots/web-blog-post-en.png", fullPage: true });
}
console.log("CONSOLE_ERRORS:", JSON.stringify(errors, null, 2));
await browser.close();
