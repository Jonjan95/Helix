import { mkdir, rename, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import next from "next";
import { chromium } from "@playwright/test";

const outputDirectory = path.join(
  process.cwd(),
  "docs",
  "media",
  "arrival-integration",
  "renderer-handoff",
);
const port = 3204;
const baseUrl = `http://localhost:${port}`;
const formerJumpProgress = 0.69;

await mkdir(outputDirectory, { recursive: true });

const app = next({ dev: false, dir: process.cwd() });
await app.prepare();
const server = createServer((request, response) => {
  void app.getRequestHandler()(request, response);
});
await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(port, resolve);
});

const browser = await chromium.launch();

async function setArrivalProgress(page, target) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const current = Number(
      await page
        .locator("[data-arrival-progress]")
        .getAttribute("data-arrival-progress"),
    );
    const difference = target - current;

    if (Math.abs(difference) <= 0.0006) return;

    await page.evaluate((delta) => window.scrollBy(0, delta), difference * 830);
    await page.waitForTimeout(280);
  }
}

async function openProduction(context, query = "") {
  const page = await context.newPage();
  await page.goto(`${baseUrl}/${query}`, { waitUntil: "networkidle" });
  await page.locator("[data-arrival-runtime='ready']").waitFor({
    timeout: 15_000,
  });
  return page;
}

async function collectFrame(page) {
  return page.evaluate(() => {
    const root = document.querySelector("[data-arrival-progress]");
    const css = document.querySelector("[data-arrival-css-fallback]");
    const machine = document.querySelector("[data-production-machine]");
    const diagnostics = document.querySelector("[data-machine-html-layer]");
    const rootBounds = root?.getBoundingClientRect();

    const relativeBounds = (selector) => {
      const bounds = document.querySelector(selector)?.getBoundingClientRect();
      if (!bounds || !rootBounds) return null;

      return {
        centerX: bounds.left - rootBounds.left + bounds.width / 2,
        centerY: bounds.top - rootBounds.top + bounds.height / 2,
        height: bounds.height,
        width: bounds.width,
        x: bounds.left - rootBounds.left,
        y: bounds.top - rootBounds.top,
      };
    };

    return {
      activeOwner: root?.getAttribute("data-arrival-owner"),
      cameraPosition: diagnostics?.getAttribute("data-camera-position"),
      cameraTarget: diagnostics?.getAttribute("data-camera-target"),
      css: {
        baseBounds: relativeBounds("[data-motion='laptop-base']"),
        lidAngle: 0,
        machineBounds: relativeBounds("[data-motion='laptop']"),
        opacity: css ? Number(getComputedStyle(css).opacity) : null,
        perspective: "flat display; perspective(24rem) applies only to base",
        screenBounds: relativeBounds("[data-motion='laptop-screen']"),
      },
      machineProgress: root?.getAttribute("data-machine-progress"),
      normalizedProgress: root?.getAttribute("data-arrival-progress"),
      rootBounds: rootBounds
        ? { height: rootBounds.height, width: rootBounds.width }
        : null,
      webgl: {
        baseBounds: diagnostics?.getAttribute("data-base-projected-bounds"),
        lidAngle: diagnostics?.getAttribute("data-lid-angle"),
        machineBounds: diagnostics?.getAttribute("data-machine-projected-bounds"),
        opacity: machine ? Number(getComputedStyle(machine).opacity) : null,
        screenBounds: diagnostics?.getAttribute("data-screen-projected-bounds"),
        screenCenter: diagnostics?.getAttribute("data-screen-projected-center"),
      },
    };
  });
}

async function captureMode(filename, mode, progress = formerJumpProgress) {
  const context = await browser.newContext({
    colorScheme: "dark",
    viewport: { height: 1000, width: 1440 },
  });
  const query =
    mode === "current"
      ? "?arrivalDiagnostics=on"
      : `?arrivalDiagnostic=${mode}`;
  const page = await openProduction(context, query);
  await setArrivalProgress(page, progress);
  await page.waitForTimeout(350);
  const frame = await collectFrame(page);
  await page.screenshot({ path: path.join(outputDirectory, filename) });
  await context.close();
  return frame;
}

async function recordDirection(filename, direction) {
  const context = await browser.newContext({
    colorScheme: "dark",
    recordVideo: {
      dir: outputDirectory,
      size: { height: 720, width: 1280 },
    },
    viewport: { height: 720, width: 1280 },
  });
  const page = await openProduction(context, "?arrivalDiagnostics=on");
  await setArrivalProgress(page, direction === "forward" ? 0.58 : 0.76);

  for (let index = 0; index < 84; index += 1) {
    await page.mouse.wheel(0, direction === "forward" ? 2 : -2);
    await page.waitForTimeout(70);
  }
  await page.waitForTimeout(600);

  const video = page.video();
  await context.close();
  await rename(await video.path(), path.join(outputDirectory, filename));
}

function parseBounds(value) {
  if (!value) return null;
  const [x, y, width, height] = value.split(",").map(Number);
  return { centerX: x + width / 2, centerY: y + height / 2, height, width, x, y };
}

try {
  const css = await captureMode("01-current-css-only.png", "css");
  const webgl = await captureMode("02-current-webgl-only.png", "webgl");
  const combined = await captureMode("03-current-combined.png", "combined");
  const revisedBefore = await captureMode("04-revised-before.png", "current", 0.688);
  const revisedTransfer = await captureMode("05-revised-transfer.png", "current");
  const revisedAfter = await captureMode("06-revised-after.png", "current", 0.692);
  const frameAudit = [];

  for (const offset of [-0.002, -0.001, 0, 0.001, 0.002]) {
    frameAudit.push(
      await captureMode(
        `frame-${(formerJumpProgress + offset).toFixed(3)}.png`,
        "current",
        formerJumpProgress + offset,
      ),
    );
  }

  const cssScreen = css.css.screenBounds;
  const webglScreen = parseBounds(webgl.webgl.screenBounds);
  const cssMachine = css.css.machineBounds;
  const webglMachine = parseBounds(webgl.webgl.machineBounds);
  const cssBase = css.css.baseBounds;
  const webglBase = parseBounds(webgl.webgl.baseBounds);
  const differences = {
    baseCenterY: cssBase && webglBase
      ? Math.abs(cssBase.centerY - webglBase.centerY)
      : null,
    machineHeight: cssMachine && webglMachine
      ? Math.abs(cssMachine.height - webglMachine.height)
      : null,
    machineWidth: cssMachine && webglMachine
      ? Math.abs(cssMachine.width - webglMachine.width)
      : null,
    screenCenterX: cssScreen && webglScreen
      ? Math.abs(cssScreen.centerX - webglScreen.centerX)
      : null,
    screenCenterY: cssScreen && webglScreen
      ? Math.abs(cssScreen.centerY - webglScreen.centerY)
      : null,
    screenHeight: cssScreen && webglScreen
      ? Math.abs(cssScreen.height - webglScreen.height)
      : null,
    screenWidth: cssScreen && webglScreen
      ? Math.abs(cssScreen.width - webglScreen.width)
      : null,
  };

  await recordDirection("07-slow-forward.webm", "forward");
  await recordDirection("08-slow-reverse.webm", "reverse");
  await writeFile(
    path.join(outputDirectory, "09-frame-audit.json"),
    `${JSON.stringify(
      {
        combined,
        differencesInCssPixels: differences,
        formerJumpProgress,
        frameAudit,
        revisedAfter,
        revisedBefore,
        revisedTransfer,
      },
      null,
      2,
    )}\n`,
  );
} finally {
  await browser.close();
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await app.close();
}
