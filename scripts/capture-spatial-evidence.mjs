import { copyFile, mkdir, unlink } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import next from "next";
import { chromium } from "@playwright/test";

const outputDirectory = path.join(process.cwd(), "docs", "media", "spatial-design");
const port = 3200;
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

async function capture(filename, {
  mode = "Baseline",
  reducedMotion,
  search = "",
  setup,
  viewport = { width: 1440, height: 1000 },
} = {}) {
  const context = await browser.newContext({
    colorScheme: "dark",
    reducedMotion,
    viewport,
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/lab/spatial${search}`, { waitUntil: "networkidle" });
  if (mode !== "Baseline") {
    await page.getByRole("radio", { name: new RegExp(mode, "i") }).check();
  }
  if (setup) {
    await setup(page);
  }
  await page.waitForTimeout(250);
  await page.screenshot({
    path: path.join(outputDirectory, filename),
    fullPage: true,
  });
  await context.close();
}

async function record(filename, mode) {
  const context = await browser.newContext({
    colorScheme: "dark",
    recordVideo: {
      dir: outputDirectory,
      size: { width: 1280, height: 720 },
    },
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/lab/spatial`, { waitUntil: "networkidle" });
  await page.getByRole("radio", { name: new RegExp(mode, "i") }).check();
  if (mode === "Three.js") {
    await page.locator('[data-spatial-prototype="three"]').waitFor();
    await page.waitForTimeout(800);
  }
  await page.getByRole("button", { name: "Play forward" }).click();
  await page.waitForTimeout(1900);
  await page.getByRole("button", { name: "Reverse" }).click();
  await page.waitForTimeout(1900);
  const video = page.video();
  await context.close();
  const temporaryVideo = await video.path();
  await copyFile(temporaryVideo, path.join(outputDirectory, filename));
  await unlink(temporaryVideo);
}

try {
  await capture("01-desktop-baseline.png");
  await capture("02-desktop-css-forward.png", {
    mode: "CSS / GSAP",
    setup: async (page) => {
      await page.getByRole("button", { name: "Play forward" }).click();
      await page.waitForTimeout(900);
    },
  });
  await capture("03-desktop-svg-strong.png", {
    mode: "SVG depth",
    setup: (page) => page.getByRole("radio", { name: "strong" }).check(),
  });
  await capture("04-desktop-three-start.png", {
    mode: "Three.js",
    setup: (page) =>
      page.locator('[data-webgl-state="ready"], [data-webgl-state="fallback"]').waitFor(),
  });
  await capture("05-desktop-three-forward.png", {
    mode: "Three.js",
    setup: async (page) => {
      await page.locator('[data-webgl-state="ready"], [data-webgl-state="fallback"]').waitFor();
      if (await page.locator('[data-webgl-state="ready"]').count()) {
        await page.getByRole("button", { name: "Play forward" }).click();
        await page.waitForTimeout(1400);
      }
    },
  });
  await capture("06-mobile-svg.png", {
    mode: "SVG depth",
    viewport: { width: 390, height: 844 },
  });
  await capture("07-reduced-motion-three.png", {
    mode: "Three.js",
    reducedMotion: "reduce",
  });
  await capture("08-webgl-fallback.png", {
    mode: "Three.js",
    search: "?webgl=off",
  });
  await record("09-css-forward-reverse.webm", "CSS / GSAP");
  await record("10-three-forward-reverse.webm", "Three.js");
} finally {
  await browser.close();
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await app.close();
}
