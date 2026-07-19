import { expect, test } from "@playwright/test";

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

  for (const section of ["About", "Experience", "Skills", "Projects", "Contact"]) {
    await expect(
      page.getByRole("heading", { level: 2, name: section, exact: true }),
    ).toBeAttached();
  }
});

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`has no horizontal overflow at ${viewport.name} width`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);

    const laptopBounds = await page.getByTestId("laptop-hero").boundingBox();
    expect(laptopBounds).not.toBeNull();
    expect(laptopBounds?.x).toBeGreaterThanOrEqual(0);
    expect((laptopBounds?.x ?? 0) + (laptopBounds?.width ?? 0)).toBeLessThanOrEqual(
      dimensions.clientWidth,
    );
  });
}
