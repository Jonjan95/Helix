import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
}

async function setArrivalProgress(page: Page, target: number) {
  const root = page.locator("[data-arrival-progress]");

  for (let attempt = 0; attempt < 16; attempt += 1) {
    const current = Number(await root.getAttribute("data-arrival-progress"));
    const difference = target - current;

    if (Math.abs(difference) <= 0.0008) return;

    await page.evaluate((delta) => window.scrollBy(0, delta), difference * 830);
    await page.waitForTimeout(260);
  }

  const current = Number(await root.getAttribute("data-arrival-progress"));
  expect(Math.abs(current - target)).toBeLessThanOrEqual(0.002);
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

test("keeps one laptop owner through the enhanced Threshold handoff", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/?arrivalDiagnostics=on");
  await expect(page.locator("[data-arrival-runtime='ready']")).toHaveCount(1, {
    timeout: 15_000,
  });

  await setArrivalProgress(page, 0.69);

  const root = page.locator("[data-arrival-progress]");
  const cssLaptop = page.locator("[data-arrival-css-fallback]");
  await expect(root).toHaveAttribute("data-arrival-owner", "webgl-threshold");
  await expect(cssLaptop.locator("[data-motion='laptop-shell']")).toHaveCSS(
    "visibility",
    "hidden",
  );
  await expect(cssLaptop.locator("[data-motion='laptop-base']")).toHaveCSS(
    "visibility",
    "hidden",
  );
  await expect(cssLaptop.locator("[data-motion='screen-identity']")).toHaveCSS(
    "opacity",
    "0",
  );
  await expect(page.locator("[data-production-machine]")).toBeVisible();
  await expect(page.locator("[data-screen-projected-bounds]")).not.toHaveAttribute(
    "data-screen-projected-bounds",
    "",
  );
});

test("exposes isolated renderer diagnostics without production controls", async ({
  page,
}) => {
  for (const mode of ["css", "webgl", "combined"] as const) {
    await page.goto(`/?arrivalDiagnostic=${mode}`);
    await expect(page.locator("[data-arrival-runtime='ready']")).toHaveCount(1, {
      timeout: 15_000,
    });
    await setArrivalProgress(page, 0.69);

    const root = page.locator("[data-arrival-diagnostic]");
    const cssOpacity = Number(
      await page
        .locator("[data-arrival-css-fallback]")
        .evaluate((element) => getComputedStyle(element).opacity),
    );
    const webglOpacity = Number(
      await page
        .locator("[data-production-machine]")
        .evaluate((element) => getComputedStyle(element).opacity),
    );

    await expect(root).toHaveAttribute("data-arrival-diagnostic", mode);
    if (mode === "css") {
      expect(cssOpacity).toBe(1);
      expect(webglOpacity).toBe(0);
    } else if (mode === "webgl") {
      expect(cssOpacity).toBe(0);
      expect(webglOpacity).toBe(1);
    } else {
      expect(cssOpacity).toBeGreaterThan(0);
      expect(webglOpacity).toBeGreaterThan(0);
    }

    await expect(page.locator("[data-camera-position]")).not.toHaveAttribute(
      "data-camera-position",
      "",
    );
    await expect(page.locator("[data-screen-projected-bounds]")).not.toHaveAttribute(
      "data-screen-projected-bounds",
      "",
    );
  }

  await expect(page.getByRole("button", { name: /diagnostic/i })).toHaveCount(0);
});

test("does not transfer renderer ownership after the visitor has moved on", async ({
  page,
}) => {
  let releaseModel: (() => void) | undefined;
  const modelGate = new Promise<void>((resolve) => {
    releaseModel = resolve;
  });

  await page.route("**/models/helix-machine.glb", async (route) => {
    await modelGate;
    await route.continue();
  });
  await page.goto("/?arrivalDiagnostic=webgl", {
    waitUntil: "domcontentloaded",
  });
  await expect(page.locator("[data-arrival-runtime='loading']")).toHaveCount(1, {
    timeout: 15_000,
  });
  await page.evaluate(() => window.scrollTo(0, 360));
  await expect(page.locator("[data-arrival-progress]")).not.toHaveAttribute(
    "data-arrival-progress",
    "0.0000",
  );
  await expect(page.locator("[data-arrival-css-fallback]")).toHaveCSS(
    "opacity",
    "1",
  );

  releaseModel?.();
  await expect(page.locator("[data-arrival-runtime='css']")).toHaveCount(1, {
    timeout: 15_000,
  });
  await expect(page.locator("[data-arrival-mode='css']")).toHaveCount(1);
  await expect(page.locator("[data-arrival-css-fallback]")).toBeVisible();
  await expect(page.locator("[data-production-machine]")).toHaveCount(0);
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
