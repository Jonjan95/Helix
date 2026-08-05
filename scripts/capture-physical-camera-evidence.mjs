import { copyFile, mkdir, unlink } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import next from "next";
import { chromium } from "@playwright/test";

const outputDirectory = path.join(
  process.cwd(),
  "docs",
  "media",
  "arrival-integration",
  "physical-camera",
);
const port = 3202;
const baseUrl = `http://localhost:${port}`;

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

async function capture(filename, progress, search = "") {
  const context = await browser.newContext({
    colorScheme: "dark",
    viewport: { height: 1000, width: 1440 },
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/lab/machine${search}`, {
    waitUntil: "networkidle",
  });
  await page.locator('[data-model-state="ready"]').waitFor({ timeout: 15_000 });
  await setProgress(page, progress);
  await page.locator("[data-machine-stage]").screenshot({
    path: path.join(outputDirectory, filename),
  });
  await context.close();
}

async function captureReverse() {
  const context = await browser.newContext({
    colorScheme: "dark",
    viewport: { height: 1000, width: 1440 },
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/lab/machine`, { waitUntil: "networkidle" });
  await page.locator('[data-model-state="ready"]').waitFor({ timeout: 15_000 });
  await setProgress(page, 1);
  await page.getByRole("button", { name: "Play reverse" }).click();
  await page.waitForTimeout(950);
  await page.locator("[data-machine-stage]").screenshot({
    path: path.join(outputDirectory, "06-reverse.png"),
  });
  await context.close();
}

async function record() {
  const context = await browser.newContext({
    colorScheme: "dark",
    recordVideo: {
      dir: outputDirectory,
      size: { height: 720, width: 1280 },
    },
    viewport: { height: 720, width: 1280 },
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/lab/machine`, { waitUntil: "networkidle" });
  await page.locator('[data-model-state="ready"]').waitFor({ timeout: 15_000 });
  await page.locator("[data-machine-stage]").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Play forward" }).click();
  await page.waitForTimeout(7450);
  await page.getByRole("button", { name: "Play reverse" }).click();
  await page.waitForTimeout(7450);
  const video = page.video();
  await context.close();
  const temporaryVideo = await video.path();
  await copyFile(
    temporaryVideo,
    path.join(outputDirectory, "08-forward-reverse.webm"),
  );
  await unlink(temporaryVideo);
}

try {
  await capture("01-initial-framing.png", 0.84);
  await capture("02-reframe.png", 0.91);
  await capture("03-dolly-start.png", 0.96);
  await capture("04-dolly-midpoint.png", 0.98);
  await capture("05-dolly-end.png", 1);
  await captureReverse();
  await capture("07-debug-path.png", 0.91, "?cameraDebug=on");
  await record();
} finally {
  await browser.close();
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await app.close();
}
