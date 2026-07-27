import { mkdir, rename, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import next from "next";
import { chromium } from "@playwright/test";

const phases = new Set(["baseline", "static", "ambient", "chosen"]);
const phaseArgument = process.argv.find((argument) =>
  argument.startsWith("--phase="),
);
const phase = phaseArgument?.split("=")[1] ?? "baseline";
const metricsOnly = process.argv.includes("--metrics-only");

if (!phases.has(phase)) {
  throw new Error(`Unknown living-helix evidence phase: ${phase}`);
}

const outputDirectory = path.join(
  process.cwd(),
  "docs",
  "media",
  "living-helix",
  phase,
);
const port = 3110;
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
    pathName = "/",
    helixMode,
    setup,
  } = {},
) {
  const page = await context.newPage();
  await page.goto(`${baseUrl}${pathName}`, { waitUntil: "networkidle" });

  if (helixMode) {
    await page.getByTestId("helix-path").evaluate((element, mode) => {
      element.dataset.helixMode = mode;
    }, helixMode);
  }

  if (setup) {
    await setup(page);
  }

  await page.waitForTimeout(700);
  return page;
}

async function capture(
  filename,
  {
    forcedColors,
    fullPage = false,
    helixMode,
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
  const page = await preparePage(context, { pathName, helixMode, setup });

  if (forcedColors) {
    await page.emulateMedia({ forcedColors });
    await page.waitForTimeout(250);
  }

  await page.screenshot({
    fullPage,
    path: path.join(outputDirectory, filename),
  });
  await context.close();
}

const centerChapter = (chapter) => async (page) => {
  await page.getByTestId(`journey-chapter-${chapter}`).evaluate((element) => {
    element.scrollIntoView({ behavior: "auto", block: "center" });
  });
};

const chapterFrames = [
  ["01-environment.png", "/#about"],
  ["02-engineering.png", "/#skills"],
  ["03-projects.png", "/#projects"],
  ["04-experience.png", "/#experience"],
  ["05-continue.png", "/#contact"],
];

async function capturePhase() {
  const helixMode =
    phase === "static" ? "static" : phase === "ambient" ? "ambient" : undefined;

  for (const [filename, pathName] of chapterFrames) {
    await capture(filename, { helixMode, pathName });
  }

  await capture("06-crossing.png", {
    helixMode,
    pathName: "/#skills",
    setup: async (page) => {
      await page.evaluate(() =>
        window.scrollBy({ behavior: "auto", top: window.innerHeight * 0.22 }),
      );
    },
  });
  await capture("07-compact-desktop.png", {
    helixMode,
    pathName: "/#projects",
    viewport: { height: 800, width: 1280 },
  });
  await capture("08-laptop.png", {
    helixMode,
    pathName: "/#experience",
    viewport: { height: 768, width: 1024 },
  });
  await capture("09-tablet.png", {
    helixMode,
    setup: centerChapter("engineering"),
    viewport: { height: 1024, width: 768 },
  });
  await capture("10-mobile.png", {
    helixMode,
    setup: centerChapter("projects"),
    viewport: { height: 844, width: 390 },
  });
  await capture("11-narrow-mobile.png", {
    helixMode,
    setup: centerChapter("experience"),
    viewport: { height: 800, width: 360 },
  });
  await capture("12-reduced-motion.png", {
    fullPage: true,
    helixMode,
    reducedMotion: "reduce",
    viewport: { height: 1000, width: 1440 },
  });
  await capture("13-forced-colors.png", {
    forcedColors: "active",
    helixMode,
    pathName: "/#skills",
    reducedMotion: "reduce",
    viewport: { height: 768, width: 1024 },
  });
}

async function recordJourney() {
  const context = await browser.newContext({
    colorScheme: "dark",
    recordVideo: {
      dir: outputDirectory,
      size: { height: 800, width: 1280 },
    },
    viewport: { height: 800, width: 1280 },
  });
  const page = await preparePage(context, {
    helixMode:
      phase === "static"
        ? "static"
        : phase === "ambient"
          ? "ambient"
          : undefined,
  });
  const end = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight,
  );

  for (let step = 0; step <= 120; step += 1) {
    await page.evaluate(
      ({ progress, scrollEnd }) =>
        window.scrollTo({
          behavior: "auto",
          top: Math.round(scrollEnd * progress),
        }),
      { progress: step / 120, scrollEnd: end },
    );
    await page.waitForTimeout(35);
  }

  for (let step = 120; step >= 0; step -= 1) {
    await page.evaluate(
      ({ progress, scrollEnd }) =>
        window.scrollTo({
          behavior: "auto",
          top: Math.round(scrollEnd * progress),
        }),
      { progress: step / 120, scrollEnd: end },
    );
    await page.waitForTimeout(35);
  }

  const video = page.video();
  await context.close();
  const videoPath = await video.path();
  await rename(
    videoPath,
    path.join(outputDirectory, "14-forward-reverse.webm"),
  );
}

async function captureMetrics() {
  const context = await browser.newContext({
    colorScheme: "dark",
    viewport: { height: 1000, width: 1440 },
  });
  const page = await context.newPage();
  const messages = [];
  page.on("console", (message) => {
    if (["warning", "error"].includes(message.type())) {
      messages.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => messages.push(`pageerror: ${error.message}`));
  await page.goto(baseUrl, { waitUntil: "networkidle" });

  const dom = await page.getByTestId("helix-path").evaluate((element) => ({
    animatedElements: element.querySelectorAll(
      '[data-helix-ambient="animated"]',
    ).length,
    circles: element.querySelectorAll("circle").length,
    groups: element.querySelectorAll("g").length,
    lines: element.querySelectorAll("line").length,
    masks: element.querySelectorAll("mask").length,
    paths: element.querySelectorAll("path").length,
    svgDescendants: element.querySelectorAll("svg *").length,
  }));
  const resources = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .filter((entry) => entry.name.includes("/_next/") && entry.name.endsWith(".js"))
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

  await writeFile(
    path.join(outputDirectory, "15-metrics.json"),
    `${JSON.stringify(
      {
        consoleWarningsOrErrors: messages,
        decodedJavascriptBytes,
        javascriptChunks: uniqueResources.length,
        phase,
        productionRoute: "/",
        threeMatches,
        ...dom,
      },
      null,
      2,
    )}\n`,
  );
  await context.close();
}

try {
  if (!metricsOnly) {
    await capturePhase();
    await recordJourney();
  }
  await captureMetrics();
} finally {
  await browser.close();
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await app.close();
}
