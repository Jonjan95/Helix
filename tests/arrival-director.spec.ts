import { expect, test, type Page } from "@playwright/test";

const viewportPresets = [
  "1440 × 1000",
  "1280 × 800",
  "1024 × 768",
  "768 × 1024",
  "390 × 844",
] as const;

async function waitForDirector(page: Page) {
  await expect(page.locator("[data-arrival-director]"))
    .toHaveAttribute("data-director-runtime", "ready", { timeout: 15_000 });
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

test("keeps the Arrival Director isolated and neutral", async ({ page, request }) => {
  await page.goto("/lab/machine/director");
  await waitForDirector(page);

  await expect(page).toHaveTitle("Arrival Director | Helix");
  await expect(page.getByRole("heading", { level: 1, name: "Arrival Director" })).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator("[data-director-machine-canvas]")).toHaveCount(1);

  const activePose = page.getByRole("combobox", { name: "Active pose" });
  const expectedSlots = [
    "closed-dark",
    "opening-midpoint",
    "open-hero",
    "identity-hold",
    "front-facing",
    "threshold-entry",
  ];
  await expect(activePose.locator("option")).toHaveCount(6);
  expect(await activePose.locator("option").allTextContents()).toEqual(expectedSlots);

  for (const slot of expectedSlots) {
    await activePose.selectOption({ label: slot });
    await expect(page.getByRole("spinbutton", { name: "Camera position X numeric value" })).toHaveValue("4.6");
    await expect(page.getByRole("spinbutton", { name: "Lid angle numeric value" })).toHaveValue("1.50796");
    await expect(page.getByRole("spinbutton", { name: "Screen luminance numeric value" })).toHaveValue("0");
  }

  await expect(page.locator("[data-director-guide]")).toHaveCount(0);
  await expect(page.locator('[data-director-screen-guide="true"]')).toHaveCount(0);

  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).not.toContain("/lab/machine/director");

  await page.goto("/");
  await expect(page.locator("[data-arrival-director]")).toHaveCount(0);
  await expect(page.locator("[data-production-machine]")).toBeAttached();
});

test("edits, persists, duplicates, renames, compares, exports, and imports poses locally", async ({ context, page }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/lab/machine/director");
  await waitForDirector(page);

  const cameraX = page.getByRole("spinbutton", { name: "Camera position X numeric value" });
  await cameraX.fill("3.25");
  await expect(page.getByRole("status")).toHaveText("Unsaved changes.");

  await page.reload();
  await waitForDirector(page);
  await expect(cameraX).toHaveValue("4.6");

  await cameraX.fill("3.25");
  await page.getByRole("button", { name: "Save pose locally" }).click();
  await page.reload();
  await waitForDirector(page);
  await expect(cameraX).toHaveValue("3.25");

  await page.getByRole("button", { name: "Duplicate pose" }).click();
  await expect(page.getByRole("combobox", { name: "Active pose" }).locator("option")).toHaveCount(7);
  await page.getByRole("textbox", { name: "Pose name" }).fill("review-alternate");
  await page.getByRole("button", { name: "Rename pose" }).click();
  await expect(page.getByRole("combobox", { name: "Active pose" })).toHaveValue(/pose-/);
  await expect(page.getByRole("combobox", { name: "Active pose" }).locator("option:checked")).toHaveText("review-alternate");

  await page.getByRole("button", { name: "Copy current pose as JSON" }).click();
  await expect(page.getByRole("status")).toHaveText("Current pose copied as JSON.");
  const currentExport = await page.evaluate(() => navigator.clipboard.readText());
  expect(JSON.parse(currentExport).name).toBe("review-alternate");

  await page.getByRole("button", { name: "Copy all poses as JSON" }).click();
  const allExport = JSON.parse(await page.evaluate(() => navigator.clipboard.readText()));
  expect(allExport.version).toBe(1);
  expect(allExport.poses).toHaveLength(7);

  await page.getByRole("combobox", { name: "Pose A" }).selectOption({ label: "closed-dark" });
  await page.getByRole("combobox", { name: "Pose B" }).selectOption({ label: "review-alternate" });
  await page.getByRole("button", { name: "Compare two saved poses" }).click();
  await expect(page.locator("[data-director-comparison]")).toBeVisible();
  await expect(page.locator("[data-director-machine-canvas]")).toHaveCount(2);
  await page.getByRole("button", { name: "Return to editor preview" }).click();

  const importedPose = {
    ...allExport.poses[0],
    id: "imported-review",
    name: "imported-review",
    cameraPosition: { x: 1, y: 2, z: 5 },
  };
  await page.getByRole("textbox", { name: "Pose JSON" }).fill(JSON.stringify(importedPose));
  await page.getByRole("button", { name: "Import pose JSON" }).click();
  await expect(page.getByRole("status")).toHaveText("1 pose imported locally.");
  await expect(page.getByRole("spinbutton", { name: "Camera position X numeric value" })).toHaveValue("1");

  await page.getByRole("textbox", { name: "Pose JSON" }).fill('{"invalid":true}');
  await page.getByRole("button", { name: "Import pose JSON" }).click();
  await expect(page.getByRole("status")).toContainText("invalid or out-of-range pose");

  await page.getByRole("button", { name: "Delete pose" }).click();
  await expect(page.getByRole("combobox", { name: "Active pose" }).locator("option")).toHaveCount(7);
});

test("exposes optional guides, viewport presets, fallback, and reduced-motion state without overflow", async ({ page }) => {
  const consoleProblems: string[] = [];
  page.on("console", (message) => {
    const ignoredDriverNoise = message.text().includes("GL Driver Message") || message.text().includes("WebGL warning:");
    if (!ignoredDriverNoise && (message.type() === "error" || message.type() === "warning")) {
      consoleProblems.push(message.text());
    }
  });
  page.on("pageerror", (error) => consoleProblems.push(error.message));

  await page.goto("/lab/machine/director");
  await waitForDirector(page);
  const viewportSelect = page.getByRole("combobox", { name: "Viewport preset" });

  for (const preset of viewportPresets) {
    await viewportSelect.selectOption({ label: preset });
    await expect(page.locator("[data-arrival-director]")).toHaveAttribute(
      "data-director-viewport",
      preset.replace(" × ", "x"),
    );
    await expectNoHorizontalOverflow(page);
  }

  await page.getByRole("checkbox", { name: "Viewport center" }).check();
  await page.getByRole("checkbox", { name: "Thirds grid" }).check();
  await page.getByRole("checkbox", { name: "Projected screen bounds" }).check();
  await page.getByRole("checkbox", { name: "Screen center" }).check();
  await page.getByRole("checkbox", { name: "Camera target" }).check();
  await page.getByRole("checkbox", { name: "Safe text region" }).check();
  await expect(page.locator('[data-director-guide="viewport-center"]')).toBeAttached();
  await expect(page.locator('[data-director-guide="thirds-grid"]')).toBeAttached();
  await expect(page.locator('[data-director-guide="screen-center"]')).toBeAttached();
  await expect(page.locator('[data-director-guide="safe-text-region"]')).toBeAttached();
  await expect(page.locator('[data-director-screen-guide="true"]')).toBeAttached();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await waitForDirector(page);
  await expect(page.locator("[data-arrival-director]")).toHaveAttribute("data-director-reduced", "true");
  await expect(page.getByRole("heading", { level: 2, name: "Jonathan Jansson" })).toBeAttached();

  await page.goto("/lab/machine/director?webgl=off");
  await expect(page.locator("[data-machine-fallback]")).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Active pose" }).locator("option")).toHaveCount(6);
  await expectNoHorizontalOverflow(page);
  expect(consoleProblems).toEqual([]);
});
