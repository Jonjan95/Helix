import { expect, test, type Page } from "@playwright/test";

const narrativeChapters = [
  "arrival",
  "orientation",
  "engineering",
  "selected-work",
  "proof",
  "future",
];

const journeyChapters = [
  "environment",
  "engineering",
  "projects",
  "experience",
  "contact",
] as const;

const chapterHeadings = {
  contact: "Let’s build something reliable.",
  engineering: "Quality is part of the build, not a final check.",
  environment: "Inside the system",
  experience: "Technical work across software, systems, and service.",
  projects: "Building systems by solving real problems.",
} as const;

const chapterAnchors = {
  contact: "contact",
  engineering: "skills",
  environment: "about",
  experience: "experience",
  projects: "projects",
} as const;

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
}

async function centerChapter(page: Page, chapter: (typeof journeyChapters)[number]) {
  await page.getByTestId(`journey-chapter-${chapter}`).evaluate((element) => {
    element.scrollIntoView({ block: "center", behavior: "auto" });
  });
}

async function positionChapterAtViewportRatio(
  page: Page,
  chapter: (typeof journeyChapters)[number],
  viewportRatio: number,
) {
  await page
    .getByTestId(`journey-chapter-${chapter}`)
    .evaluate((element, ratio) => {
      const documentRoot = document.documentElement;
      const previousScrollBehavior = documentRoot.style.scrollBehavior;
      const targetTop =
        element.getBoundingClientRect().top +
        window.scrollY -
        window.innerHeight * ratio;

      documentRoot.style.scrollBehavior = "auto";
      window.scrollTo({ top: Math.max(0, targetTop), behavior: "auto" });
      documentRoot.style.scrollBehavior = previousScrollBehavior;
    }, viewportRatio);
}

test("renders the complete semantic Helix journey", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveTitle(/Helix/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Jonathan" }),
  ).toBeVisible();
  await expect(page.getByTestId("laptop-hero")).toBeVisible();

  const journey = page.getByTestId("helix-journey");
  await expect(journey).toBeAttached();
  await expect(page.getByTestId("helix-path")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await expect(page.locator("[data-testid='helix-path'] svg text")).toHaveCount(0);
  await expect(page.locator("[data-journey-chapter]")).toHaveCount(5);
  await expect(page.locator("[data-journey-node]")).toHaveCount(5);

  const journeyOrder = await page
    .locator("[data-journey-chapter]")
    .evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-journey-chapter")),
    );
  expect(journeyOrder).toEqual(journeyChapters);

  const narrativeOrder = await page.locator("[data-chapter]").evaluateAll(
    (elements) =>
      elements.map((element) => element.getAttribute("data-chapter")),
  );
  expect(narrativeOrder).toEqual(narrativeChapters);

  for (const chapter of journeyChapters) {
    const chapterElement = page.getByTestId(`journey-chapter-${chapter}`);
    await expect(chapterElement).toBeAttached();
    await expect(page.getByTestId(`journey-node-${chapter}`)).toBeAttached();
    await expect(
      chapterElement.getByRole("heading", {
        level: 2,
        name: chapterHeadings[chapter],
      }),
    ).toBeAttached();
  }

  const projects = page.getByTestId("journey-chapter-projects");
  for (const project of ["AI-Powered Test Engineer", "CortexGrid", "Helix"]) {
    await expect(
      projects.getByRole("heading", { level: 3, name: project }),
    ).toBeAttached();
  }
  await expect(projects.getByRole("link")).toHaveCount(0);
  await expect(projects.getByRole("button")).toHaveCount(0);

  const experience = page.getByTestId("journey-chapter-experience");
  for (const area of [
    "Software development and testing studies",
    "Embedded systems and networking",
    "Technical service and field troubleshooting",
  ]) {
    await expect(
      experience.locator("li").filter({ hasText: area }),
    ).toBeAttached();
  }

  const contact = page.getByTestId("journey-chapter-contact");
  await expect(
    contact.getByRole("link", { name: "View Jonjan95’s public GitHub profile" }),
  ).toHaveAttribute("href", "https://github.com/Jonjan95");
  await expect(contact.getByText("Profile link pending final content")).toBeAttached();
  await expect(contact.getByText("Contact route pending final content")).toBeAttached();

  for (const id of ["projects", "experience"]) {
    const section = page.locator(`#${id}`);
    await expect(section).toHaveCount(1);
    expect(
      await section.evaluate((element) =>
        Boolean(element.closest("[data-helix-journey]")),
      ),
    ).toBe(true);
  }

  await expect(page.getByTestId("journey-continuation")).toHaveAttribute(
    "data-path-continuation",
    "",
  );

  const skipLink = page.getByRole("link", { name: "Skip to portfolio content" });
  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
});

test("progresses through every active node and reverses to the workspace", async ({
  page,
}) => {
  const browserMessages: string[] = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      browserMessages.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => browserMessages.push(`pageerror: ${error.message}`));

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const motionRoot = page.locator('[data-motion-root="helix-experience"]');
  const journey = page.getByTestId("helix-journey");
  await expect(motionRoot).toHaveAttribute("data-motion-state", "ready");
  await expect(journey).toHaveAttribute("data-active-chapter", "none");
  await expect(journey).toHaveAttribute(
    "data-journey-phase",
    "before-journey",
  );
  for (const chapter of journeyChapters) {
    await expect(page.getByTestId(`journey-chapter-${chapter}`)).toHaveAttribute(
      "data-journey-state",
      "upcoming",
    );
  }

  for (const [index, chapter] of journeyChapters.entries()) {
    await positionChapterAtViewportRatio(page, chapter, 0.8);
    await expect(page.getByTestId(`journey-chapter-${chapter}`)).toHaveAttribute(
      "data-journey-state",
      "approaching",
    );
    await expect(page.getByTestId(`journey-node-${chapter}`)).toHaveAttribute(
      "data-node-state",
      "approaching",
    );

    if (index > 0) {
      const previousChapter = journeyChapters[index - 1];
      await expect(journey).toHaveAttribute(
        "data-active-chapter",
        previousChapter,
      );
      await expect(
        page.getByTestId(`journey-chapter-${previousChapter}`),
      ).toHaveAttribute("data-journey-state", "departing");
    }

    await centerChapter(page, chapter);
    await expect(journey).toHaveAttribute("data-active-chapter", chapter);
    await expect(page.getByTestId(`journey-node-${chapter}`)).toHaveAttribute(
      "data-node-state",
      "active",
    );
    await expect(
      page
        .getByTestId(`journey-chapter-${chapter}`)
        .getByRole("heading", { level: 2, name: chapterHeadings[chapter] }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
  }

  await expect(page.getByTestId("journey-continuation")).toBeVisible();

  for (const chapter of [...journeyChapters].reverse()) {
    await centerChapter(page, chapter);
    await expect(journey).toHaveAttribute("data-active-chapter", chapter);
    await expect(page.getByTestId(`journey-node-${chapter}`)).toHaveAttribute(
      "data-node-state",
      "active",
    );
  }

  await expect(page.getByTestId("digital-workspace")).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(2);
  await expect(page.getByTestId("laptop-hero")).toBeVisible();
  await expect(journey).toHaveAttribute("data-active-chapter", "none");
  await expect(page.getByTestId("journey-node-environment")).toHaveAttribute(
    "data-node-state",
    "upcoming",
  );
  expect(browserMessages).toEqual([]);
});

test("restores calibrated chapter focus for direct links", async ({ page }) => {
  for (const viewport of [
    { height: 1000, width: 1440 },
    { height: 844, width: 390 },
  ]) {
    await page.setViewportSize(viewport);

    for (const chapter of journeyChapters) {
      await page.goto(`/#${chapterAnchors[chapter]}`, {
        waitUntil: "domcontentloaded",
      });
      await expect(page.getByTestId("helix-journey")).toHaveAttribute(
        "data-active-chapter",
        chapter,
      );
      await expect(page.getByTestId(`journey-node-${chapter}`)).toHaveAttribute(
        "data-node-state",
        "active",
      );
      await expect(
        page
          .getByTestId(`journey-chapter-${chapter}`)
          .getByRole("heading", { level: 2, name: chapterHeadings[chapter] }),
      ).toBeVisible();
      await expectNoHorizontalOverflow(page);
    }
  }
});

test("reduced motion renders the complete journey statically", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(
    page.locator('[data-motion-root="helix-experience"]'),
  ).toHaveAttribute("data-motion-state", "reduced");
  await expect(page.getByTestId("helix-journey")).toHaveAttribute(
    "data-active-chapter",
    "static",
  );
  await expect(page.getByTestId("helix-journey")).toHaveAttribute(
    "data-journey-phase",
    "static",
  );
  await expect(page.locator(".pin-spacer")).toHaveCount(0);

  for (const chapter of journeyChapters) {
    const chapterElement = page.getByTestId(`journey-chapter-${chapter}`);
    const content = chapterElement.locator('[data-motion="journey-content"]');
    const node = page.getByTestId(`journey-node-${chapter}`);
    await expect(chapterElement).toHaveAttribute("data-journey-state", "static");
    await expect(node).toHaveAttribute("data-node-state", "static");
    await expect(content).toHaveCSS("opacity", "1");
    await expect(content).toHaveCSS("transform", "none");
    await centerChapter(page, chapter);
    await expect(
      chapterElement.getByRole("heading", {
        level: 2,
        name: chapterHeadings[chapter],
      }),
    ).toBeVisible();
  }

  await expect(page.getByTestId("journey-continuation")).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "laptop", width: 1024, height: 768 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`keeps the complete journey in bounds at ${viewport.name} size`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expectNoHorizontalOverflow(page);

    const chapterPositions: number[] = [];
    for (const chapter of journeyChapters) {
      const chapterElement = page.getByTestId(`journey-chapter-${chapter}`);
      await centerChapter(page, chapter);
      await expect(chapterElement).toBeVisible();
      await expectNoHorizontalOverflow(page);
      chapterPositions.push(
        await chapterElement.evaluate(
          (element) => element.getBoundingClientRect().top + window.scrollY,
        ),
      );
    }

    expect(chapterPositions).toEqual([...chapterPositions].sort((a, b) => a - b));

    if (viewport.name === "mobile") {
      await expect(page.locator(".pin-spacer")).toHaveCount(0);
      const positions = await page.locator("[data-journey-chapter]").evaluateAll(
        (elements) => elements.map((element) => getComputedStyle(element).position),
      );
      expect(positions.every((position) => position === "relative")).toBe(true);
    }
  });
}
