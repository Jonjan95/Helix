import { expect, test } from "@playwright/test";

test("loads the portfolio foundation", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveTitle(/Helix/);
  await expect(page.getByRole("heading", { level: 1, name: "Helix" })).toBeVisible();

  for (const section of ["About", "Experience", "Skills", "Projects", "Contact"]) {
    await expect(
      page.getByRole("heading", { level: 2, name: section, exact: true }),
    ).toBeAttached();
  }
});
