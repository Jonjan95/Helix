import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
}

test("loads the shared machine from the production Arrival", async ({ page }) => {
  const consoleProblems: string[] = [];
  page.on("console", (message) => {
    const driverNoise =
      message.text().includes("GL Driver Message") ||
      message.text().includes("WebGL warning:");
    if (["warning", "error"].includes(message.type()) && !driverNoise) {
      consoleProblems.push(message.text());
    }
  });
  page.on("pageerror", (error) => consoleProblems.push(error.message));

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const arrival = page.locator("[data-chapter='arrival']");
  const productionMachine = page.locator("[data-production-machine]");
  await expect(arrival.locator("h1")).toHaveCount(1);
  await expect(arrival.locator("h1")).toContainText("Jonathan Jansson");
  await expect(productionMachine.locator("canvas")).toHaveCount(1, {
    timeout: 15_000,
  });
  await expect(page.locator("[data-arrival-runtime='blending']")).toHaveCount(
    1,
    { timeout: 15_000 },
  );
  await expect(page.locator("[data-arrival-runtime='ready']")).toHaveCount(1, {
    timeout: 15_000,
  });
  await expect(page.locator("[data-motion-root='helix-experience']")).toHaveCount(1);
  await expect(page.locator(".pin-spacer")).toHaveCount(1);

  const pin = page.locator(".pin-spacer");
  await page.evaluate((top) => window.scrollTo(0, top * 0.5), await pin.evaluate((node) => node.getBoundingClientRect().height));
  await expect(page.locator("[data-machine-progress]")).not.toHaveAttribute(
    "data-machine-progress",
    "0.000",
  );
  await expectNoHorizontalOverflow(page);
  expect(consoleProblems).toEqual([]);
});

test("keeps the CSS Threshold available as the explicit and capability fallback", async ({
  page,
}) => {
  for (const query of ["?arrival=css", "?webgl=off", "?machine=error"]) {
    await page.goto(`/${query}`);
    await expect(page.locator("[data-arrival-mode='css']")).toHaveCount(1);
    await expect(page.locator("[data-arrival-css-fallback] [data-testid='laptop-hero']")).toBeVisible();
    await expect(page.locator("[data-production-machine]")).toHaveCount(0);
  }
});

test("uses a complete static open machine for reduced motion", async ({
  browser,
}) => {
  const context = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto("/");

  await expect(page.locator("[data-motion-state='reduced']")).toHaveCount(1);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("[data-arrival-runtime='ready']")).toHaveCount(1, {
    timeout: 15_000,
  });
  await expect(page.locator("[data-machine-progress='0.840']")).toHaveCount(1);
  await expect(page.locator("[data-machine-identity]")).toHaveAttribute(
    "data-identity-visible",
    "true",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expectNoHorizontalOverflow(page);
  await context.close();
});

test("keeps compact viewports on the unpinned CSS experience", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.locator("[data-arrival-mode='css']")).toHaveCount(1);
  await expect(page.locator("[data-production-machine]")).toHaveCount(0);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
});
