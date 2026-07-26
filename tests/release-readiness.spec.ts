import { expect, test } from "@playwright/test";

const chapters = [
  "environment",
  "engineering",
  "projects",
  "experience",
  "contact",
] as const;

test("publishes complete metadata and release assets", async ({
  page,
  request,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page).toHaveTitle(
    "Jonathan Jansson | Software Development & Testing",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /testing and quality/,
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Jonathan Jansson | Software Development & Testing",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator('link[rel="icon"]')).toHaveCount(1);
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);

  const socialImageUrl = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(socialImageUrl).not.toBeNull();
  const socialImageLocation = new URL(socialImageUrl!);
  const socialImage = await request.get(
    `${socialImageLocation.pathname}${socialImageLocation.search}`,
  );
  expect(socialImage.ok()).toBe(true);
  expect(socialImage.headers()["content-type"]).toContain("image/png");

  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const canonical = page.locator('link[rel="canonical"]');
  const robots = await request.get("/robots.txt");
  const sitemap = await request.get("/sitemap.xml");

  expect(robots.ok()).toBe(true);
  expect(sitemap.ok()).toBe(true);

  if (configuredSiteUrl) {
    const normalizedSiteUrl = new URL(configuredSiteUrl).toString();
    const canonicalUrl = new URL((await canonical.getAttribute("href"))!);
    expect(canonicalUrl.origin).toBe(new URL(normalizedSiteUrl).origin);
    expect(canonicalUrl.pathname).toBe("/");
    expect(await robots.text()).toContain("Allow: /");
    expect(await robots.text()).toContain(
      new URL("/sitemap.xml", configuredSiteUrl).toString(),
    );
    expect(await sitemap.text()).toContain(configuredSiteUrl);
  } else {
    await expect(canonical).toHaveCount(0);
    expect(await robots.text()).toContain("Disallow: /");
    expect(await sitemap.text()).not.toContain("<url>");
  }
});

test("returns safe response headers and a real not-found response", async ({
  request,
}) => {
  const response = await request.get("/");

  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["x-frame-options"]).toBe("DENY");
  expect(response.headers()["referrer-policy"]).toBe(
    "strict-origin-when-cross-origin",
  );
  expect(response.headers()["permissions-policy"]).toContain("camera=()");

  const missing = await request.get("/this-route-does-not-exist");
  expect(missing.status()).toBe(404);
});

test("supports keyboard use, forced colors, and high zoom reflow equivalents", async ({
  browserName,
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.setViewportSize({ height: 500, width: 720 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const skipLink = page.getByRole("link", {
    name: "Skip to portfolio journey",
  });
  if (browserName === "webkit") {
    // Playwright WebKit follows Safari's default setting, which does not
    // include links in sequential tab focus unless the user enables it.
    await skipLink.focus();
  } else {
    await page.keyboard.press("Tab");
  }
  await expect(skipLink).toBeFocused();

  for (const chapter of chapters) {
    await expect(page.getByTestId(`journey-chapter-${chapter}`)).toBeAttached();
  }

  const focusedOutline = await page
    .getByRole("link", { name: "Skip to portfolio journey" })
    .evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        style: style.outlineStyle,
        width: Number.parseFloat(style.outlineWidth),
      };
    });
  expect(focusedOutline.style).not.toBe("none");
  expect(focusedOutline.width).toBeGreaterThanOrEqual(1);

  for (const viewport of [
    { height: 500, width: 720 },
    { height: 250, width: 360 },
  ]) {
    await page.setViewportSize(viewport);
    const overflow = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
  }
});

test("loads and traverses the journey without browser console failures", async ({
  page,
}) => {
  const failures: string[] = [];

  page.on("console", (message) => {
    if (
      message.type() === "warning" &&
      message.text().includes("scroll-linked positioning effect")
    ) {
      return;
    }
    if (message.type() === "error" || message.type() === "warning") {
      failures.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => failures.push(`pageerror: ${error.message}`));

  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByTestId("journey-chapter-contact").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("link", { name: /Explore GitHub/ }),
  ).toBeVisible();
  await page.getByTestId("journey-chapter-environment").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  expect(failures).toEqual([]);
});

test("keeps the production journey usable across desktop and mobile layouts", async ({
  page,
}) => {
  for (const viewport of [
    { height: 1000, width: 1440 },
    { height: 844, width: 390 },
    { height: 390, width: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByTestId("laptop-hero")).toBeVisible();
    await expect(page.getByTestId("helix-path")).toBeAttached();

    for (const chapter of chapters) {
      const section = page.getByTestId(`journey-chapter-${chapter}`);
      await section.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
    }

    await expect(
      page.getByRole("link", { name: /Explore GitHub/ }),
    ).toBeVisible();

    const overflow = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
  }
});

test("exposes the complete static journey with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  for (const chapter of chapters) {
    const section = page.getByTestId(`journey-chapter-${chapter}`);
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
    await expect(section).toHaveAttribute("data-journey-state", "static");
  }

  await expect(page.locator("[data-contact-route]")).toHaveCount(3);
});
