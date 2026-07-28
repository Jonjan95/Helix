import { mkdir, rename, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import next from "next";
import { chromium } from "@playwright/test";

const phases = new Set(["baseline", "static", "reveal", "chosen"]);
const phaseArgument = process.argv.find((argument) =>
  argument.startsWith("--phase="),
);
const phase = phaseArgument?.split("=")[1] ?? "baseline";

if (!phases.has(phase)) {
  throw new Error(`Unknown organic-branches evidence phase: ${phase}`);
}

const outputDirectory = path.join(
  process.cwd(),
  "docs",
  "media",
  "organic-branches",
  phase,
);
const port = 3111;
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

async function preparePage(
  context,
  {
    pathName = "/#projects",
    setup,
  } = {},
) {
  const page = await context.newPage();
  await page.goto(`${baseUrl}${pathName}`, { waitUntil: "networkidle" });

  if (phase === "static" || phase === "reveal") {
    await page.getByTestId("project-showcase").evaluate((element, mode) => {
      element.dataset.projectBranchMode = mode;
    }, phase);
  }

  if (setup) {
    await setup(page);
  }

  await page.waitForTimeout(500);
  return page;
}

async function capture(
  filename,
  {
    pathName,
    reducedMotion = "no-preference",
    setup,
    viewport = { height: 1000, width: 1440 },
  } = {},
) {
  const context = await browser.newContext({
    colorScheme: "dark",
    reducedMotion,
    viewport,
  });
  const page = await preparePage(context, { pathName, setup });
  await page.screenshot({
    path: path.join(outputDirectory, filename),
  });
  await context.close();
}

const center = (selector) => async (page) => {
  await page.locator(selector).evaluate((element) => {
    element.scrollIntoView({ behavior: "auto", block: "center" });
  });
};

async function capturePhase() {
  await capture("01-projects-approach.png", {
    pathName: "/#skills",
    setup: async (page) => {
      await page.evaluate(() =>
        window.scrollBy({ behavior: "auto", top: window.innerHeight * 0.58 }),
      );
    },
  });
  await capture("02-featured-project.png", {
    setup: center('[data-project="ai-powered-test-engineer"]'),
  });
  await capture("03-supporting-projects.png", {
    setup: center(".supportingProjects, [data-project='cortexgrid']"),
  });
  await capture("04-full-projects.png", {
    setup: center('[data-testid="project-showcase"]'),
  });
  await capture("05-compact-desktop.png", {
    setup: center('[data-project="ai-powered-test-engineer"]'),
    viewport: { height: 800, width: 1280 },
  });
  await capture("06-tablet.png", {
    setup: center('[data-project="ai-powered-test-engineer"]'),
    viewport: { height: 1024, width: 768 },
  });
  await capture("07-mobile.png", {
    setup: center('[data-project="ai-powered-test-engineer"]'),
    viewport: { height: 844, width: 390 },
  });
  await capture("08-reduced-motion.png", {
    reducedMotion: "reduce",
    setup: center('[data-testid="project-showcase"]'),
  });

  if (phase === "reveal") {
    await capture("10-reveal-approaching.png", {
      pathName: "/#skills",
      setup: async (page) => {
        await page.evaluate(() =>
          window.scrollBy({ behavior: "auto", top: window.innerHeight * 0.58 }),
        );
      },
    });
    await capture("11-reveal-active.png", {
      setup: center('[data-project="ai-powered-test-engineer"]'),
    });
    await capture("12-reveal-reverse.png", {
      setup: async (page) => {
        await page
          .getByTestId("journey-chapter-experience")
          .evaluate((element) =>
            element.scrollIntoView({ behavior: "auto", block: "center" }),
          );
        await page
          .getByTestId("journey-chapter-projects")
          .evaluate((element) =>
            element.scrollIntoView({ behavior: "auto", block: "center" }),
          );
      },
    });
  }
}

async function recordJourney() {
  const videoDirectory = path.join(outputDirectory, ".video");
  await mkdir(videoDirectory, { recursive: true });
  const context = await browser.newContext({
    colorScheme: "dark",
    recordVideo: {
      dir: videoDirectory,
      size: { height: 720, width: 1280 },
    },
    viewport: { height: 720, width: 1280 },
  });
  const page = await preparePage(context, { pathName: "/#skills" });
  const video = page.video();
  await page
    .getByTestId("journey-chapter-projects")
    .evaluate((element) =>
      element.scrollIntoView({ behavior: "smooth", block: "center" }),
    );
  await page.waitForTimeout(1800);
  await page
    .getByTestId("journey-chapter-experience")
    .evaluate((element) =>
      element.scrollIntoView({ behavior: "smooth", block: "center" }),
    );
  await page.waitForTimeout(1800);
  await page
    .getByTestId("journey-chapter-projects")
    .evaluate((element) =>
      element.scrollIntoView({ behavior: "smooth", block: "center" }),
    );
  await page.waitForTimeout(1800);
  await page
    .getByTestId("journey-chapter-engineering")
    .evaluate((element) =>
      element.scrollIntoView({ behavior: "smooth", block: "center" }),
    );
  await page.waitForTimeout(1800);
  await context.close();

  if (video) {
    const videoPath = await video.path();
    await rename(
      videoPath,
      path.join(outputDirectory, "09-forward-reverse.webm"),
    );
  }
}

async function captureMetrics() {
  const context = await browser.newContext({
    colorScheme: "dark",
    viewport: { height: 1000, width: 1440 },
  });
  const page = await preparePage(context);
  const messages = [];
  page.on("console", (message) => {
    if (["warning", "error"].includes(message.type())) {
      messages.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => messages.push(`pageerror: ${error.message}`));
  await page.reload({ waitUntil: "networkidle" });

  const resources = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .filter(
        (entry) =>
          entry.name.includes("/_next/") && entry.name.endsWith(".js"),
      )
      .map((entry) => entry.name),
  );
  const uniqueResources = [...new Set(resources)];
  let decodedJavascriptBytes = 0;
  let threeMatches = 0;

  for (const resource of uniqueResources) {
    const source = await (await fetch(resource)).text();
    decodedJavascriptBytes += Buffer.byteLength(source);
    if (/WebGLRenderer|three\.module|REVISION\s*=/.test(source)) {
      threeMatches += 1;
    }
  }

  const metrics = await page.evaluate(() => {
    const showcase = document.querySelector("[data-testid='project-showcase']");
    const branchLayer = showcase?.querySelector("[data-project-branches]");
    const articles = [...document.querySelectorAll("[data-project]")];
    return {
      branchDescendants: branchLayer?.querySelectorAll("*").length ?? 0,
      branchFocusableElements:
        branchLayer?.querySelectorAll(
          "a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])",
        ).length ?? 0,
      branchLayers: document.querySelectorAll("[data-project-branches]").length,
      projectOrder: articles.map((article) =>
        article.getAttribute("data-project"),
      ),
      projectArticles: articles.length,
    };
  });

  await writeFile(
    path.join(outputDirectory, "10-metrics.json"),
    `${JSON.stringify(
      {
        consoleWarningsOrErrors: messages,
        decodedJavascriptBytes,
        javascriptChunks: uniqueResources.length,
        phase,
        productionRoute: "/",
        threeMatches,
        ...metrics,
      },
      null,
      2,
    )}\n`,
  );
  await context.close();
}

try {
  await capturePhase();
  await recordJourney();
  await captureMetrics();
} finally {
  await browser.close();
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await app.close();
}
