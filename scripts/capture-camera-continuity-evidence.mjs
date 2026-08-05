import { copyFile, mkdir, unlink } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import next from "next";
import { chromium } from "@playwright/test";

const cameraDirectory = path.join(
  process.cwd(),
  "docs",
  "media",
  "arrival-integration",
  "physical-camera",
);
const outputDirectory = path.join(cameraDirectory, "continuity");
const port = 3203;
const baseUrl = `http://localhost:${port}`;

await mkdir(outputDirectory, { recursive: true });
await copyFile(
  path.join(cameraDirectory, "02-reframe.png"),
  path.join(outputDirectory, "01-before-discontinuity.png"),
);
await copyFile(
  path.join(cameraDirectory, "03-dolly-start.png"),
  path.join(outputDirectory, "02-discontinuity-frame.png"),
);

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

async function setProgress(page, value) {
  await page.getByRole("slider", { name: "Sequence progress" }).evaluate(
    (element, nextValue) => {
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )?.set;
      setter?.call(element, String(nextValue));
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));
    },
    value,
  );
  await page.waitForTimeout(180);
}

async function openLab(context, search = "") {
  const page = await context.newPage();
  await page.goto(`${baseUrl}/lab/machine${search}`, {
    waitUntil: "networkidle",
  });
  await page.locator('[data-model-state="ready"]').waitFor({ timeout: 15_000 });
  return page;
}

async function captureExact(filename, progress, search = "") {
  const context = await browser.newContext({
    colorScheme: "dark",
    viewport: { height: 1000, width: 1440 },
  });
  const page = await openLab(context, search);
  await setProgress(page, progress);
  await page.locator("[data-machine-stage]").screenshot({
    path: path.join(outputDirectory, filename),
  });
  await context.close();
}

async function captureDirection(filename, direction) {
  const context = await browser.newContext({
    colorScheme: "dark",
    viewport: { height: 1000, width: 1440 },
  });
  const page = await openLab(context);

  if (direction === "forward") {
    await page.getByRole("button", { name: "Play forward" }).click();
    await page.waitForTimeout(5650);
  } else {
    await setProgress(page, 1);
    await page.getByRole("button", { name: "Play reverse" }).click();
    await page.waitForTimeout(1050);
  }

  await page.locator("[data-machine-stage]").screenshot({
    path: path.join(outputDirectory, filename),
  });
  await context.close();
}

async function recordSlowScroll() {
  const context = await browser.newContext({
    colorScheme: "dark",
    recordVideo: {
      dir: outputDirectory,
      size: { height: 720, width: 1280 },
    },
    viewport: { height: 720, width: 1280 },
  });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.locator('[data-arrival-runtime="ready"]').waitFor({
    timeout: 15_000,
  });

  for (let index = 0; index < 78; index += 1) {
    await page.mouse.wheel(0, 14);
    await page.waitForTimeout(85);
  }
  await page.waitForTimeout(500);
  for (let index = 0; index < 78; index += 1) {
    await page.mouse.wheel(0, -14);
    await page.waitForTimeout(85);
  }
  await page.waitForTimeout(700);

  const video = page.video();
  await context.close();
  const temporaryVideo = await video.path();
  await copyFile(
    temporaryVideo,
    path.join(outputDirectory, "07-slow-forward-reverse.webm"),
  );
  await unlink(temporaryVideo);
}

try {
  await captureExact("03-after-fix.png", 0.91);
  await captureDirection("04-forward.png", "forward");
  await captureDirection("05-reverse.png", "reverse");
  await captureExact("06-debug-ownership.png", 0.94, "?cameraDebug=on");
  await recordSlowScroll();
} finally {
  await browser.close();
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await app.close();
}
