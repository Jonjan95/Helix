import { expect, test, type Page } from "@playwright/test";

const viewports = [
  { height: 1000, width: 1440 },
  { height: 800, width: 1280 },
  { height: 768, width: 1024 },
  { height: 1024, width: 768 },
  { height: 844, width: 390 },
  { height: 800, width: 360 },
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

async function waitForModel(page: Page) {
  await expect(page.locator("[data-machine-lab]")).toHaveAttribute(
    "data-model-state",
    "ready",
    { timeout: 15_000 },
  );
}

async function setProgress(page: Page, value: number) {
  const slider = page.getByRole("slider", { name: "Sequence progress" });
  await slider.evaluate((element, nextValue) => {
    const input = element as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )?.set;
    setter?.call(input, String(nextValue));
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);
}

test("keeps the Machine Lab isolated from production discovery and requests", async ({
  page,
  request,
}) => {
  const productionRequests: string[] = [];
  page.on("request", (resource) => productionRequests.push(resource.url()));

  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.locator("[data-machine-lab]")).toHaveCount(0);
  await expect(page.locator("canvas")).toHaveCount(0);
  expect(
    productionRequests.some((url) => url.includes("helix-machine.glb")),
  ).toBe(false);

  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).not.toContain("/lab/machine");

  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toMatch(/Disallow: \/(?:lab\/)?/);
});

test("exposes a semantic, reversible five-stage machine sequence", async ({
  page,
}) => {
  const consoleProblems: string[] = [];
  page.on("console", (message) => {
    const driverNoise =
      message.text().includes("GL Driver Message") ||
      message.text().includes("WebGL warning:");
    if (
      !driverNoise &&
      (message.type() === "error" || message.type() === "warning")
    ) {
      consoleProblems.push(message.text());
    }
  });
  page.on("pageerror", (error) => consoleProblems.push(error.message));

  await page.goto("/lab/machine");
  await expect(page).toHaveTitle("Machine Lab | Helix");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await waitForModel(page);

  const identity = page.locator("[data-machine-identity]");
  await expect(
    page.getByRole("heading", { level: 2, name: "Jonathan Jansson" }),
  ).toBeAttached();
  expect(await identity.evaluate((element) => element.closest("canvas"))).toBeNull();

  for (const state of ["0.00", "0.35", "0.52", "0.64", "0.88"]) {
    await setProgress(page, Number(state));
    await expect(page.locator("[data-machine-lab]")).toHaveAttribute(
      "data-machine-progress",
      Number(state).toFixed(3),
    );
  }
  await expect(identity).toHaveAttribute("data-identity-visible", "true");

  await setProgress(page, 0.32);
  await expect(identity).toHaveAttribute("data-identity-visible", "false");
  await setProgress(page, 0);
  await expect(page.locator("[data-machine-lab]")).toHaveAttribute(
    "data-machine-progress",
    "0.000",
  );
  expect(consoleProblems).toEqual([]);
});

test("supports native transport, keyboard control, loading, and fallback states", async ({
  page,
}) => {
  await page.route("**/models/helix-machine.glb", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    await route.continue();
  });
  await page.goto("/lab/machine");
  await expect(page.locator("[data-model-loading]")).toBeVisible();
  await waitForModel(page);

  const slider = page.getByRole("slider", { name: "Sequence progress" });
  await slider.focus();
  await page.keyboard.press("ArrowRight");
  await expect(slider).toHaveValue("0.01");

  await page.getByRole("button", { name: "Play forward" }).click();
  await expect
    .poll(async () => Number(await slider.inputValue()))
    .toBeGreaterThan(0.01);
  await page.getByRole("button", { name: "Play reverse" }).click();
  await expect
    .poll(async () => Number(await slider.inputValue()))
    .toBeLessThan(0.5);
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(slider).toHaveValue("0");

  await page.goto("/lab/machine?webgl=off");
  await expect(page.locator("[data-machine-fallback]")).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Jonathan Jansson" }),
  ).toBeVisible();
  await expect(page.getByText(/interactive 3D preview is unavailable/i)).toBeVisible();
});

test("turns the sequence into a complete static scene for reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/lab/machine");
  await waitForModel(page);

  const root = page.locator("[data-machine-lab]");
  await expect(root).toHaveAttribute("data-machine-reduced", "true");
  await expect(root).toHaveAttribute("data-machine-progress", "0.680");
  await expect(page.locator("[data-machine-identity]")).toHaveAttribute(
    "data-identity-visible",
    "true",
  );
  await expect(page.getByRole("button", { name: "Play forward" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Play reverse" })).toBeDisabled();
});

test("preserves responsive flow and avoids horizontal overflow", async ({ page }) => {
  await page.goto("/lab/machine");
  await waitForModel(page);

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await expectNoHorizontalOverflow(page);
  }
});
