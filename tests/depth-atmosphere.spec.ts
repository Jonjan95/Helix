import { expect, test } from "@playwright/test";

test("uses one static decorative atmosphere without changing the journey model", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const journey = page.getByTestId("helix-journey");
  await expect(journey).toHaveAttribute("data-atmosphere-model", "static-depth");
  await expect(page.locator("[data-motion-root='helix-experience']")).toHaveCount(
    1,
  );
  await expect(page.locator("[data-atmosphere-layer]")).toHaveCount(0);

  const atmosphere = await journey.evaluate((element) => {
    const globalWash = getComputedStyle(element, "::after");
    const thresholdSurface = getComputedStyle(element, "::before");
    const chapters = [...element.querySelectorAll("[data-journey-chapter]")];

    return {
      chapterSurfaces: chapters.map(
        (chapter) => getComputedStyle(chapter, "::before").content,
      ),
      globalAnimation: globalWash.animationName,
      globalContent: globalWash.content,
      globalPointerEvents: globalWash.pointerEvents,
      globalTransition: globalWash.transitionDuration,
      thresholdContent: thresholdSurface.content,
      thresholdPointerEvents: thresholdSurface.pointerEvents,
    };
  });

  expect(atmosphere.globalContent).not.toBe("none");
  expect(atmosphere.thresholdContent).not.toBe("none");
  expect(atmosphere.globalPointerEvents).toBe("none");
  expect(atmosphere.thresholdPointerEvents).toBe("none");
  expect(atmosphere.globalAnimation).toBe("none");
  expect(atmosphere.globalTransition).toBe("0s");
  expect(atmosphere.chapterSurfaces.every((content) => content === "none")).toBe(
    true,
  );
});

test("keeps the atmosphere static for reduced motion and simple on mobile", async ({
  browser,
}) => {
  const reducedContext = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { height: 1000, width: 1440 },
  });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto("/", { waitUntil: "domcontentloaded" });

  const reducedAtmosphere = await reducedPage
    .getByTestId("helix-journey")
    .evaluate((element) => {
      const style = getComputedStyle(element, "::after");
      return {
        animation: style.animationName,
        background: style.backgroundImage,
        transition: style.transitionDuration,
      };
    });
  expect(reducedAtmosphere.background).not.toBe("none");
  expect(reducedAtmosphere.animation).toBe("none");
  expect(Number.parseFloat(reducedAtmosphere.transition)).toBeLessThanOrEqual(
    0.00002,
  );
  await reducedContext.close();

  const mobileContext = await browser.newContext({
    viewport: { height: 844, width: 390 },
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("/", { waitUntil: "domcontentloaded" });
  const mobileBackground = await mobilePage
    .getByTestId("helix-journey")
    .evaluate((element) => getComputedStyle(element, "::after").backgroundImage);
  expect(mobileBackground).toContain("linear-gradient");
  expect(mobileBackground).not.toContain("radial-gradient");
  await mobileContext.close();
});

test("removes decorative atmosphere in forced colors", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const styles = await page.getByTestId("helix-journey").evaluate((element) => ({
    global: getComputedStyle(element, "::after").display,
    threshold: getComputedStyle(element, "::before").display,
  }));

  expect(styles).toEqual({ global: "none", threshold: "none" });
});
