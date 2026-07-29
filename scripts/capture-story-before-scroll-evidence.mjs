import { mkdir, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import next from "next";
import { chromium } from "@playwright/test";

const phases = new Set(["before", "after"]);
const phaseArgument = process.argv.find((argument) =>
  argument.startsWith("--phase="),
);
const phase = phaseArgument?.split("=")[1] ?? "before";

if (!phases.has(phase)) {
  throw new Error(`Unknown story-before-scroll evidence phase: ${phase}`);
}

const outputDirectory = path.join(
  process.cwd(),
  "docs",
  "media",
  "story-before-scroll",
  phase,
);
const port = 3115;
const baseUrl = `http://127.0.0.1:${port}`;

await mkdir(outputDirectory, { recursive: true });

const app = next({ dev: false, dir: process.cwd() });
await app.prepare();
const handler = app.getRequestHandler();
const server = createServer((request, response) => {
  void handler(request, response);
});

await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(port, "127.0.0.1", resolve);
});

const browser = await chromium.launch();
const consoleMessages = [];

const centerChapter = (chapter) => async (page) => {
  await page.getByTestId(`journey-chapter-${chapter}`).evaluate((element) => {
    element.scrollIntoView({ behavior: "auto", block: "center" });
  });
};

const betweenChapters = (from, to) => async (page) => {
  await page.evaluate(
    ({ fromChapter, toChapter }) => {
      const fromElement = document.querySelector(
        `[data-journey-chapter="${fromChapter}"]`,
      );
      const toElement = document.querySelector(
        `[data-journey-chapter="${toChapter}"]`,
      );

      if (!(fromElement instanceof HTMLElement) || !(toElement instanceof HTMLElement)) {
        throw new Error("Journey chapter boundary was not found.");
      }

      const fromBounds = fromElement.getBoundingClientRect();
      const toBounds = toElement.getBoundingClientRect();
      const boundary =
        (fromBounds.bottom +
          window.scrollY +
          toBounds.top +
          window.scrollY) /
        2;
      window.scrollTo({
        behavior: "auto",
        top: Math.max(0, boundary - window.innerHeight / 2),
      });
    },
    { fromChapter: from, toChapter: to },
  );
};

async function capture(
  filename,
  {
    pathName = "/",
    setup,
    viewport = { height: 1000, width: 1440 },
  } = {},
) {
  const context = await browser.newContext({
    colorScheme: "dark",
    viewport,
  });
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "warning" || message.type() === "error") {
      consoleMessages.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    consoleMessages.push(`pageerror: ${error.message}`);
  });

  await page.goto(`${baseUrl}${pathName}`, { waitUntil: "networkidle" });
  if (setup) {
    await setup(page);
  }
  await page.waitForTimeout(450);
  await page.screenshot({ path: path.join(outputDirectory, filename) });
  await context.close();
}

const frames = [
  ["01-environment.png", "/#about", centerChapter("environment")],
  [
    "02-environment-to-engineering.png",
    "/#about",
    betweenChapters("environment", "engineering"),
  ],
  ["03-engineering.png", "/#skills", centerChapter("engineering")],
  [
    "04-engineering-to-projects.png",
    "/#skills",
    betweenChapters("engineering", "projects"),
  ],
];

for (const [filename, pathName, setup] of frames) {
  await capture(filename, { pathName, setup });
}

await capture("05-compact-environment.png", {
  pathName: "/#about",
  setup: centerChapter("environment"),
  viewport: { height: 800, width: 1280 },
});
await capture("06-tablet-engineering.png", {
  pathName: "/#skills",
  setup: centerChapter("engineering"),
  viewport: { height: 1024, width: 768 },
});
await capture("07-mobile-environment.png", {
  pathName: "/#about",
  setup: centerChapter("environment"),
  viewport: { height: 844, width: 390 },
});
await capture("08-mobile-engineering.png", {
  pathName: "/#skills",
  setup: centerChapter("engineering"),
  viewport: { height: 844, width: 390 },
});

const metricsContext = await browser.newContext({
  viewport: { height: 1000, width: 1440 },
});
const metricsPage = await metricsContext.newPage();
await metricsPage.goto(baseUrl, { waitUntil: "networkidle" });
const metrics = await metricsPage.evaluate(() => ({
  chapterOrder: [...document.querySelectorAll("[data-journey-chapter]")].map(
    (element) => element.getAttribute("data-journey-chapter"),
  ),
  horizontalOverflow:
    document.documentElement.scrollWidth - document.documentElement.clientWidth,
  journeyMotionOwners: document.querySelectorAll(
    '[data-motion-root="helix-experience"]',
  ).length,
  scrollTriggers: document.querySelectorAll(".pin-spacer").length,
}));
await metricsContext.close();

await writeFile(
  path.join(outputDirectory, "09-metrics.json"),
  `${JSON.stringify(
    {
      ...metrics,
      consoleWarningsOrErrors: [...new Set(consoleMessages)],
      phase,
    },
    null,
    2,
  )}\n`,
);

await browser.close();
await new Promise((resolve, reject) => {
  server.close((error) => {
    if (error) reject(error);
    else resolve();
  });
});
