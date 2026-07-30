import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle" });
await page.fill("#password", "admin123");
await page.click('button[type="submit"]');
await page.waitForSelector("text=Website Editor", { timeout: 15000 });
await page.waitForTimeout(500);
await page.screenshot({ path: "screenshots/i18n-en.png" });

// Switch to FR
await page.click('button:has-text("FR")');
await page.waitForTimeout(400);
await page.screenshot({ path: "screenshots/i18n-fr.png" });
const frHeader = await page.locator("h1").first().textContent();
console.log("FR header:", frHeader);

// Switch to ES
await page.click('button:has-text("ES")');
await page.waitForTimeout(400);
await page.screenshot({ path: "screenshots/i18n-es.png" });
const esHeader = await page.locator("h1").first().textContent();
console.log("ES header:", esHeader);

// Switch to DE
await page.click('button:has-text("DE")');
await page.waitForTimeout(400);
await page.screenshot({ path: "screenshots/i18n-de.png" });
const deHeader = await page.locator("h1").first().textContent();
console.log("DE header:", deHeader);

// Type into the Main Heading field, open preview, verify live sync
const mainHeadingInput = page.locator("input").first();
await mainHeadingInput.fill("");
await mainHeadingInput.type("LIVE PREVIEW TEST 123", { delay: 20 });
await page.waitForTimeout(300);

// Click the eye/preview toggle (aria-label follows the DE dict's preview.title)
await page.locator('button[aria-label="Live-Vorschau"]').click();
await page.waitForTimeout(1500);
await page.screenshot({ path: "screenshots/preview-open.png" });

const iframeEl = await page.$("iframe[title='Live site preview']");
if (iframeEl) {
  const frame = await iframeEl.contentFrame();
  if (frame) {
    await frame.waitForTimeout?.(500);
    const bodyText = await frame.locator("body").innerText().catch(() => "N/A");
    console.log("IFRAME CONTAINS TEST TEXT:", bodyText.includes("LIVE PREVIEW TEST 123"));
  }
}

// Toggle device sizes
await page.click('button:has-text("Tablet")').catch(() => {});
await page.waitForTimeout(400);
await page.screenshot({ path: "screenshots/preview-tablet.png" });
await page.click('button:has-text("Mobil")').catch(() => {});
await page.waitForTimeout(400);
await page.screenshot({ path: "screenshots/preview-mobile.png" });

console.log("CONSOLE_ERRORS:", JSON.stringify(errors, null, 2));
await browser.close();
