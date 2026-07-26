import { copyFile, mkdir, readFile, unlink } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import next from "next";
import { chromium } from "@playwright/test";

const mode = process.argv.includes("--grid-review")
  ? "grid-alignment"
  : process.argv.includes("--correction-after")
    ? "correction-after"
  : process.argv.includes("--correction-before")
    ? "correction-before"
    : process.argv.includes("--after")
      ? "after"
      : "before";
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

async function captureCorrectionSequence() {
  const context = await browser.newContext({
    colorScheme: "dark",
    viewport: { height: 1000, width: 1440 },
  });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const distance = await thresholdDistance(page);
  const frames = [
    ["01-identity-initial.png", 0],
    ["02-identity-early-approach.png", distance * 0.22],
    ["03-identity-before-departure.png", distance * 0.5],
    ["04-mid-threshold-handoff.png", distance * 0.68],
    ["05-former-seam-location.png", distance + 150],
    ["06-first-resolved-workspace.png", distance + 320],
  ];

  for (const [filename, scrollPosition] of frames) {
    await page.evaluate(
      (top) => window.scrollTo({ behavior: "auto", top }),
      Math.round(scrollPosition),
    );
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(outputDirectory, filename) });
  }

  await page.evaluate(
    (top) => window.scrollTo({ behavior: "auto", top }),
    Math.round(distance + 80),
  );
  await page.waitForTimeout(700);
  await page.screenshot({
    path: path.join(outputDirectory, "07-reverse-crossing.png"),
  });
  await settleAt(page, 0, distance);
  await page.screenshot({
    path: path.join(outputDirectory, "08-arrival-restored.png"),
  });
  await context.close();
}

async function captureCorrectionResponsive() {
  const compactContext = await browser.newContext({
    colorScheme: "dark",
    viewport: { height: 768, width: 1024 },
  });
  const compactPage = await compactContext.newPage();
  await compactPage.goto(baseUrl, { waitUntil: "networkidle" });
  const compactDistance = await thresholdDistance(compactPage);
  await compactPage.evaluate(
    (top) => window.scrollTo({ behavior: "auto", top }),
    Math.round(compactDistance + 120),
  );
  await compactPage.waitForTimeout(700);
  await compactPage.screenshot({
    path: path.join(outputDirectory, "09-compact-former-seam-location.png"),
  });
  await compactContext.close();

  const reducedContext = await browser.newContext({
    colorScheme: "dark",
    reducedMotion: "reduce",
    viewport: { height: 1000, width: 1440 },
  });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(baseUrl, { waitUntil: "networkidle" });
  await reducedPage.screenshot({
    fullPage: true,
    path: path.join(outputDirectory, "10-reduced-motion.png"),
  });
  await reducedContext.close();
}

async function recordCorrectionSequence() {
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
  const end = distance + 280;

  for (let step = 0; step <= 50; step += 1) {
    await page.evaluate(
      ({ endPosition, progress }) => {
        window.scrollTo({
          behavior: "auto",
          top: Math.round(endPosition * progress),
        });
      },
      { endPosition: end, progress: step / 50 },
    );
    await page.waitForTimeout(42);
  }
  await page.waitForTimeout(400);
  for (let step = 50; step >= 0; step -= 1) {
    await page.evaluate(
      ({ endPosition, progress }) => {
        window.scrollTo({
          behavior: "auto",
          top: Math.round(endPosition * progress),
        });
      },
      { endPosition: end, progress: step / 50 },
    );
    await page.waitForTimeout(42);
  }
  await page.waitForTimeout(400);

  const video = page.video();
  await context.close();
  const temporaryVideo = await video.path();
  await copyFile(
    temporaryVideo,
    path.join(outputDirectory, "11-forward-reverse.webm"),
  );
  await unlink(temporaryVideo);
}

async function captureGridAlignmentReview() {
  await copyFile(
    path.join(
      process.cwd(),
      "docs",
      "media",
      "the-threshold",
      "correction-after",
      "05-former-seam-location.png",
    ),
    path.join(outputDirectory, "01-current-misaligned.png"),
  );

  const desktopContext = await browser.newContext({
    colorScheme: "dark",
    viewport: { height: 1000, width: 1440 },
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto(baseUrl, { waitUntil: "networkidle" });
  const desktopDistance = await thresholdDistance(desktopPage);

  await desktopPage.addStyleTag({
    content: `
      :root { --candidate-grid-size: 4rem; }
      [data-motion="screen-grid"] {
        background-size: var(--candidate-grid-size)
          var(--candidate-grid-size) !important;
        opacity: 1 !important;
      }
      [data-helix-journey]::before {
        background-color: #111719 !important;
        background-image:
          linear-gradient(rgb(105 211 231 / 0.055) 1px, transparent 1px),
          linear-gradient(90deg, rgb(105 211 231 / 0.055) 1px, transparent 1px)
          !important;
        background-position: 0 0 !important;
        background-size: var(--candidate-grid-size)
          var(--candidate-grid-size) !important;
      }
    `,
  });
  await desktopPage.evaluate(
    (top) => window.scrollTo({ behavior: "auto", top }),
    Math.round(desktopDistance + 150),
  );
  await desktopPage.waitForTimeout(700);
  await desktopPage.screenshot({
    path: path.join(outputDirectory, "02-synchronized-token-candidate.png"),
  });

  await desktopPage.reload({ waitUntil: "networkidle" });
  await desktopPage.evaluate(
    (top) => window.scrollTo({ behavior: "auto", top }),
    Math.round(desktopDistance + 150),
  );
  await desktopPage.waitForTimeout(700);
  await desktopPage.screenshot({
    path: path.join(outputDirectory, "03-fade-candidate.png"),
  });
  await settleAt(desktopPage, 0.78, desktopDistance);
  await desktopPage.screenshot({
    path: path.join(outputDirectory, "04-chosen-desktop-handoff.png"),
  });
  await desktopPage.evaluate(
    (top) => window.scrollTo({ behavior: "auto", top }),
    Math.round(desktopDistance + 150),
  );
  await desktopPage.waitForTimeout(700);
  await desktopPage.screenshot({
    path: path.join(outputDirectory, "06-pin-release.png"),
  });
  await desktopPage.evaluate(
    (top) => window.scrollTo({ behavior: "auto", top }),
    Math.round(desktopDistance + 80),
  );
  await desktopPage.waitForTimeout(700);
  await desktopPage.screenshot({
    path: path.join(outputDirectory, "07-reverse-crossing.png"),
  });
  await desktopContext.close();

  const compactContext = await browser.newContext({
    colorScheme: "dark",
    viewport: { height: 768, width: 1024 },
  });
  const compactPage = await compactContext.newPage();
  await compactPage.goto(baseUrl, { waitUntil: "networkidle" });
  const compactDistance = await thresholdDistance(compactPage);
  await compactPage.evaluate(
    (top) => window.scrollTo({ behavior: "auto", top }),
    Math.round(compactDistance + 120),
  );
  await compactPage.waitForTimeout(700);
  await compactPage.screenshot({
    path: path.join(outputDirectory, "05-chosen-compact-handoff.png"),
  });
  await compactContext.close();

  const mobileContext = await browser.newContext({
    colorScheme: "dark",
    viewport: { height: 844, width: 390 },
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(baseUrl, { waitUntil: "networkidle" });
  await mobilePage.screenshot({
    path: path.join(outputDirectory, "08-mobile-result.png"),
  });
  await mobileContext.close();

  const reducedContext = await browser.newContext({
    colorScheme: "dark",
    reducedMotion: "reduce",
    viewport: { height: 1000, width: 1440 },
  });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(baseUrl, { waitUntil: "networkidle" });
  await reducedPage.screenshot({
    fullPage: true,
    path: path.join(outputDirectory, "09-reduced-motion.png"),
  });
  await reducedContext.close();
}

async function recordGridAlignmentReview() {
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
  const end = distance + 280;

  for (let step = 0; step <= 50; step += 1) {
    await page.evaluate(
      ({ endPosition, progress }) =>
        window.scrollTo({
          behavior: "auto",
          top: Math.round(endPosition * progress),
        }),
      { endPosition: end, progress: step / 50 },
    );
    await page.waitForTimeout(42);
  }
  await page.waitForTimeout(350);
  for (let step = 50; step >= 0; step -= 1) {
    await page.evaluate(
      ({ endPosition, progress }) =>
        window.scrollTo({
          behavior: "auto",
          top: Math.round(endPosition * progress),
        }),
      { endPosition: end, progress: step / 50 },
    );
    await page.waitForTimeout(42);
  }
  await page.waitForTimeout(350);

  const video = page.video();
  await context.close();
  const temporaryVideo = await video.path();
  await copyFile(
    temporaryVideo,
    path.join(outputDirectory, "10-chosen-forward-reverse.webm"),
  );
  await unlink(temporaryVideo);
}

async function createSeamComparison() {
  const beforePath = path.join(
    process.cwd(),
    "docs",
    "media",
    "the-threshold",
    "correction-before",
    "05-former-seam-location.png",
  );
  const afterPath = path.join(
    outputDirectory,
    "05-former-seam-location.png",
  );
  const [before, after] = await Promise.all([
    readFile(beforePath),
    readFile(afterPath),
  ]);
  const context = await browser.newContext({
    colorScheme: "dark",
    viewport: { height: 540, width: 1440 },
  });
  const page = await context.newPage();
  await page.setContent(`
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: #121416;
        color: #f4f0e8;
        font: 12px Consolas, monospace;
      }
      main { display: grid; grid-template-columns: 1fr 1fr; }
      figure { position: relative; margin: 0; overflow: hidden; }
      img { display: block; width: 720px; height: 500px; object-fit: cover; }
      figcaption {
        position: absolute;
        top: 16px;
        left: 16px;
        padding: 6px 9px;
        background: rgb(18 20 22 / 0.88);
        letter-spacing: 0.12em;
      }
    </style>
    <main>
      <figure>
        <img alt="" src="data:image/png;base64,${before.toString("base64")}">
        <figcaption>BEFORE / CLIPPED RELEASE</figcaption>
      </figure>
      <figure>
        <img alt="" src="data:image/png;base64,${after.toString("base64")}">
        <figcaption>AFTER / CONTINUOUS THRESHOLD</figcaption>
      </figure>
    </main>
  `);
  await page.screenshot({
    path: path.join(outputDirectory, "12-seam-comparison.png"),
  });
  await context.close();
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
  if (mode === "grid-alignment") {
    await captureGridAlignmentReview();
    await recordGridAlignmentReview();
  } else if (mode.startsWith("correction-")) {
    await captureCorrectionSequence();
    await captureCorrectionResponsive();
    await recordCorrectionSequence();
    if (mode === "correction-after") {
      await createSeamComparison();
    }
  } else {
    await captureDesktopSequence();
    await recordDesktopSequence();
    if (mode === "after") {
      await captureAfterReview();
    }
  }
} finally {
  await browser.close();
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await app.close();
}
