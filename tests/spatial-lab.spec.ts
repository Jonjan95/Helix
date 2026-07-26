import { expect, test, type Page } from "@playwright/test";

const prototypeLabels = [
  "Baseline",
  "CSS / GSAP",
  "SVG depth",
  "Three.js",
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

test("keeps the spatial lab isolated from the production journey", async ({
  page,
  request,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.locator("[data-spatial-lab]")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /spatial design/i })).toHaveCount(
    0,
  );
  await expect(page.locator("canvas")).toHaveCount(0);

  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).not.toContain("/lab/spatial");
});

test("exposes four comparable directions through semantic controls", async ({
  page,
}) => {
  const consoleProblems: string[] = [];
  page.on("console", (message) => {
    const browserDriverNoise =
      message.text().includes("GL Driver Message") ||
      message.text().includes("WebGL warning:");
    if (
      !browserDriverNoise &&
      (message.type() === "error" || message.type() === "warning")
    ) {
      consoleProblems.push(message.text());
    }
  });
  page.on("pageerror", (error) => consoleProblems.push(error.message));

  await page.goto("/lab/spatial", { waitUntil: "networkidle" });

  await expect(page).toHaveTitle("Spatial Design Lab | Helix");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(
    page.getByRole("heading", { name: "Spatial design exploration", level: 1 }),
  ).toBeVisible();

  for (const label of prototypeLabels) {
    await expect(page.getByRole("radio", { name: new RegExp(label, "i") })).toBeVisible();
  }

  await page.getByRole("radio", { name: /CSS \/ GSAP/i }).check();
  await expect(page.locator('[data-spatial-prototype="css"]')).toBeVisible();
  await page.getByRole("button", { name: "Play forward" }).click();
  await page.getByRole("button", { name: "Reverse" }).click();
  await page.getByRole("button", { name: "Reset" }).click();

  await page.getByRole("radio", { name: /SVG depth/i }).check();
  await expect(page.locator('[data-spatial-prototype="svg"]')).toBeVisible();
  await page.getByText("strong", { exact: true }).click();
  await expect(page.locator('[data-spatial-depth="strong"]')).toBeVisible();

  await page.getByRole("radio", { name: /Three\.js/i }).check();
  const threePrototype = page.locator('[data-spatial-prototype="three"]');
  await expect(threePrototype).toBeVisible();
  await expect(threePrototype).toHaveAttribute(
    "data-webgl-state",
    /ready|fallback/,
    { timeout: 15_000 },
  );
  await expect(
    page.getByRole("heading", {
      name: "Real depth, deliberately contained.",
      level: 2,
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Return to production portfolio" }),
  ).toHaveAttribute("href", "/");
  expect(consoleProblems).toEqual([]);
});

test("provides a deterministic and informative WebGL fallback", async ({
  page,
}) => {
  await page.goto("/lab/spatial?webgl=off");
  await page.getByRole("radio", { name: /Three\.js/i }).check();

  const prototype = page.locator('[data-spatial-prototype="three"]');
  await expect(prototype).toHaveAttribute("data-webgl-state", "fallback");
  await expect(page.locator("[data-webgl-fallback]")).toContainText(
    "Spatial preview unavailable",
  );
  await expect(page.getByText(/Portfolio content remains semantic HTML/)).toBeVisible();
});

test("turns motion into a clear static comparison when reduction is requested", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/lab/spatial");
  await page.getByRole("radio", { name: /CSS \/ GSAP/i }).check();

  await expect(page.locator("[data-spatial-lab]")).toHaveAttribute(
    "data-spatial-reduced",
    "true",
  );
  await expect(page.getByRole("button", { name: "Play forward" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Reverse" })).toBeDisabled();
  await expect(page.getByText(/Static interpretation/)).toBeVisible();

  await page.getByRole("radio", { name: /Three\.js/i }).check();
  await expect(
    page.getByText(/Reduced-motion interpretation/),
  ).toBeVisible();
});

test("preserves keyboard operation and responsive document flow", async ({
  page,
}) => {
  await page.goto("/lab/spatial");
  const baseline = page.getByRole("radio", { name: /Baseline/i });

  await baseline.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: /CSS \/ GSAP/i })).toBeChecked();

  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 844, height: 390 },
    { width: 390, height: 844 },
    { width: 360, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    await expectNoHorizontalOverflow(page);
  }
});
