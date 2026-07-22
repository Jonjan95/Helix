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

const projectRepositories = {
  "AI-Powered Test Engineer":
    "https://github.com/Jonjan95/AI-Powered-Test-Engineer",
  CortexGrid: "https://github.com/Jonjan95/CortexGrid",
  Helix: "https://github.com/Jonjan95/Helix",
} as const;

const projectIds = {
  "AI-Powered Test Engineer": "ai-powered-test-engineer",
  CortexGrid: "cortexgrid",
  Helix: "helix",
} as const;

const experienceTracks = [
  {
    category: "Software & quality",
    current: true,
    id: "software-quality",
    title: "Software development and quality engineering",
  },
  {
    category: "Embedded & connected systems",
    current: false,
    id: "embedded-connected",
    title: "Embedded systems and connected devices",
  },
  {
    category: "Technical service",
    current: false,
    id: "field-troubleshooting",
    title: "Technical service and field troubleshooting",
  },
] as const;

const contactRoutes = [
  {
    accessibleName:
      "Explore Jonathan Jansson's public repositories on GitHub",
    href: "https://github.com/Jonjan95",
    id: "github",
    label: "GitHub",
    primary: true,
    type: "external",
  },
  {
    accessibleName:
      "View Jonathan Jansson's professional profile on LinkedIn",
    href: "https://se.linkedin.com/in/jonathan-jansson-b94783270",
    id: "linkedin",
    label: "LinkedIn",
    primary: false,
    type: "external",
  },
  {
    accessibleName:
      "Email Jonathan Jansson about LIA, junior opportunities, or technical collaboration",
    href: "mailto:jonis.jansson@hotmail.com",
    id: "email",
    label: "Email",
    primary: false,
    type: "email",
  },
] as const;

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
  await expect(projects.locator("[data-project]")).toHaveCount(3);
  await expect(
    projects.locator('[data-project-featured="true"]'),
  ).toHaveAttribute("data-project", "ai-powered-test-engineer");

  for (const [project, repositoryUrl] of Object.entries(projectRepositories)) {
    await expect(
      projects.getByRole("heading", { level: 3, name: project }),
    ).toBeAttached();
    const projectArticle = projects.locator(
      `[data-project="${projectIds[project as keyof typeof projectIds]}"]`,
    );
    await expect(projectArticle.locator("[data-project-status]")).toHaveCount(1);
    await expect(
      projectArticle.getByRole("link", {
        name: `View ${project} on GitHub`,
      }),
    ).toHaveAttribute("href", repositoryUrl);
  }

  const featuredProject = projects.locator(
    '[data-project="ai-powered-test-engineer"]',
  );
  for (const evidenceHeading of [
    "Problem",
    "Approach",
    "Technical evidence",
    "Quality evidence",
  ]) {
    await expect(
      featuredProject.getByRole("heading", {
        level: 4,
        name: evidenceHeading,
      }),
    ).toBeAttached();
  }

  await expect(projects.getByRole("link")).toHaveCount(3);
  await expect(projects.getByRole("button")).toHaveCount(0);
  await expect(projects.locator('a[href="#"]')).toHaveCount(0);

  const ids = await page.locator("[id]").evaluateAll((elements) =>
    elements.map((element) => element.id),
  );
  expect(new Set(ids).size).toBe(ids.length);

  const experience = page.getByTestId("journey-chapter-experience");
  const experienceArticles = experience.locator("[data-experience-track]");
  await expect(experienceArticles).toHaveCount(3);
  expect(
    await experienceArticles.evaluateAll((elements) =>
      elements.map((element) =>
        element.getAttribute("data-experience-track"),
      ),
    ),
  ).toEqual(experienceTracks.map(({ id }) => id));

  for (const track of experienceTracks) {
    const article = experience.locator(
      `[data-experience-track="${track.id}"]`,
    );
    await expect(article).toHaveAttribute(
      "data-experience-current",
      track.current ? "true" : "false",
    );
    await expect(
      article.locator(`[data-experience-category="${track.category}"]`),
    ).toHaveCount(1);
    await expect(
      article.getByRole("heading", { level: 3, name: track.title }),
    ).toBeAttached();
    await expect(article.getByRole("heading", {
      level: 4,
      name: "Evidence in practice",
    })).toBeAttached();
    await expect(article.locator("section li")).toHaveCount(3);
    await expect(article.getByText("What it contributes now")).toBeAttached();
  }
  await expect(experience.getByRole("link")).toHaveCount(0);
  await expect(experience.getByRole("button")).toHaveCount(0);
  await expect(experience.locator("[data-client], [data-employer]")).toHaveCount(0);

  const contact = page.getByTestId("journey-chapter-contact");
  const contactItems = contact.locator("[data-contact-route]");
  await expect(contactItems).toHaveCount(3);
  expect(
    await contactItems.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-contact-route")),
    ),
  ).toEqual(contactRoutes.map(({ id }) => id));

  for (const route of contactRoutes) {
    const item = contact.locator(`[data-contact-route="${route.id}"]`);
    const link = item.getByRole("link", { name: route.accessibleName });
    await expect(item).toHaveAttribute("data-contact-type", route.type);
    await expect(item).toHaveAttribute(
      "data-contact-primary",
      route.primary ? "true" : "false",
    );
    await expect(item.getByText(route.label, { exact: true })).toBeAttached();
    await expect(link).toHaveAttribute("href", route.href);
  }
  await expect(contact.getByRole("list", { name: "Contact routes" })).toHaveCount(1);
  await expect(contact.getByRole("link")).toHaveCount(3);
  await expect(contact.getByRole("button")).toHaveCount(0);
  await expect(contact.locator('a[href="#"]')).toHaveCount(0);
  await expect(contact.getByText("The path remains open.")).toBeAttached();

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
    await expect
      .poll(() =>
        page
          .getByTestId(`journey-chapter-${chapter}`)
          .getAttribute("data-journey-state"),
      )
      .toMatch(/^(approaching|active)$/);
    const transitionState = await page
      .getByTestId(`journey-chapter-${chapter}`)
      .getAttribute("data-journey-state");
    expect(["approaching", "active"]).toContain(transitionState);

    if (transitionState === "approaching") {
      await expect(page.getByTestId(`journey-node-${chapter}`)).toHaveAttribute(
        "data-node-state",
        "approaching",
      );
    }

    if (index > 0 && transitionState === "approaching") {
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

test("keeps the complete project evidence within the Projects interval", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const journey = page.getByTestId("helix-journey");
  const projects = page.getByTestId("journey-chapter-projects");
  const experience = page.getByTestId("journey-chapter-experience");

  await centerChapter(page, "engineering");
  await expect(journey).toHaveAttribute("data-active-chapter", "engineering");

  await projects
    .getByRole("link", { name: "View Helix on GitHub" })
    .evaluate((element) => element.scrollIntoView({ block: "center" }));
  await expect(journey).toHaveAttribute("data-active-chapter", "projects");
  await expect(projects).toHaveAttribute("data-journey-state", "active");
  await expect(experience).not.toHaveAttribute("data-journey-state", "active");
  await expect(
    projects.getByRole("link", { name: "View Helix on GitHub" }),
  ).toBeVisible();

  await centerChapter(page, "experience");
  await expect(journey).toHaveAttribute("data-active-chapter", "experience");

  await centerChapter(page, "projects");
  await expect(journey).toHaveAttribute("data-active-chapter", "projects");
  await expect(page.getByTestId("journey-node-projects")).toHaveAttribute(
    "data-node-state",
    "active",
  );
  await expect(
    projects.locator('[data-project="ai-powered-test-engineer"]'),
  ).toBeVisible();
});

test("repository links follow a meaningful keyboard sequence", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const focusedProjectLinks: string[] = [];
  for (
    let attempt = 0;
    attempt < 8 && focusedProjectLinks.length < 3;
    attempt += 1
  ) {
    await page.keyboard.press("Tab");
    const accessibleName = await page.evaluate(() =>
      document.activeElement?.getAttribute("aria-label"),
    );
    if (accessibleName?.match(/^View .+ on GitHub$/)) {
      focusedProjectLinks.push(accessibleName);
    }
  }

  expect(focusedProjectLinks).toEqual(
    Object.keys(projectRepositories).map(
      (project) => `View ${project} on GitHub`,
    ),
  );
});

test("contact routes follow a meaningful keyboard sequence", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const focusedContactRoutes: string[] = [];
  for (
    let attempt = 0;
    attempt < 16 && focusedContactRoutes.length < contactRoutes.length;
    attempt += 1
  ) {
    await page.keyboard.press("Tab");
    const routeId = await page.evaluate(() =>
      document.activeElement
        ?.closest("[data-contact-route]")
        ?.getAttribute("data-contact-route"),
    );
    if (routeId) {
      focusedContactRoutes.push(routeId);
    }
  }

  expect(focusedContactRoutes).toEqual(contactRoutes.map(({ id }) => id));
});

test("keeps every Experience track within the Experience interval", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const journey = page.getByTestId("helix-journey");
  const projects = page.getByTestId("journey-chapter-projects");
  const experience = page.getByTestId("journey-chapter-experience");
  const contact = page.getByTestId("journey-chapter-contact");
  const firstTrack = experience.locator(
    '[data-experience-track="software-quality"]',
  );

  await projects
    .getByRole("link", { name: "View Helix on GitHub" })
    .evaluate((element) => element.scrollIntoView({ block: "center" }));
  await expect(journey).toHaveAttribute("data-active-chapter", "projects");

  await firstTrack.evaluate((element) => {
    const targetTop =
      element.getBoundingClientRect().top +
      window.scrollY -
      window.innerHeight * 0.86;
    window.scrollTo({ top: targetTop, behavior: "auto" });
  });
  await expect(journey).toHaveAttribute("data-active-chapter", "experience");
  await expect(firstTrack).toBeVisible();

  for (const track of experienceTracks) {
    const article = experience.locator(
      `[data-experience-track="${track.id}"]`,
    );
    await article.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "auto" }),
    );
    await expect(journey).toHaveAttribute("data-active-chapter", "experience");
    await expect(experience).toHaveAttribute("data-journey-state", "active");
    await expect(article).toBeVisible();
    await expect(contact).not.toHaveAttribute("data-journey-state", "active");
  }

  await centerChapter(page, "contact");
  await expect(journey).toHaveAttribute("data-active-chapter", "contact");

  await experience
    .locator('[data-experience-track="field-troubleshooting"]')
    .evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "auto" }),
    );
  await expect(journey).toHaveAttribute("data-active-chapter", "experience");

  await projects
    .getByRole("link", { name: "View Helix on GitHub" })
    .evaluate((element) => element.scrollIntoView({ block: "center" }));
  await expect(journey).toHaveAttribute("data-active-chapter", "projects");
});

test("keeps every contact route within the Continue interval", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const journey = page.getByTestId("helix-journey");
  const experience = page.getByTestId("journey-chapter-experience");
  const contact = page.getByTestId("journey-chapter-contact");
  const firstRoute = contact.locator('[data-contact-route="github"]');

  await experience
    .locator('[data-experience-track="field-troubleshooting"]')
    .evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "auto" }),
    );
  await expect(journey).toHaveAttribute("data-active-chapter", "experience");

  await firstRoute.evaluate((element) => {
    const targetTop =
      element.getBoundingClientRect().top +
      window.scrollY -
      window.innerHeight * 0.86;
    window.scrollTo({ top: targetTop, behavior: "auto" });
  });
  await expect(journey).toHaveAttribute("data-active-chapter", "contact");
  await expect(firstRoute).toBeVisible();

  for (const route of contactRoutes) {
    const item = contact.locator(`[data-contact-route="${route.id}"]`);
    await item.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "auto" }),
    );
    await expect(journey).toHaveAttribute("data-active-chapter", "contact");
    await expect(contact).toHaveAttribute("data-journey-state", "active");
    await expect(item.getByRole("link")).toBeVisible();
  }

  await page
    .getByTestId("journey-continuation")
    .evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "auto" }),
    );
  await expect(page.getByTestId("journey-continuation")).toBeVisible();
  await expect(journey).toHaveAttribute("data-active-chapter", "contact");

  await firstRoute.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "auto" }),
  );
  await expect(journey).toHaveAttribute("data-active-chapter", "contact");

  await experience
    .locator('[data-experience-track="field-troubleshooting"]')
    .evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "auto" }),
    );
  await expect(journey).toHaveAttribute("data-active-chapter", "experience");
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
  const projectArticles = page
    .getByTestId("journey-chapter-projects")
    .locator("[data-project]");
  await expect(projectArticles).toHaveCount(3);
  for (const project of Object.keys(projectRepositories)) {
    await expect(
      page.getByRole("heading", { level: 3, name: project }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: `View ${project} on GitHub` }),
    ).toBeVisible();
  }

  const reducedExperienceTracks = page
    .getByTestId("journey-chapter-experience")
    .locator("[data-experience-track]");
  await expect(reducedExperienceTracks).toHaveCount(3);
  for (const track of experienceTracks) {
    const article = reducedExperienceTracks.filter({
      has: page.getByRole("heading", { level: 3, name: track.title }),
    });
    await centerChapter(page, "experience");
    await article.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "auto" }),
    );
    await expect(article).toBeVisible();
  }

  const reducedContactRoutes = page
    .getByTestId("journey-chapter-contact")
    .locator("[data-contact-route]");
  await expect(reducedContactRoutes).toHaveCount(3);
  for (const route of contactRoutes) {
    const link = reducedContactRoutes
      .filter({ has: page.getByText(route.label, { exact: true }) })
      .getByRole("link");
    await link.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "auto" }),
    );
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", route.href);
  }
  await expectNoHorizontalOverflow(page);
});

test("mobile stacks projects in semantic order", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#projects", { waitUntil: "domcontentloaded" });

  const projects = page
    .getByTestId("journey-chapter-projects")
    .locator("[data-project]");
  const order = await projects.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("data-project")),
  );
  expect(order).toEqual(["ai-powered-test-engineer", "cortexgrid", "helix"]);

  const positions = await projects.evaluateAll((elements) =>
    elements.map((element) => {
      const bounds = element.getBoundingClientRect();
      return { left: bounds.left, top: bounds.top };
    }),
  );
  expect(positions.map(({ top }) => top)).toEqual(
    [...positions.map(({ top }) => top)].sort((a, b) => a - b),
  );
  const horizontalOffset =
    Math.max(...positions.map(({ left }) => left)) -
    Math.min(...positions.map(({ left }) => left));
  expect(horizontalOffset).toBeLessThan(2);
  const repositoryLinkHeights = await page
    .getByTestId("journey-chapter-projects")
    .getByRole("link")
    .evaluateAll((links) =>
      links.map((link) => link.getBoundingClientRect().height),
    );
  expect(repositoryLinkHeights.every((height) => height >= 44)).toBe(true);
  await expectNoHorizontalOverflow(page);
});

test("mobile stacks Experience tracks in semantic order", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#experience", { waitUntil: "domcontentloaded" });

  const tracks = page
    .getByTestId("journey-chapter-experience")
    .locator("[data-experience-track]");
  await expect(tracks).toHaveCount(3);

  const positions = await tracks.evaluateAll((elements) =>
    elements.map((element) => {
      const bounds = element.getBoundingClientRect();
      return {
        id: element.getAttribute("data-experience-track"),
        left: bounds.left,
        top: bounds.top,
      };
    }),
  );
  expect(positions.map(({ id }) => id)).toEqual(
    experienceTracks.map(({ id }) => id),
  );
  expect(positions.map(({ top }) => top)).toEqual(
    [...positions.map(({ top }) => top)].sort((a, b) => a - b),
  );
  const horizontalOffset =
    Math.max(...positions.map(({ left }) => left)) -
    Math.min(...positions.map(({ left }) => left));
  expect(horizontalOffset).toBeLessThan(2);

  for (const track of experienceTracks) {
    const article = tracks.filter({
      has: page.getByRole("heading", { level: 3, name: track.title }),
    });
    await article.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "auto" }),
    );
    await expect(article).toBeVisible();
    await expectNoHorizontalOverflow(page);
  }
});

test("mobile stacks usable contact routes in semantic order", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#contact", { waitUntil: "domcontentloaded" });

  const routes = page
    .getByTestId("journey-chapter-contact")
    .locator("[data-contact-route]");
  await expect(routes).toHaveCount(3);

  const layout = await routes.evaluateAll((elements) =>
    elements.map((element) => {
      const bounds = element.getBoundingClientRect();
      const link = element.querySelector("a");
      return {
        height: link?.getBoundingClientRect().height ?? 0,
        id: element.getAttribute("data-contact-route"),
        left: bounds.left,
        top: bounds.top,
      };
    }),
  );
  expect(layout.map(({ id }) => id)).toEqual(contactRoutes.map(({ id }) => id));
  expect(layout.map(({ top }) => top)).toEqual(
    [...layout.map(({ top }) => top)].sort((a, b) => a - b),
  );
  expect(layout.every(({ height }) => height >= 44)).toBe(true);
  const horizontalOffset =
    Math.max(...layout.map(({ left }) => left)) -
    Math.min(...layout.map(({ left }) => left));
  expect(horizontalOffset).toBeLessThan(2);
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
