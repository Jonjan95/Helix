import { copyFile, mkdir, unlink, writeFile } from "node:fs/promises";
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
  throw new Error(`Unknown machine evidence phase: ${phase}`);
}

const outputDirectory = path.join(
  process.cwd(),
  "docs",
  "media",
  "the-machine",
  phase,
);
const port = 3127;
const baseUrl = `http://127.0.0.1:${port}`;
const consoleMessages = [];

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

function observeConsole(page) {
  page.on("console", (message) => {
    if (message.type() === "warning" || message.type() === "error") {
      consoleMessages.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    consoleMessages.push(`pageerror: ${error.message}`);
  });
}

async function thresholdDistance(page) {
  return page.locator('[data-chapter="arrival"]').evaluate((arrival) => {
    const spacer = arrival.parentElement;
    const padding = spacer
      ? Number.parseFloat(getComputedStyle(spacer).paddingBottom)
      : 0;

    return padding || window.innerHeight;
  });
}

async function settleAt(page, progress, distance) {
  await page.evaluate(
    ({ progress: nextProgress, distance: pinDistance }) => {
      window.scrollTo({
        behavior: "auto",
        top: Math.round(pinDistance * nextProgress),
      });
    },
    { distance, progress },
  );
  await page.waitForTimeout(650);
}

async function captureFrame(
  filename,
  {
    close = false,
    progress = 0,
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
  const page = await context.newPage();
  observeConsole(page);
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const distance = await thresholdDistance(page);

  if (setup) {
    await setup(page);
  }

  await settleAt(page, progress, distance);

  if (close) {
    await page.getByTestId("laptop-hero").screenshot({
      path: path.join(outputDirectory, filename),
    });
  } else {
    await page.screenshot({ path: path.join(outputDirectory, filename) });
  }

  await context.close();
}

const desktopFrames = [
  ["01-arrival-initial.png", { progress: 0 }],
  ["02-laptop-close.png", { close: true, progress: 0 }],
  ["03-early-approach.png", { progress: 0.25 }],
  ["04-threshold-crossing.png", { progress: 0.72 }],
  ["05-workspace-reveal.png", { progress: 1 }],
];

for (const [filename, options] of desktopFrames) {
  await captureFrame(filename, options);
}

await captureFrame("06-compact-desktop.png", {
  viewport: { height: 800, width: 1280 },
});
await captureFrame("07-tablet.png", {
  viewport: { height: 1024, width: 768 },
});
await captureFrame("08-mobile.png", {
  viewport: { height: 844, width: 390 },
});
await captureFrame("09-reduced-motion.png", {
  reducedMotion: "reduce",
});

if (phase === "after") {
  const minimalCandidate = async (page) => {
    await page.addStyleTag({
      content: `
        [data-machine-detail="keyboard"],
        [data-machine-detail="trackpad"],
        [data-machine-detail="deck-accent"] {
          display: none !important;
        }
      `,
    });
  };

  await captureFrame("10-candidate-minimal-precision.png", {
    setup: minimalCandidate,
  });
  await captureFrame("11-candidate-refined-workstation.png");

  const context = await browser.newContext({
    colorScheme: "dark",
    recordVideo: {
      dir: outputDirectory,
      size: { height: 800, width: 1280 },
    },
    viewport: { height: 800, width: 1280 },
  });
  const page = await context.newPage();
  observeConsole(page);
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const distance = await thresholdDistance(page);

  for (let step = 0; step <= 40; step += 1) {
    await page.evaluate(
      ({ pinDistance, progress }) => {
        window.scrollTo({
          behavior: "auto",
          top: Math.round(pinDistance * progress),
        });
      },
      { pinDistance: distance, progress: step / 40 },
    );
    await page.waitForTimeout(45);
  }
  await page.waitForTimeout(350);
  for (let step = 40; step >= 0; step -= 1) {
    await page.evaluate(
      ({ pinDistance, progress }) => {
        window.scrollTo({
          behavior: "auto",
          top: Math.round(pinDistance * progress),
        });
      },
      { pinDistance: distance, progress: step / 40 },
    );
    await page.waitForTimeout(45);
  }
  await page.waitForTimeout(350);

  const video = page.video();
  await context.close();
  const temporaryVideo = await video.path();
  await copyFile(
    temporaryVideo,
    path.join(outputDirectory, "12-forward-reverse.webm"),
  );
  await unlink(temporaryVideo);
}

const metricsContext = await browser.newContext({
  viewport: { height: 1000, width: 1440 },
});
const metricsPage = await metricsContext.newPage();
observeConsole(metricsPage);
await metricsPage.goto(baseUrl, { waitUntil: "networkidle" });
const metrics = await metricsPage.evaluate(() => ({
  decorativeFocusableCount: document.querySelectorAll(
    '[data-machine-detail] a, [data-machine-detail] button, [data-machine-detail] input, [data-machine-detail] [tabindex]:not([tabindex="-1"])',
  ).length,
  h1Count: document.querySelectorAll("h1").length,
  horizontalOverflow:
    document.documentElement.scrollWidth - document.documentElement.clientWidth,
  journeyMotionOwners: document.querySelectorAll(
    '[data-motion-root="helix-experience"]',
  ).length,
  screenIdentityPresent:
    document.querySelector('[data-motion="screen-identity"] h1')?.textContent ===
    "Jonathan Jansson",
  threeProductionAssets: performance
    .getEntriesByType("resource")
    .map((entry) => entry.name)
    .filter((name) => name.toLowerCase().includes("three")),
}));
await metricsContext.close();

await writeFile(
  path.join(outputDirectory, "13-metrics.json"),
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
