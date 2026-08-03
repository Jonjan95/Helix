import { copyFile, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import next from "next";
import { chromium } from "@playwright/test";

const outputDirectory = path.join(process.cwd(), "docs", "media", "machine-lab");
const port = 3201;
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
  await page.locator("[data-machine-lab]").waitFor();
}

async function capture(
  filename,
  {
    fullPage = false,
    progress = 0,
    reducedMotion = "no-preference",
    search = "",
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
  await page.goto(`${baseUrl}/lab/machine${search}`, { waitUntil: "networkidle" });

  if (!search.includes("webgl=off")) {
    await page.locator('[data-model-state="ready"]').waitFor({ timeout: 15_000 });
    if (reducedMotion !== "reduce") await setProgress(page, progress);
  }

  if (setup) await setup(page);
  await page.waitForTimeout(180);

  if (fullPage) {
    await page.screenshot({ path: path.join(outputDirectory, filename), fullPage: true });
  } else {
    await page.locator("[data-machine-stage]").screenshot({
      path: path.join(outputDirectory, filename),
    });
  }
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
  await page.waitForTimeout(4400);
  await page.getByRole("button", { name: "Play reverse" }).click();
  await page.waitForTimeout(4400);
  const video = page.video();
  await context.close();
  const temporaryVideo = await video.path();
  await copyFile(
    temporaryVideo,
    path.join(outputDirectory, "13-forward-reverse.webm"),
  );
  await unlink(temporaryVideo);
}

async function measureRoute(route) {
  const context = await browser.newContext({
    deviceScaleFactor: 2,
    viewport: { height: 1000, width: 1440 },
  });
  const page = await context.newPage();
  const javascript = new Map();
  const requests = [];
  const consoleProblems = [];

  page.on("request", (request) => requests.push(request.url()));
  page.on("console", (message) => {
    if (message.type() === "warning" || message.type() === "error") {
      consoleProblems.push(message.text());
    }
  });
  page.on("response", async (response) => {
    const url = response.url();
    if (!url.includes("/_next/static/") || !url.endsWith(".js")) return;
    try {
      javascript.set(url, await response.body());
    } catch {
      // A navigation may close a response before its body is available.
    }
  });

  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  if (route === "/lab/machine") {
    await page.locator('[data-model-state="ready"]').waitFor({ timeout: 15_000 });
  }
  const root = page.locator("[data-machine-lab]");
  const canvasRatio = await page.locator("canvas").count()
    ? await page.locator("canvas").evaluate((element) => ({
        horizontal: element.width / element.clientWidth,
        vertical: element.height / element.clientHeight,
      }))
    : null;
  const result = {
    canvasRatio,
    consoleProblems,
    javascript: Object.fromEntries(
      [...javascript].map(([url, body]) => [url, body.byteLength]),
    ),
    modelObjects: route === "/lab/machine"
      ? Number(await root.getAttribute("data-model-objects"))
      : null,
    modelRequests: requests.filter((url) => url.includes("helix-machine.glb")),
    modelTriangles: route === "/lab/machine"
      ? Number(await root.getAttribute("data-model-triangles"))
      : null,
    requests,
    threeChunks: [...javascript]
      .filter(([, body]) => body.toString().includes("WebGLRenderer"))
      .map(([url, body]) => ({ bytes: body.byteLength, url })),
  };
  await context.close();
  return result;
}

try {
  await capture("01-closed.png");
  await capture("02-opening-midpoint.png", { progress: 0.35 });
  await capture("03-fully-open.png", { progress: 0.5 });
  await capture("04-screen-activation.png", { progress: 0.56 });
  await capture("05-identity-visible.png", { progress: 0.67 });
  await capture("06-camera-approach.png", { progress: 0.88 });
  await capture("07-reverse-midpoint.png", { progress: 0.36 });
  await capture("08-reset.png", { progress: 0 });
  await capture("09-tablet.png", {
    fullPage: true,
    progress: 0.67,
    viewport: { height: 1024, width: 768 },
  });
  await capture("10-mobile.png", {
    fullPage: true,
    progress: 0.67,
    viewport: { height: 844, width: 390 },
  });
  await capture("11-reduced-motion.png", {
    fullPage: true,
    reducedMotion: "reduce",
  });
  await capture("12-webgl-fallback.png", {
    fullPage: true,
    search: "?webgl=off",
  });
  await record();

  const [production, lab] = await Promise.all([
    measureRoute("/"),
    measureRoute("/lab/machine"),
  ]);
  const productionUrls = new Set(Object.keys(production.javascript));
  const labOnlyJavascript = Object.fromEntries(
    Object.entries(lab.javascript).filter(([url]) => !productionUrls.has(url)),
  );
  const rawModel = await readFile(path.join(process.cwd(), "public", "models", "helix-machine.glb"));
  const metrics = {
    emittedJavascriptBytes: {
      labOnly: Object.values(labOnlyJavascript).reduce((sum, bytes) => sum + bytes, 0),
      labRouteTotal: Object.values(lab.javascript).reduce((sum, bytes) => sum + bytes, 0),
      productionRouteTotal: Object.values(production.javascript).reduce(
        (sum, bytes) => sum + bytes,
        0,
      ),
      threeContainingLabChunks: lab.threeChunks.reduce(
        (sum, chunk) => sum + chunk.bytes,
        0,
      ),
    },
    lab: { ...lab, javascript: lab.javascript, requests: undefined },
    labOnlyJavascript,
    modelBytes: rawModel.byteLength,
    production: {
      ...production,
      javascript: production.javascript,
      requests: undefined,
    },
  };
  await writeFile(
    path.join(outputDirectory, "metrics.json"),
    `${JSON.stringify(metrics, null, 2)}\n`,
  );
} finally {
  await browser.close();
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await app.close();
}
