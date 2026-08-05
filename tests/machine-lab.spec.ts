import { expect, test, type Page } from "@playwright/test";
import { auditCameraContinuity, getCameraPose } from "@/lib/machine-lab/camera-motion";
import { machineSequences, stageProgress } from "@/lib/machine-lab/sequence";

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

test("keeps the Machine Lab route isolated while production reuses its renderer", async ({
  context,
  page,
  request,
}) => {
  const labPage = await context.newPage();
  const rendererChunks = new Set<string>();
  const rendererChecks: Promise<void>[] = [];
  labPage.on("response", (response) => {
    const url = response.url();
    if (!url.includes("/_next/static/") || !url.endsWith(".js")) return;
    rendererChecks.push(
      response
        .text()
        .then((body) => {
          if (body.includes("WebGLRenderer")) rendererChunks.add(url);
        })
        .catch(() => undefined),
    );
  });
  await labPage.goto("/lab/machine", { waitUntil: "networkidle" });
  await waitForModel(labPage);
  await Promise.all(rendererChecks);
  expect(rendererChunks.size).toBeGreaterThan(0);
  await labPage.close();

  const productionRequests: string[] = [];
  page.on("request", (resource) => productionRequests.push(resource.url()));

  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.locator("[data-machine-lab]")).toHaveCount(0);
  await expect(page.locator("[data-production-machine] canvas")).toHaveCount(1, {
    timeout: 15_000,
  });
  expect(
    productionRequests.some((url) => url.includes("helix-machine.glb")),
  ).toBe(true);
  expect(productionRequests.some((url) => rendererChunks.has(url))).toBe(true);

  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).not.toContain("/lab/machine");

  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toMatch(/Disallow: \/(?:lab\/)?/);
});

test("exposes a semantic, reversible staged arrival sequence", async ({
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
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await waitForModel(page);

  await expect(page.locator("[data-machine-lab]")).toHaveAttribute(
    "data-machine-sequence-candidate",
    "cinematic",
  );
  const identity = page.locator("[data-machine-identity]");
  await expect(
    page.getByRole("heading", { level: 2, name: "Jonathan Jansson" }),
  ).toBeAttached();
  expect(await identity.evaluate((element) => element.closest("canvas"))).toBeNull();
  expect(
    await identity.evaluate((element) =>
      Boolean(element.closest("[data-machine-html-layer]")),
    ),
  ).toBe(true);

  for (const state of ["0.00", "0.28", "0.6", "0.76", "0.9"]) {
    await setProgress(page, Number(state));
    await expect(page.locator("[data-machine-lab]")).toHaveAttribute(
      "data-machine-progress",
      Number(state).toFixed(3),
    );
  }
  await expect(identity).toHaveAttribute("data-identity-visible", "true");

  await setProgress(page, 0.9);
  await expect(page.getByText("Camera reframe", { exact: true })).toBeVisible();
  await setProgress(page, 0.98);
  await expect(page.getByText("Camera dolly", { exact: true })).toBeVisible();
  await setProgress(page, 1);
  await expect(identity).toHaveAttribute("data-identity-visible", "false");

  const reverseStages = [
    [0.95, "Identity departure"],
    [0.9, "Camera reframe"],
    [0.84, "Identity hold"],
    [0.76, "Identity reveal"],
    [0.69, "Screen settled"],
    [0.6, "Screen activation"],
    [0.5, "Lid settled"],
    [0.32, "Lid opening"],
    [0.16, "Machine settled"],
    [0.05, "Machine reveal"],
  ] as const;

  for (const [progress, expectedStage] of reverseStages) {
    await setProgress(page, progress);
    await expect(page.locator("[data-machine-lab]")).toHaveAttribute(
      "data-machine-stage-state",
      expectedStage,
    );
  }
  await expect(identity).toHaveAttribute("data-identity-visible", "false");
  await setProgress(page, 0);
  await expect(page.locator("[data-machine-lab]")).toHaveAttribute(
    "data-machine-progress",
    "0.000",
  );
  expect(consoleProblems).toEqual([]);
});

test("uses the physical camera path and keeps its debug view internal", async ({
  page,
}) => {
  await page.goto("/");
  const productionCamera = page.locator(
    "[data-production-machine] [data-machine-html-layer]",
  );
  await expect(productionCamera).toHaveAttribute(
    "data-camera-language",
    "physical",
    { timeout: 15_000 },
  );
  await expect(productionCamera).toHaveAttribute("data-camera-debug", "false");
  await expect(
    page.locator("[data-motion-root='helix-experience']"),
  ).toHaveAttribute("data-arrival-progress-source", "scrubbed-timeline");

  await page.goto("/lab/machine");
  await waitForModel(page);
  await expect(page.locator("[data-machine-html-layer]")).toHaveAttribute(
    "data-camera-debug",
    "false",
  );

  await page.goto("/lab/machine?cameraDebug=on");
  await waitForModel(page);
  await expect(page.locator("[data-machine-html-layer]")).toHaveAttribute(
    "data-camera-debug",
    "true",
  );
  await setProgress(page, 0.9);
  await expect(page.locator("[data-machine-html-layer]")).toHaveAttribute(
    "data-camera-owner",
    "reframe",
  );
  await setProgress(page, 0.94);
  await expect(page.locator("[data-machine-html-layer]")).toHaveAttribute(
    "data-camera-owner",
    "shared",
  );
  await setProgress(page, 0.98);
  await expect(page.locator("[data-machine-html-layer]")).toHaveAttribute(
    "data-camera-owner",
    "dolly",
  );
});

test("keeps camera position and view direction continuous at every sample", () => {
  const sequence = machineSequences.cinematic;
  const audit = auditCameraContinuity(sequence, 4000);

  expect(audit.maxPositionDelta).toBeLessThan(0.04);
  expect(audit.maxTargetDelta).toBeLessThan(0.012);
  expect(audit.maxViewAngle).toBeLessThan(0.008);

  for (const boundary of [
    sequence.cameraReframe.start,
    sequence.cameraReframe.end,
    sequence.cameraDolly.start,
    sequence.cameraDolly.end,
  ]) {
    const before = getCameraPose(boundary - 0.000001, sequence);
    const after = getCameraPose(boundary + 0.000001, sequence);
    const beforeDirection = before.target.clone().sub(before.position).normalize();
    const afterDirection = after.target.clone().sub(after.position).normalize();

    expect(before.position.distanceTo(after.position)).toBeLessThan(0.0001);
    expect(before.target.distanceTo(after.target)).toBeLessThan(0.0001);
    expect(beforeDirection.angleTo(afterDirection)).toBeLessThan(0.0001);
  }

  for (const range of Object.values(sequence)) {
    for (const boundary of [range.start, range.end]) {
      const before = stageProgress(boundary - 0.000001, range);
      const after = stageProgress(boundary + 0.000001, range);
      expect(Math.abs(after - before)).toBeLessThan(0.0001);
    }
  }
});

test("compares two deterministic timing candidates with the same stage order", async ({
  page,
}) => {
  await page.goto("/lab/machine");
  await waitForModel(page);

  const root = page.locator("[data-machine-lab]");
  const identity = page.locator("[data-machine-identity]");
  const cinematic = page.getByRole("radio", { name: /Candidate A/i });
  const editorial = page.getByRole("radio", { name: /Candidate B/i });

  await expect(cinematic).toBeChecked();
  await cinematic.focus();
  await page.keyboard.press("ArrowRight");
  await expect(editorial).toBeChecked();
  await cinematic.check();
  await setProgress(page, 0.6);
  await expect(root).toHaveAttribute("data-machine-stage-state", "Screen activation");
  await expect(identity).toHaveAttribute("data-screen-active", "true");
  await expect(identity).toHaveAttribute("data-identity-visible", "false");
  await setProgress(page, 0.75);
  await expect(root).toHaveAttribute("data-machine-stage-state", "Identity reveal");
  await expect(identity).toHaveAttribute("data-screen-settled", "true");
  await expect(identity).toHaveAttribute("data-identity-visible", "true");
  await setProgress(page, 0.84);
  await expect(root).toHaveAttribute("data-machine-stage-state", "Identity hold");
  await setProgress(page, 0.9);
  await expect(root).toHaveAttribute("data-machine-stage-state", "Camera reframe");

  await editorial.check();
  await expect(root).toHaveAttribute(
    "data-machine-sequence-candidate",
    "editorial",
  );
  const editorialStages = [
    [0.05, "Machine reveal"],
    [0.11, "Machine settled"],
    [0.25, "Lid opening"],
    [0.42, "Lid settled"],
    [0.5, "Screen activation"],
    [0.59, "Screen settled"],
    [0.65, "Identity reveal"],
    [0.72, "Identity hold"],
    [0.8, "Camera reframe"],
    [0.875, "Identity departure"],
    [0.94, "Camera dolly"],
  ] as const;

  for (const [progress, expectedStage] of editorialStages) {
    await setProgress(page, progress);
    await expect(root).toHaveAttribute("data-machine-stage-state", expectedStage);
  }

  await page.goto("/lab/machine?sequence=editorial");
  await waitForModel(page);
  await expect(page.locator("[data-machine-lab]")).toHaveAttribute(
    "data-machine-sequence-candidate",
    "editorial",
  );
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
  await expect(root).toHaveAttribute("data-machine-progress", "0.840");
  await expect(page.locator("[data-machine-identity]")).toHaveAttribute(
    "data-identity-visible",
    "true",
  );
  await expect(page.getByRole("button", { name: "Play forward" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Play reverse" })).toBeDisabled();

  await page.getByRole("radio", { name: /Candidate B/i }).check();
  await expect(root).toHaveAttribute("data-machine-progress", "0.730");
  await expect(page.locator("[data-machine-identity]")).toHaveAttribute(
    "data-identity-visible",
    "true",
  );
});

test("preserves responsive flow and avoids horizontal overflow", async ({ page }) => {
  await page.goto("/lab/machine");
  await waitForModel(page);

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await expectNoHorizontalOverflow(page);
  }
});
