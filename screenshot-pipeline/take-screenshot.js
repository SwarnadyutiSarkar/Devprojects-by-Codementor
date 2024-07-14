// take-screenshot.js

const { chromium } = require('playwright');

async function takeScreenshot() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('YOUR_WEBSITE_URL');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshot.png' });
    await browser.close();
}

takeScreenshot();
