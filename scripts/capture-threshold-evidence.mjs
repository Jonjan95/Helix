import { copyFile, mkdir, unlink } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import next from "next";
import { chromium } from "@playwright/test";

const mode = process.argv.includes("--after") ? "after" : "before";
const outputDirectory = path.join(
  process.cwd(),
  "docs",
  "media",
  "the-threshold",
  mode,
);
const port = 3300;
const baseUrl = `http://localhost:${port}`;

await mkdir(outputDirectory, { recursive: true });

const app = next({ dev: false, dir: process.cwd() });
await app.prepare();
const handler = app.getRequestHandler();
const server = createServer((request, response) => {
  void handler(request, response);
});
await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(port, resolve);
});

const browser = await chromium.launch();

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
  await page.waitForTimeout(700);
}

async function captureDesktopSequence() {
  const context = await browser.newContext({
    colorScheme: "dark",
    viewport: { height: 1000, width: 1440 },
  });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const distance = await thresholdDistance(page);
  const frames = [
    ["01-arrival-initial.png", 0],
    ["02-early-approach.png", 0.22],
    ["03-mid-transition.png", 0.5],
    ["04-screen-crossing.png", 0.78],
    ["05-workspace-resolved.png", 1],
  ];

  for (const [filename, progress] of frames) {
    await settleAt(page, progress, distance);
    await page.screenshot({ path: path.join(outputDirectory, filename) });
  }

  await settleAt(page, 0.5, distance);
  await page.screenshot({
    path: path.join(outputDirectory, "06-reverse-mid-transition.png"),
  });
  await settleAt(page, 0, distance);
  await page.screenshot({
    path: path.join(outputDirectory, "07-arrival-restored.png"),
  });
  await context.close();
}

async function recordDesktopSequence() {
  const context = await browser.newContext({
    colorScheme: "dark",
    recordVideo: {
      dir: outputDirectory,
      size: { height: 800, width: 1280 },
    },
    viewport: { height: 800, width: 1280 },
  });
  const page = await context.newPage();
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
    await page.waitForTimeout(42);
  }
  await page.waitForTimeout(400);
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
    await page.waitForTimeout(42);
  }
  await page.waitForTimeout(400);

  const video = page.video();
  await context.close();
  const temporaryVideo = await video.path();
  await copyFile(
    temporaryVideo,
    path.join(outputDirectory, "08-forward-reverse.webm"),
  );
  await unlink(temporaryVideo);
}

async function captureAfterReview() {
  const cases = [
    ["09-compact-threshold.png", { height: 768, width: 1024 }, 0.78],
    ["10-tablet-threshold.png", { height: 1024, width: 768 }, 0.78],
    ["11-mobile-static-flow.png", { height: 844, width: 390 }, 0],
    [
      "12-zoom-200-reflow.png",
      { height: 500, width: 720 },
      0.5,
      "reduce",
    ],
    [
      "13-zoom-400-reflow.png",
      { height: 250, width: 360 },
      0.5,
      "reduce",
    ],
  ];

  for (const [filename, viewport, progress, reducedMotion] of cases) {
    const context = await browser.newContext({
      colorScheme: "dark",
      reducedMotion: reducedMotion ?? "no-preference",
      viewport,
    });
    const page = await context.newPage();
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    const distance = await thresholdDistance(page);
    await settleAt(page, progress, distance);
    await page.screenshot({ path: path.join(outputDirectory, filename) });
    await context.close();
  }

  const reducedContext = await browser.newContext({
    colorScheme: "dark",
    reducedMotion: "reduce",
    viewport: { height: 1000, width: 1440 },
  });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(baseUrl, { waitUntil: "networkidle" });
  await reducedPage.screenshot({
    fullPage: true,
    path: path.join(outputDirectory, "14-reduced-motion-static-journey.png"),
  });
  await reducedContext.close();
}

try {
  await captureDesktopSequence();
  await recordDesktopSequence();
  if (mode === "after") {
    await captureAfterReview();
  }
} finally {
  await browser.close();
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await app.close();
}
