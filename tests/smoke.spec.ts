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
  contact: "Let’s continue the conversation.",
  engineering: "Start by understanding the problem.",
  environment: "A workspace built around learning by doing.",
  experience: "Experience across software, devices, and field work.",
  projects: "Projects built around real problems.",
} as const;

const environmentPrinciples = [
  "structured-iteration",
  "visible-evidence",
  "practical-experimentation",
] as const;

const engineeringSteps = [
  "understand",
  "isolate",
  "observe",
  "verify",
] as const;

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

const projectStatuses = {
  "AI-Powered Test Engineer": "ACTIVE DEVELOPMENT",
  CortexGrid: "PROTOTYPE COMPLETE",
  Helix: "ACTIVE DEVELOPMENT",
} as const;

const experienceTracks = [
  {
    category: "Software & testing",
    current: true,
    id: "software-quality",
    title: "Software development and testing",
  },
  {
    category: "Embedded & connected systems",
    current: false,
    id: "embedded-connected",
    title: "Embedded software and connected devices",
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
    href: "https://github.com/Jonjan95",
    id: "github",
    label: "GitHub",
    primary: true,
    type: "external",
  },
  {
    href: "https://se.linkedin.com/in/jonathan-jansson-b94783270",
    id: "linkedin",
    label: "LinkedIn",
    primary: false,
    type: "external",
  },
  {
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

  await expect(page).toHaveTitle(/Jonathan Jansson/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(
    page.getByRole("heading", { level: 1, name: "Jonathan Jansson" }),
  ).toBeVisible();
  await expect(page.getByTestId("laptop-hero")).toBeVisible();
  const arrival = page.locator("[data-arrival-identity]");
  await expect(arrival).toBeVisible();
  await expect(
    arrival.getByRole("heading", {
      level: 2,
      name: "Software development student with a focus on testing and quality.",
    }),
  ).toBeVisible();
  await expect(arrival).toContainText("software projects");
  await expect(arrival).toContainText("connected devices");
  await expect(page.getByRole("heading", { name: "Jonis", exact: true })).toHaveCount(0);

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

  const environment = page.getByTestId("journey-chapter-environment");
  const environmentItems = environment.locator("[data-environment-principle]");
  await expect(environmentItems).toHaveCount(3);
  expect(
    await environmentItems.evaluateAll((elements) =>
      elements.map((element) =>
        element.getAttribute("data-environment-principle"),
      ),
    ),
  ).toEqual(environmentPrinciples);
  for (const heading of [
    "Small, reviewable steps",
    "Check what changed",
    "Learn by building",
  ]) {
    await expect(
      environment.getByRole("heading", { level: 3, name: heading }),
    ).toBeAttached();
  }

  const engineering = page.getByTestId("journey-chapter-engineering");
  const engineeringItems = engineering.locator("[data-engineering-step]");
  await expect(engineeringItems).toHaveCount(4);
  expect(
    await engineeringItems.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-engineering-step")),
    ),
  ).toEqual(engineeringSteps);
  for (const heading of ["Understand", "Isolate", "Observe", "Verify"]) {
    await expect(
      engineering.getByRole("heading", { level: 3, name: heading }),
    ).toBeAttached();
  }
  await expect(
    engineering.getByText("The projects below show those steps at work."),
  ).toBeAttached();

  const projects = page.getByTestId("journey-chapter-projects");
  await expect(projects.locator("[data-project]")).toHaveCount(3);
  await expect(
    projects.locator('[data-project-featured="true"]'),
  ).toHaveAttribute("data-project", "ai-powered-test-engineer");
  const featuredProject = projects.locator(
    '[data-project="ai-powered-test-engineer"]',
  );

  for (const [project, repositoryUrl] of Object.entries(projectRepositories)) {
    await expect(
      projects.getByRole("heading", { level: 3, name: project }),
    ).toBeAttached();
    const projectArticle = projects.locator(
      `[data-project="${projectIds[project as keyof typeof projectIds]}"]`,
    );
    await expect(projectArticle.locator("[data-project-status]")).toHaveAttribute(
      "data-project-status",
      projectStatuses[project as keyof typeof projectStatuses],
    );
    await expect(projectArticle.getByText("Current scope")).toBeAttached();
    await expect(
      projectArticle.getByRole("link", {
        name: `View source on GitHub for ${project}`,
      }),
    ).toHaveAttribute("href", repositoryUrl);
  }
  await expect(featuredProject).toContainText("still planned");
  const cortexGrid = projects.locator('[data-project="cortexgrid"]');
  await expect(cortexGrid).toContainText("does not call an AI API");
  await expect(cortexGrid).toContainText("deterministic");
  await expect(projects.locator('[data-project="helix"]')).toContainText(
    "later work",
  );

  for (const evidenceHeading of [
    "Problem",
    "Approach",
    "Technical work",
    "Checks",
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
  await expect(
    experience.locator('[data-experience-track="software-quality"]'),
  ).toContainText("I am studying");
  await expect(experience.getByText(/professional QA employment/i)).toHaveCount(0);
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
      name: "What I worked with",
    })).toBeAttached();
    await expect(article.locator("section li")).toHaveCount(3);
    await expect(article.getByText("What I carry forward")).toBeAttached();
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
    const link = item.getByRole("link");
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

  const skipLink = page.getByRole("link", { name: "Skip to portfolio journey" });
  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#about$/);
  await expect(page.getByTestId("helix-journey")).toHaveAttribute(
    "data-active-chapter",
    "environment",
  );
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "A workspace built around learning by doing.",
    }),
  ).toBeVisible();
});

test("renders restrained decorative Helix depth without changing journey ownership", async ({
  page,
}) => {
  await page.goto("/#projects", { waitUntil: "domcontentloaded" });

  const path = page.getByTestId("helix-path");
  await expect(path).toHaveAttribute("aria-hidden", "true");
  await expect(path).toHaveAttribute("data-helix-depth", "layered");
  await expect(path).toHaveAttribute("data-helix-mode", "static");
  await expect(path).toHaveAttribute(
    "data-mobile-treatment",
    "static-axis",
  );
  await expect(path.locator("svg")).toHaveAttribute("focusable", "false");
  await expect(path.locator("svg text")).toHaveCount(0);
  await expect(path.locator('[data-helix-depth-layer="base"]')).toHaveCount(1);
  await expect(path.locator('[data-helix-depth-layer="near"]')).toHaveCount(1);
  await expect(
    path.locator('[data-helix-depth-layer="crossings"]'),
  ).toHaveCount(1);
  await expect(
    path.locator('[data-helix-depth-layer="connectors"]'),
  ).toHaveCount(1);
  await expect(path.locator("[data-depth-crossing]")).toHaveCount(5);
  await expect(page.locator("[data-journey-node]")).toHaveCount(5);
  await expect(
    page.locator('[data-motion-root="helix-experience"]'),
  ).toHaveCount(1);

  const continuousAnimations = await path.evaluate(
    (element) => element.getAnimations({ subtree: true }).length,
  );
  expect(continuousAnimations).toBe(0);
});

test("keeps early content within its chapter ownership", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const journey = page.getByTestId("helix-journey");
  const environment = page.getByTestId("journey-chapter-environment");
  const engineering = page.getByTestId("journey-chapter-engineering");
  const projects = page.getByTestId("journey-chapter-projects");

  for (const principle of environmentPrinciples) {
    const item = environment.locator(
      `[data-environment-principle="${principle}"]`,
    );
    await item.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "auto" }),
    );
    await expect(journey).toHaveAttribute("data-active-chapter", "environment");
    await expect(item).toBeVisible();
  }

  for (const step of engineeringSteps) {
    const item = engineering.locator(`[data-engineering-step="${step}"]`);
    await item.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "auto" }),
    );
    await expect(journey).toHaveAttribute("data-active-chapter", "engineering");
    await expect(projects).not.toHaveAttribute("data-journey-state", "active");
    await expect(item).toBeVisible();
  }

  await engineering.locator("[data-engineering-handoff]").evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "auto" }),
  );
  await expect(journey).toHaveAttribute("data-active-chapter", "engineering");

  await centerChapter(page, "projects");
  await expect(journey).toHaveAttribute("data-active-chapter", "projects");
  await centerChapter(page, "engineering");
  await expect(journey).toHaveAttribute("data-active-chapter", "engineering");
  await centerChapter(page, "environment");
  await expect(journey).toHaveAttribute("data-active-chapter", "environment");
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

test("keeps workstation detail decorative and screen identity semantic", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const laptop = page.getByTestId("laptop-hero");
  const identity = laptop.locator('[data-motion="screen-identity"]');
  const details = laptop.locator("[data-machine-detail]");

  await expect(laptop).toHaveAttribute(
    "data-machine-direction",
    "refined-workstation",
  );
  await expect(details).toHaveCount(5);
  await expect(
    identity.getByRole("heading", { level: 1, name: "Jonathan Jansson" }),
  ).toBeVisible();
  await expect(laptop.locator("a, button, input, select, textarea")).toHaveCount(
    0,
  );

  const semanticBoundary = await laptop.evaluate((element) => {
    const screenIdentity = element.querySelector<HTMLElement>(
      '[data-motion="screen-identity"]',
    );
    const decorativeDetails = [
      ...element.querySelectorAll<HTMLElement>("[data-machine-detail]"),
    ];

    return {
      allDetailsHiddenFromAssistiveTechnology: decorativeDetails.every(
        (detail) => detail.closest('[aria-hidden="true"]') !== null,
      ),
      identityTransform: screenIdentity
        ? getComputedStyle(screenIdentity).transform
        : "missing",
      identityTransformStyle: screenIdentity
        ? getComputedStyle(screenIdentity).transformStyle
        : "missing",
    };
  });

  expect(semanticBoundary).toEqual({
    allDetailsHiddenFromAssistiveTechnology: true,
    identityTransform: "none",
    identityTransformStyle: "flat",
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(laptop.locator('[data-machine-detail="keyboard"]')).toBeHidden();
  await expect(laptop.locator('[data-machine-detail="trackpad"]')).toBeHidden();
  await expectNoHorizontalOverflow(page);
});

test("keeps the laptop threshold continuous and reversible", async ({ page }) => {
  const browserMessages: string[] = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      browserMessages.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => browserMessages.push(`pageerror: ${error.message}`));

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const laptop = page.getByTestId("laptop-hero");
  const arrivalCopy = page.locator('[data-motion="arrival-copy"]');
  const threshold = laptop.locator('[data-motion="workspace-threshold"]');
  const glass = laptop.locator('[data-motion="screen-glass"]');
  const screenGrid = laptop.locator('[data-motion="screen-grid"]');
  const shell = laptop.locator('[data-motion="laptop-shell"]');
  const identity = laptop.locator('[data-motion="screen-identity"]');
  const motionRoot = page.locator('[data-motion-root="helix-experience"]');
  const journey = page.locator("[data-helix-journey]");

  await expect(motionRoot).toHaveCount(1);
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await expect(laptop).toBeVisible();
  await expect(arrivalCopy).toBeVisible();
  await expect(arrivalCopy).toHaveCSS("opacity", "1");
  await expect(glass).toHaveAttribute("aria-hidden", "true");
  await expect(screenGrid).toHaveAttribute("aria-hidden", "true");
  await expect(journey).toHaveAttribute("data-grid-handoff", "sequential");
  await expect(identity).toBeVisible();

  const pinDistance = await page.locator(".pin-spacer").evaluate((spacer) =>
    Number.parseFloat(getComputedStyle(spacer).paddingBottom),
  );
  await page.evaluate(
    (distance) => window.scrollTo({ top: distance * 0.5, behavior: "auto" }),
    pinDistance,
  );
  await page.waitForTimeout(700);
  await expect(identity).toBeVisible();
  const midpointBounds = await laptop.evaluate((element) => {
    const bounds = element.getBoundingClientRect();

    return {
      bottom: bounds.bottom,
      left: bounds.left,
      right: bounds.right,
      top: bounds.top,
    };
  });
  expect(midpointBounds.left).toBeGreaterThanOrEqual(-1);
  expect(midpointBounds.right).toBeLessThanOrEqual(1441);
  expect(midpointBounds.top).toBeGreaterThanOrEqual(-1);
  expect(midpointBounds.bottom).toBeLessThanOrEqual(1001);

  await page.evaluate(
    (distance) => window.scrollTo({ top: distance * 0.78, behavior: "auto" }),
    pinDistance,
  );
  await page.waitForTimeout(700);
  await expect(threshold).toBeVisible();
  await expect(shell).toBeVisible();
  await expect(arrivalCopy).toHaveCSS("opacity", "0");
  const crossingEmphasis = await laptop.evaluate((element) => {
    const arrivalIdentity = element.querySelector(
      '[data-motion="screen-identity"]',
    );
    const workspaceThreshold = element.querySelector(
      '[data-motion="workspace-threshold"]',
    );

    return {
      identity: arrivalIdentity
        ? Number.parseFloat(getComputedStyle(arrivalIdentity).opacity)
        : 1,
      threshold: workspaceThreshold
        ? Number.parseFloat(getComputedStyle(workspaceThreshold).opacity)
        : 0,
    };
  });
  expect(crossingEmphasis.identity).toBeLessThan(crossingEmphasis.threshold);
  await expectNoHorizontalOverflow(page);

  await page.evaluate(
    (distance) => window.scrollTo({ top: distance, behavior: "auto" }),
    pinDistance,
  );
  await page.waitForTimeout(700);
  await expect(threshold).toBeVisible();
  const resolvedGridComposition = await page.evaluate(() => {
    const grid = document.querySelector<HTMLElement>(
      '[data-motion="screen-grid"]',
    );
    const screen = document.querySelector<HTMLElement>(
      '[data-motion="laptop-screen"]',
    );
    const workspace = document.querySelector<HTMLElement>(
      "[data-helix-journey]",
    );

    if (!grid || !screen || !workspace) {
      return null;
    }

    return {
      screenGridOpacity: Number.parseFloat(getComputedStyle(grid).opacity),
      screenSurface: getComputedStyle(screen).backgroundImage,
      transitionLayers: (
        getComputedStyle(workspace, "::before").backgroundImage.match(
          /linear-gradient/g,
        ) ?? []
      ).length,
    };
  });
  expect(resolvedGridComposition).not.toBeNull();
  expect(resolvedGridComposition?.screenGridOpacity).toBeLessThan(0.01);
  expect(resolvedGridComposition?.screenSurface).toBe("none");
  expect(resolvedGridComposition?.transitionLayers).toBe(1);

  await page.evaluate(
    (distance) => window.scrollTo({ top: distance + 150, behavior: "auto" }),
    pinDistance,
  );
  await page.waitForTimeout(400);
  const releaseComposition = await page.evaluate(() => {
    const arrival = document.querySelector('[data-chapter="arrival"]');
    const journey = document.querySelector("[data-helix-journey]");
    const screen = document.querySelector('[data-motion="laptop-screen"]');

    if (!arrival || !journey || !screen) {
      return null;
    }

    const arrivalBounds = arrival.getBoundingClientRect();
    const journeyBounds = journey.getBoundingClientRect();
    const screenBounds = screen.getBoundingClientRect();
    const boundaryElement = document.elementFromPoint(
      window.innerWidth / 2,
      journeyBounds.top + 2,
    );

    return {
      arrivalBottom: arrivalBounds.bottom,
      boundaryChapter: boundaryElement
        ?.closest("[data-chapter]")
        ?.getAttribute("data-chapter"),
      journeyTop: journeyBounds.top,
      screenBottom: screenBounds.bottom,
    };
  });
  expect(releaseComposition).not.toBeNull();
  expect(releaseComposition?.screenBottom).toBeGreaterThan(
    releaseComposition?.journeyTop ?? Number.POSITIVE_INFINITY,
  );
  expect(releaseComposition?.screenBottom).toBeGreaterThan(
    releaseComposition?.arrivalBottom ?? Number.POSITIVE_INFINITY,
  );
  expect(releaseComposition?.boundaryChapter).toBe("arrival");

  await expect(page.locator('[data-motion="digital-workspace"]')).toHaveCount(1);
  await expect(page.getByTestId("digital-workspace")).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.evaluate(
    (distance) => window.scrollTo({ top: distance + 80, behavior: "auto" }),
    pinDistance,
  );
  await page.waitForTimeout(300);
  await page.evaluate(
    (distance) => window.scrollTo({ top: distance * 0.5, behavior: "auto" }),
    pinDistance,
  );
  await page.waitForTimeout(700);
  await expect(laptop).toBeVisible();
  await expect(identity).toBeVisible();
  await expect(shell).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(2);
  await expect(arrivalCopy).toHaveCSS("opacity", "1");
  await expect(arrivalCopy).toBeVisible();
  await expect(identity).toBeVisible();
  await expect(shell).toBeVisible();
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
    .getByRole("link", { name: "View source on GitHub for Helix" })
    .evaluate((element) => element.scrollIntoView({ block: "center" }));
  await expect(journey).toHaveAttribute("data-active-chapter", "projects");
  await expect(projects).toHaveAttribute("data-journey-state", "active");
  await expect(experience).not.toHaveAttribute("data-journey-state", "active");
  await expect(
    projects.getByRole("link", {
      name: "View source on GitHub for Helix",
    }),
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

test("keeps project branches decorative and within the existing journey owner", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#projects", { waitUntil: "domcontentloaded" });

  const showcase = page.getByTestId("project-showcase");
  const branches = showcase.locator("[data-project-branch]");

  await expect(page.locator('[data-motion-root="helix-experience"]')).toHaveCount(
    1,
  );
  await expect(showcase).toHaveAttribute("data-project-branch-mode", "static");
  await expect(branches).toHaveCount(3);
  expect(
    await branches.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-project-branch")),
    ),
  ).toEqual(["ai-powered-test-engineer", "cortexgrid", "helix"]);
  await expect(
    showcase.locator('[data-project-branch-featured="true"]'),
  ).toHaveAttribute("data-project-branch", "ai-powered-test-engineer");

  for (const branch of await branches.all()) {
    await expect(branch).toHaveAttribute("aria-hidden", "true");
    await expect(branch.locator("svg")).toHaveAttribute("focusable", "false");
    await expect(
      branch.locator(
        "a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])",
      ),
    ).toHaveCount(0);
  }

  const layout = await showcase.locator("[data-project]").evaluateAll(
    (articles) =>
      articles.map((article) => {
        const branch = article.querySelector<HTMLElement>(
          "[data-project-branch]",
        );
        const articleBounds = article.getBoundingClientRect();
        const branchBounds = branch?.getBoundingClientRect();
        return {
          branchHasArea: branchBounds
            ? branchBounds.width > 0 && branchBounds.height > 0
            : false,
          branchStartsAtContentEdge: branchBounds
            ? branchBounds.left >= articleBounds.right - 2
            : false,
          id: article.getAttribute("data-project"),
        };
      }),
  );
  expect(layout.map(({ id }) => id)).toEqual([
    "ai-powered-test-engineer",
    "cortexgrid",
    "helix",
  ]);
  expect(layout.every(({ branchHasArea }) => branchHasArea)).toBe(true);
  expect(
    layout.every(({ branchStartsAtContentEdge }) => branchStartsAtContentEdge),
  ).toBe(true);
  await expectNoHorizontalOverflow(page);
});

test("simplifies project branches on mobile and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#projects", { waitUntil: "domcontentloaded" });

  const showcase = page.getByTestId("project-showcase");
  const articles = showcase.locator("[data-project]");
  const layout = await articles.evaluateAll((elements) =>
    elements.map((article) => {
      const branch = article.querySelector<HTMLElement>(
        "[data-project-branch]",
      );
      const articleBounds = article.getBoundingClientRect();
      const branchBounds = branch?.getBoundingClientRect();
      return {
        branchIsShort: branchBounds
          ? branchBounds.width > 0 && branchBounds.width < 48
          : false,
        branchPrecedesContent: branchBounds
          ? branchBounds.right <= articleBounds.left
          : false,
        id: article.getAttribute("data-project"),
        runningAnimations: branch?.getAnimations({ subtree: true }).length ?? -1,
      };
    }),
  );

  expect(layout.map(({ id }) => id)).toEqual([
    "ai-powered-test-engineer",
    "cortexgrid",
    "helix",
  ]);
  expect(layout.every(({ branchIsShort }) => branchIsShort)).toBe(true);
  expect(layout.every(({ branchPrecedesContent }) => branchPrecedesContent)).toBe(
    true,
  );
  expect(layout.every(({ runningAnimations }) => runningAnimations === 0)).toBe(
    true,
  );
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
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
    if (accessibleName?.match(/^View source on GitHub for .+$/)) {
      focusedProjectLinks.push(accessibleName);
    }
  }

  expect(focusedProjectLinks).toEqual(
    Object.keys(projectRepositories).map(
      (project) => `View source on GitHub for ${project}`,
    ),
  );
});

test("keeps visual hierarchy and focus treatment outcome-based", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const hierarchy = await page.evaluate(() => {
    const fontSize = (selector: string) => {
      const element = document.querySelector(selector);
      return element ? Number.parseFloat(getComputedStyle(element).fontSize) : 0;
    };

    return {
      currentExperience: fontSize(
        '[data-experience-current="true"] h3',
      ),
      featuredProject: fontSize('[data-project-featured="true"] h3'),
      supportingExperience: fontSize(
        '[data-experience-current="false"] h3',
      ),
      supportingProject: fontSize(
        '[data-project-featured="false"] h3',
      ),
    };
  });

  expect(hierarchy.featuredProject).toBeGreaterThan(
    hierarchy.supportingProject,
  );
  expect(hierarchy.currentExperience).toBeGreaterThan(
    hierarchy.supportingExperience,
  );

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", {
    name: "Skip to portfolio journey",
  });
  await expect(skipLink).toBeFocused();
  const focusTreatment = await skipLink.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
    };
  });
  expect(focusTreatment.outlineStyle).not.toBe("none");
  expect(focusTreatment.outlineWidth).toBeGreaterThanOrEqual(2);
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
    .getByRole("link", { name: "View source on GitHub for Helix" })
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
    .getByRole("link", { name: "View source on GitHub for Helix" })
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
  const reducedPath = page.getByTestId("helix-path");
  await expect(reducedPath).toHaveAttribute("data-helix-depth", "layered");
  expect(
    await reducedPath.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
  await expect(page.locator("[data-arrival-identity]")).toBeVisible();
  await expect(page.locator('[data-motion="arrival-copy"]')).toBeVisible();
  await expect(page.locator('[data-motion="arrival-copy"]')).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(page.locator('[data-motion="arrival-copy"]')).toHaveCSS(
    "transform",
    "none",
  );
  await expect(page.locator('[data-motion="screen-glass"]')).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await expect(page.locator('[data-motion="screen-glass"]')).not.toHaveAttribute(
    "tabindex",
    /.+/,
  );
  await expect(page.locator("[data-environment-principle]")).toHaveCount(3);
  await expect(page.locator("[data-engineering-step]")).toHaveCount(4);
  for (const selector of [
    ...environmentPrinciples.map(
      (id) => `[data-environment-principle="${id}"]`,
    ),
    ...engineeringSteps.map((id) => `[data-engineering-step="${id}"]`),
  ]) {
    const item = page.locator(selector);
    await item.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "auto" }),
    );
    await expect(item).toBeVisible();
  }

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
      page.getByRole("link", {
        name: `View source on GitHub for ${project}`,
      }),
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

test("mobile preserves the complete early journey order", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.locator("[data-arrival-identity]")).toBeVisible();
  const mobilePath = page.getByTestId("helix-path");
  await expect(mobilePath).toHaveAttribute(
    "data-mobile-treatment",
    "static-axis",
  );
  await expect(mobilePath.locator("svg")).toHaveCSS("display", "none");
  expect(
    await mobilePath.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);

  const earlyItems = page.locator(
    "[data-environment-principle], [data-engineering-step]",
  );
  await expect(earlyItems).toHaveCount(7);
  const layout = await earlyItems.evaluateAll((elements) =>
    elements.map((element) => {
      const bounds = element.getBoundingClientRect();
      return {
        id:
          element.getAttribute("data-environment-principle") ??
          element.getAttribute("data-engineering-step"),
        top: bounds.top + window.scrollY,
      };
    }),
  );
  expect(layout.map(({ id }) => id)).toEqual([
    ...environmentPrinciples,
    ...engineeringSteps,
  ]);
  expect(layout.map(({ top }) => top)).toEqual(
    [...layout.map(({ top }) => top)].sort((a, b) => a - b),
  );
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
  { name: "compact desktop", width: 1280, height: 800 },
  { name: "laptop", width: 1024, height: 768 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
  { name: "narrow mobile", width: 360, height: 800 },
]) {
  test(`keeps the complete journey in bounds at ${viewport.name} size`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expectNoHorizontalOverflow(page);

    const repositoryLinkHeights = await page
      .getByTestId("journey-chapter-projects")
      .getByRole("link")
      .evaluateAll((links) =>
        links.map((link) => link.getBoundingClientRect().height),
      );
    expect(repositoryLinkHeights.every((height) => height >= 44)).toBe(true);

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

    if (viewport.width <= 390) {
      await expect(page.locator(".pin-spacer")).toHaveCount(0);
      const positions = await page.locator("[data-journey-chapter]").evaluateAll(
        (elements) => elements.map((element) => getComputedStyle(element).position),
      );
      expect(positions.every((position) => position === "relative")).toBe(true);

      const entryLinkHeight = await page
        .getByRole("link", {
          name: "Scroll to enter the portfolio journey",
        })
        .evaluate((link) => link.getBoundingClientRect().height);
      expect(entryLinkHeight).toBeGreaterThanOrEqual(44);
    }
  });
}
