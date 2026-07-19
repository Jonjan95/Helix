import { expect, test, type Page } from "@playwright/test";

const expectedChapters = [
  "arrival",
  "orientation",
  "engineering",
  "selected-work",
  "proof",
  "future",
];

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
}

test("loads the portfolio foundation", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveTitle(/Helix/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Jonathan" }),
  ).toBeVisible();
  await expect(page.getByTestId("laptop-hero")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "I build thoughtful software experiences with a focus on quality, usability, and reliable implementation.",
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { level: 2, name: "Inside the system" }),
  ).toBeAttached();
  await expect(page.getByTestId("digital-workspace")).toBeAttached();
  await expect(page.getByTestId("helix-journey")).toBeAttached();
  await expect(page.getByTestId("engineering-helix-chapter")).toBeAttached();
  await expect(page.getByTestId("helix-scene")).toBeAttached();
  await expect(page.getByTestId("helix-structure")).toBeAttached();
  await expect(page.getByTestId("engineering-node")).toHaveAttribute(
    "data-node-state",
    "active",
  );
  await expect(page.locator("[data-helix-rung]")).toHaveCount(12);
  await expect(page.locator("[data-helix-node]")).toHaveCount(6);

  const engineering = page.locator('[data-chapter="engineering"]');
  await expect(
    engineering.getByRole("heading", {
      level: 2,
      name: "Quality is part of the build, not a final check.",
    }),
  ).toBeAttached();
  await expect(
    engineering.getByText(
      "I approach software through clear requirements, testable behaviour, reliable implementation, and continuous learning.",
    ),
  ).toBeAttached();
  await expect(engineering.getByRole("listitem")).toHaveCount(4);

  for (const section of ["Experience", "Projects", "Contact"]) {
    await expect(
      page.getByRole("heading", { level: 2, name: section, exact: true }),
    ).toBeAttached();
  }

  await expect(
    page.getByRole("link", { name: "Skip to portfolio content" }),
  ).toHaveAttribute("href", "#main-content");

  const chapters = page.locator("[data-chapter]");
  await expect(chapters).toHaveCount(expectedChapters.length);

  const chapterOrder = await chapters.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("data-chapter")),
  );

  expect(chapterOrder).toEqual(expectedChapters);
});

test("moves from Arrival to the active Engineering node and reverses without browser errors", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      browserErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const motionRoot = page.locator(
    '[data-motion-root="arrival-orientation"]',
  );
  const arrival = page.locator('[data-chapter="arrival"]');
  const orientation = page.locator('[data-chapter="orientation"]');
  const engineering = page.locator('[data-chapter="engineering"]');
  const engineeringContent = page.getByTestId("engineering-content");
  const helix = page.getByTestId("helix-scene");

  await expect(motionRoot).toHaveAttribute("data-motion-state", "ready");
  await expect(arrival).toBeVisible();
  await expect(page.getByTestId("laptop-hero")).toBeVisible();

  await orientation.scrollIntoViewIfNeeded();
  await expect(
    orientation.getByRole("heading", {
      level: 2,
      name: "Inside the system",
    }),
  ).toBeVisible();
  await expect(page.getByTestId("digital-workspace")).toBeVisible();

  await helix.scrollIntoViewIfNeeded();
  await expect(helix).toBeVisible();
  await engineeringContent.scrollIntoViewIfNeeded();
  await expect(
    engineering.getByRole("heading", {
      level: 2,
      name: "Quality is part of the build, not a final check.",
    }),
  ).toBeVisible();
  await expect(page.getByTestId("engineering-node")).toHaveAttribute(
    "data-node-state",
    "active",
  );
  await expect
    .poll(() =>
      engineeringContent.evaluate((element) =>
        Number(getComputedStyle(element).opacity),
      ),
    )
    .toBeGreaterThan(0.85);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(0);
  await expectNoHorizontalOverflow(page);

  await page.mouse.wheel(0, -10000);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(2);
  await expect(arrival).toBeVisible();
  await expect(page.getByTestId("laptop-hero")).toBeVisible();
  await expect
    .poll(() =>
      engineeringContent.evaluate((element) =>
        Number(getComputedStyle(element).opacity),
      ),
    )
    .toBeLessThan(0.2);
  expect(browserErrors).toEqual([]);
});

test("reduced motion keeps the workspace, helix, and Engineering in static flow", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(
    page.locator('[data-motion-root="arrival-orientation"]'),
  ).toHaveAttribute("data-motion-state", "reduced");
  await expect(page.locator('[data-chapter="arrival"]')).toBeAttached();

  const orientation = page.locator('[data-chapter="orientation"]');
  const engineering = page.locator('[data-chapter="engineering"]');
  const engineeringContent = page.getByTestId("engineering-content");
  const engineeringNode = page.getByTestId("engineering-node");
  const helix = page.getByTestId("helix-scene");
  await expect(orientation).toBeAttached();
  await expect(engineering).toBeAttached();
  await expect(helix).toBeAttached();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);

  await orientation.scrollIntoViewIfNeeded();
  await expect(
    orientation.getByRole("heading", {
      level: 2,
      name: "Inside the system",
    }),
  ).toBeVisible();
  await expect(
    orientation.getByText(
      "A guided look at how I approach software, quality, and thoughtful implementation.",
    ),
  ).toBeVisible();

  await helix.scrollIntoViewIfNeeded();
  await expect(helix).toBeVisible();
  await expect(helix).toHaveCSS("opacity", "1");
  await expect(helix).toHaveCSS("transform", "none");

  await engineeringContent.scrollIntoViewIfNeeded();
  await expect(
    engineering.getByRole("heading", {
      level: 2,
      name: "Quality is part of the build, not a final check.",
    }),
  ).toBeVisible();
  await expect(engineering.getByRole("listitem")).toHaveCount(4);
  await expect(engineeringContent).toHaveCSS("opacity", "1");
  await expect(engineeringContent).toHaveCSS("transform", "none");
  await expect(engineeringNode).toHaveAttribute("data-node-state", "active");
  await expect(engineeringNode).toHaveCSS("opacity", "1");
  await expect(engineeringNode).toHaveCSS("transform", "none");
  await expectNoHorizontalOverflow(page);
});

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "laptop", width: 1024, height: 768 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`has no horizontal overflow at ${viewport.name} width`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expectNoHorizontalOverflow(page);

    const laptopBounds = await page.getByTestId("laptop-hero").boundingBox();
    expect(laptopBounds).not.toBeNull();
    expect(laptopBounds?.x).toBeGreaterThanOrEqual(0);
    expect((laptopBounds?.x ?? 0) + (laptopBounds?.width ?? 0)).toBeLessThanOrEqual(
      viewport.width,
    );

    const workspace = page.getByTestId("digital-workspace");
    await workspace.scrollIntoViewIfNeeded();
    await expect(workspace).toBeVisible();
    await expectNoHorizontalOverflow(page);

    const helix = page.getByTestId("helix-scene");
    await helix.scrollIntoViewIfNeeded();
    await expect(helix).toBeVisible();
    await expectNoHorizontalOverflow(page);

    const engineeringContent = page.getByTestId("engineering-content");
    await engineeringContent.scrollIntoViewIfNeeded();
    await expect(engineeringContent).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
}
