import { expect, test } from "@playwright/test";

test("gives Environment and Engineering distinct static reading roles", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#about", { waitUntil: "domcontentloaded" });

  const environment = page.getByTestId("digital-workspace");
  const engineering = page.getByTestId("engineering-content");
  const environmentPrinciples = environment.getByRole("list");
  const engineeringSteps = engineering.getByRole("list");

  const layout = await page.evaluate(() => {
    const environmentContent = document.querySelector(
      '[data-testid="digital-workspace"]',
    );
    const engineeringContent = document.querySelector(
      '[data-testid="engineering-content"]',
    );
    const environmentList = environmentContent?.querySelector("ol");
    const engineeringList = engineeringContent?.querySelector("ol");
    const environmentHeading = environmentContent?.querySelector("h2");
    const engineeringHeading = engineeringContent?.querySelector("h2");

    if (
      !(environmentContent instanceof HTMLElement) ||
      !(engineeringContent instanceof HTMLElement) ||
      !(environmentList instanceof HTMLElement) ||
      !(engineeringList instanceof HTMLElement) ||
      !(environmentHeading instanceof HTMLElement) ||
      !(engineeringHeading instanceof HTMLElement)
    ) {
      throw new Error("Early journey structure is incomplete.");
    }

    return {
      engineeringHeadingSize: Number.parseFloat(
        getComputedStyle(engineeringHeading).fontSize,
      ),
      engineeringInset:
        engineeringList.getBoundingClientRect().left -
        engineeringContent.getBoundingClientRect().left,
      environmentHeadingSize: Number.parseFloat(
        getComputedStyle(environmentHeading).fontSize,
      ),
      environmentInset:
        environmentList.getBoundingClientRect().left -
        environmentContent.getBoundingClientRect().left,
    };
  });

  expect(layout.environmentHeadingSize).toBeLessThan(
    layout.engineeringHeadingSize,
  );
  expect(layout.environmentInset).toBeGreaterThanOrEqual(16);
  expect(Math.abs(layout.engineeringInset)).toBeLessThan(2);
  await expect(environmentPrinciples).toHaveAttribute(
    "aria-label",
    "Working environment principles",
  );
  await expect(engineeringSteps).toHaveAttribute(
    "aria-label",
    "Engineering reasoning sequence",
  );
});

test("preserves the narrative handoff and chapter ownership", async ({
  page,
}) => {
  await page.goto("/#skills", { waitUntil: "domcontentloaded" });

  const earlyChapters = await page
    .locator(
      '[data-journey-chapter="environment"], [data-journey-chapter="engineering"], [data-journey-chapter="projects"]',
    )
    .evaluateAll((elements) =>
      elements.map((element) =>
        element.getAttribute("data-journey-chapter"),
      ),
    );

  expect(earlyChapters).toEqual(["environment", "engineering", "projects"]);
  await expect(page.locator("[data-engineering-handoff]")).toHaveText(
    "The projects below show those steps at work.",
  );
  await expect(page.locator('[data-motion-root="helix-experience"]')).toHaveCount(
    1,
  );
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    ),
  ).toBe(0);
});

test("returns the early journey to normal document alignment on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#about", { waitUntil: "domcontentloaded" });

  const mobileLayout = await page
    .getByTestId("digital-workspace")
    .evaluate((environmentContent) => {
      const list = environmentContent.querySelector("ol");
      if (!(list instanceof HTMLElement)) {
        throw new Error("Environment principles are missing.");
      }

      return {
        contentLeft: environmentContent.getBoundingClientRect().left,
        listLeft: list.getBoundingClientRect().left,
        overflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      };
    });

  expect(Math.abs(mobileLayout.listLeft - mobileLayout.contentLeft)).toBeLessThan(
    2,
  );
  expect(mobileLayout.overflow).toBe(0);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});
