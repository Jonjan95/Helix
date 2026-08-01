import { copyFile, mkdir, unlink, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import next from "next";
import { chromium } from "@playwright/test";

const outputDirectory = path.join(
  process.cwd(),
  "docs",
  "media",
  "the-machine",
  "after",
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
    progress = 0,
    reducedMotion = "no-preference",
    reverseFrom,
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

  if (reverseFrom !== undefined) {
    await settleAt(page, reverseFrom, distance);
  }
  await settleAt(page, progress, distance);
  await page.screenshot({ path: path.join(outputDirectory, filename) });
  await context.close();
}

const requestedFrames = [
  ["02-closed-state.png", { progress: 0 }],
  ["03-opening-midpoint.png", { progress: 0.09 }],
  ["04-fully-open-state.png", { progress: 0.2 }],
  ["05-screen-activation.png", { progress: 0.32 }],
  ["06-approach.png", { progress: 0.48 }],
  ["07-threshold-crossing.png", { progress: 0.72 }],
  ["08-reverse-closing.png", { progress: 0.08, reverseFrom: 0.72 }],
  [
    "09-compact-desktop.png",
    { progress: 0.32, viewport: { height: 800, width: 1280 } },
  ],
  [
    "10-tablet.png",
    { progress: 0.32, viewport: { height: 1024, width: 768 } },
  ],
  ["11-mobile.png", { viewport: { height: 844, width: 390 } }],
  ["12-reduced-motion.png", { reducedMotion: "reduce" }],
];

for (const [filename, options] of requestedFrames) {
  await captureFrame(filename, options);
}

const videoContext = await browser.newContext({
  colorScheme: "dark",
  recordVideo: {
    dir: outputDirectory,
    size: { height: 800, width: 1280 },
  },
  viewport: { height: 800, width: 1280 },
});
const videoPage = await videoContext.newPage();
observeConsole(videoPage);
await videoPage.goto(baseUrl, { waitUntil: "networkidle" });
const videoDistance = await thresholdDistance(videoPage);

for (let step = 0; step <= 48; step += 1) {
  await videoPage.evaluate(
    ({ distance, progress }) =>
      window.scrollTo({ top: distance * progress, behavior: "auto" }),
    { distance: videoDistance, progress: step / 48 },
  );
  await videoPage.waitForTimeout(45);
}
await videoPage.waitForTimeout(300);
for (let step = 48; step >= 0; step -= 1) {
  await videoPage.evaluate(
    ({ distance, progress }) =>
      window.scrollTo({ top: distance * progress, behavior: "auto" }),
    { distance: videoDistance, progress: step / 48 },
  );
  await videoPage.waitForTimeout(45);
}
await videoPage.waitForTimeout(300);

const video = videoPage.video();
await videoContext.close();
const temporaryVideo = await video.path();
await copyFile(
  temporaryVideo,
  path.join(outputDirectory, "13-forward-reverse.webm"),
);
await unlink(temporaryVideo);

const metricsContext = await browser.newContext({
  viewport: { height: 1000, width: 1440 },
});
const metricsPage = await metricsContext.newPage();
observeConsole(metricsPage);
await metricsPage.goto(baseUrl, { waitUntil: "networkidle" });
const metricsDistance = await thresholdDistance(metricsPage);
const closedTransform = await metricsPage
  .locator('[data-motion="laptop-lid"]')
  .evaluate((element) => getComputedStyle(element).transform);
await settleAt(metricsPage, 0.32, metricsDistance);
const openTransform = await metricsPage
  .locator('[data-motion="laptop-lid"]')
  .evaluate((element) => getComputedStyle(element).transform);
await settleAt(metricsPage, 0, metricsDistance);
const restoredTransform = await metricsPage
  .locator('[data-motion="laptop-lid"]')
  .evaluate((element) => getComputedStyle(element).transform);
const metrics = await metricsPage.evaluate(() => {
  const machineScene = document.querySelector('[data-motion="machine-scene"]');
  const lid = document.querySelector('[data-motion="laptop-lid"]');
  const base = document.querySelector('[data-motion="laptop-base"]');
  const screen = document.querySelector('[data-motion="laptop-screen"]');

  return {
    baseAndLidShareScene:
      machineScene?.contains(lid) === true &&
      machineScene?.contains(base) === true,
    decorativeFocusableCount: document.querySelectorAll(
      '[data-machine-detail] a, [data-machine-detail] button, [data-machine-detail] input, [data-machine-detail] [tabindex]:not([tabindex="-1"])',
    ).length,
    desktopPinCount: document.querySelectorAll(".pin-spacer").length,
    h1Count: document.querySelectorAll("h1").length,
    horizontalOverflow:
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
    journeyMotionOwners: document.querySelectorAll(
      '[data-motion-root="helix-experience"]',
    ).length,
    screenIdentityPresent:
      document.querySelector('[data-motion="screen-identity"] h1')?.textContent ===
      "Jonathan Jansson",
    screenIdentityTransform: getComputedStyle(
      document.querySelector('[data-motion="screen-identity"]'),
    ).transform,
    screenOutsideMechanicalScene: machineScene?.contains(screen) === false,
    threeProductionAssets: performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((name) => name.toLowerCase().includes("three")),
  };
});
await metricsContext.close();

async function staticModeMetrics(viewport, reducedMotion) {
  const context = await browser.newContext({ viewport, reducedMotion });
  const page = await context.newPage();
  observeConsole(page);
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const result = await page.evaluate(() => ({
    h1Visible:
      Number.parseFloat(
        getComputedStyle(
          document.querySelector('[data-motion="screen-identity"]'),
        ).opacity,
      ) > 0.99,
    horizontalOverflow:
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
    pinCount: document.querySelectorAll(".pin-spacer").length,
  }));
  await context.close();
  return result;
}

const mobile = await staticModeMetrics({ height: 844, width: 390 }, "no-preference");
const reduced = await staticModeMetrics({ height: 1000, width: 1440 }, "reduce");

await writeFile(
  path.join(outputDirectory, "14-metrics.json"),
  `${JSON.stringify(
    {
      ...metrics,
      closedStateRestored: closedTransform === restoredTransform,
      consoleWarningsOrErrors: [...new Set(consoleMessages)],
      lidOpened: closedTransform !== openTransform,
      mobile,
      reduced,
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
