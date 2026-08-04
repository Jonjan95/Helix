import { copyFile, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import next from "next";
import { chromium } from "@playwright/test";

const outputDirectory = path.join(process.cwd(), "docs", "media", "machine-lab");
const revisionDirectory = path.join(outputDirectory, "revision-after");
const identityDirectory = path.join(outputDirectory, "identity-revision");
const arrivalDirectory = path.join(outputDirectory, "arrival-direction");
const cinematicDirectory = path.join(arrivalDirectory, "candidate-a");
const editorialDirectory = path.join(arrivalDirectory, "candidate-b");
const port = 3201;
const baseUrl = `http://localhost:${port}`;

await mkdir(outputDirectory, { recursive: true });
await mkdir(revisionDirectory, { recursive: true });
await mkdir(identityDirectory, { recursive: true });
await mkdir(cinematicDirectory, { recursive: true });
await mkdir(editorialDirectory, { recursive: true });

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
    output = revisionDirectory,
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
    await page.screenshot({ path: path.join(output, filename), fullPage: true });
  } else {
    await page.locator("[data-machine-stage]").screenshot({
      path: path.join(output, filename),
    });
  }
  await context.close();
}

async function record({ directory, duration, search = "" }) {
  const context = await browser.newContext({
    colorScheme: "dark",
    recordVideo: {
      dir: directory,
      size: { height: 720, width: 1280 },
    },
    viewport: { height: 720, width: 1280 },
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/lab/machine${search}`, { waitUntil: "networkidle" });
  await page.locator('[data-model-state="ready"]').waitFor({ timeout: 15_000 });
  await page.locator("[data-machine-stage]").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Play forward" }).click();
  await page.waitForTimeout(duration + 250);
  await page.getByRole("button", { name: "Play reverse" }).click();
  await page.waitForTimeout(duration + 250);
  const video = page.video();
  await context.close();
  const temporaryVideo = await video.path();
  await copyFile(
    temporaryVideo,
    path.join(directory, "15-forward-reverse.webm"),
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
  const candidates = [
    {
      directory: cinematicDirectory,
      duration: 7200,
      progress: {
        established: 0.16,
        identity: 0.76,
        hold: 0.84,
        lidOpen: 0.5,
        opening: 0.34,
        reframe: 0.9,
        screen: 0.6,
        screenSettled: 0.69,
        dolly: 0.98,
      },
      reverseWait: 2600,
      search: "",
    },
    {
      directory: editorialDirectory,
      duration: 5000,
      progress: {
        established: 0.11,
        identity: 0.65,
        hold: 0.72,
        lidOpen: 0.42,
        opening: 0.27,
        reframe: 0.81,
        screen: 0.51,
        screenSettled: 0.59,
        dolly: 0.94,
      },
      reverseWait: 1800,
      search: "?sequence=editorial",
    },
  ];

  for (const candidate of candidates) {
    const shared = { output: candidate.directory, search: candidate.search };
    await capture("01-darkness-initial-reveal.png", {
      ...shared,
      progress: 0.04,
    });
    await capture("02-machine-established.png", {
      ...shared,
      progress: candidate.progress.established,
    });
    await capture("03-lid-opening.png", {
      ...shared,
      progress: candidate.progress.opening,
    });
    await capture("04-fully-open.png", {
      ...shared,
      progress: candidate.progress.lidOpen,
    });
    await capture("05-screen-activation.png", {
      ...shared,
      progress: candidate.progress.screen,
    });
    await capture("06-screen-settled.png", {
      ...shared,
      progress: candidate.progress.screenSettled,
    });
    await capture("07-identity-visible.png", {
      ...shared,
      progress: candidate.progress.identity,
    });
    await capture("08-identity-hold.png", {
      ...shared,
      progress: candidate.progress.hold,
    });
    await capture("09-camera-reframe.png", {
      ...shared,
      progress: candidate.progress.reframe,
    });
    await capture("10-camera-dolly.png", {
      ...shared,
      progress: candidate.progress.dolly,
    });
    await capture("11-reverse-midpoint.png", {
      ...shared,
      progress: 1,
      setup: async (page) => {
        await page.getByRole("button", { name: "Play reverse" }).click();
        await page.waitForTimeout(candidate.reverseWait);
      },
    });
    await capture("12-reset.png", { ...shared, progress: 0 });
    await capture("13-mobile.png", {
      ...shared,
      fullPage: true,
      progress: candidate.progress.hold,
      viewport: { height: 844, width: 390 },
    });
    await capture("14-reduced-motion.png", {
      ...shared,
      fullPage: true,
      reducedMotion: "reduce",
    });
    await capture("16-compact-desktop.png", {
      ...shared,
      fullPage: true,
      progress: candidate.progress.hold,
      viewport: { height: 800, width: 1280 },
    });
    await capture("17-laptop.png", {
      ...shared,
      fullPage: true,
      progress: candidate.progress.hold,
      viewport: { height: 768, width: 1024 },
    });
    await capture("18-tablet.png", {
      ...shared,
      fullPage: true,
      progress: candidate.progress.hold,
      viewport: { height: 1024, width: 768 },
    });
    await capture("19-narrow-mobile.png", {
      ...shared,
      fullPage: true,
      progress: candidate.progress.hold,
      viewport: { height: 800, width: 360 },
    });
    await record({
      directory: candidate.directory,
      duration: candidate.duration,
      search: candidate.search,
    });
  }

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
