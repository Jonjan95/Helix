import { mkdir, rename, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import next from "next";
import { chromium } from "@playwright/test";

const phases = new Set(["baseline", "static", "focus", "threshold", "chosen"]);
const phaseArgument = process.argv.find((argument) =>
  argument.startsWith("--phase="),
);
const phase = phaseArgument?.split("=")[1] ?? "baseline";

if (!phases.has(phase)) {
  throw new Error(`Unknown depth-atmosphere evidence phase: ${phase}`);
}

const outputDirectory = path.join(
  process.cwd(),
  "docs",
  "media",
  "depth-atmosphere",
  phase,
);
const port = 3113;
const baseUrl = `http://127.0.0.1:${port}`;

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

async function preparePage(
  context,
  {
    atmosphereMode,
    pathName = "/",
    setup,
  } = {},
) {
  const page = await context.newPage();
  await page.goto(`${baseUrl}${pathName}`, { waitUntil: "networkidle" });

  if (atmosphereMode) {
    await page.getByTestId("helix-journey").evaluate((element, mode) => {
      element.dataset.atmosphereMode = mode;
    }, atmosphereMode);
  }

  if (setup) {
    await setup(page);
  }

  await page.waitForTimeout(450);
  return page;
}

async function capture(
  filename,
  {
    atmosphereMode,
    forcedColors,
    pathName,
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
  const page = await preparePage(context, {
    atmosphereMode,
    pathName,
    setup,
  });
  if (forcedColors) {
    await page.emulateMedia({ forcedColors });
    await page.waitForTimeout(200);
  }
  await page.screenshot({
    path: path.join(outputDirectory, filename),
  });
  await context.close();
}

const centerChapter = (chapter) => async (page) => {
  await page.getByTestId(`journey-chapter-${chapter}`).evaluate((element) => {
    element.scrollIntoView({ behavior: "auto", block: "center" });
  });
};

const centerContinuation = async (page) => {
  await page.getByTestId("journey-continuation").evaluate((element) => {
    element.scrollIntoView({ behavior: "auto", block: "center" });
  });
};

const pinProgress = (progress) => async (page) => {
  const spacer = page.locator(".pin-spacer");
  if ((await spacer.count()) === 1) {
    const distance = await spacer.evaluate(
      (element) => element.getBoundingClientRect().height - window.innerHeight,
    );
    await page.evaluate(
      ({ distance: pinDistance, progress: targetProgress }) =>
        window.scrollTo({
          behavior: "auto",
          top: Math.max(0, pinDistance * targetProgress),
        }),
      { distance, progress },
    );
  }
};

function phaseMode() {
  if (phase === "static") return "static";
  if (phase === "focus") return "focus";
  if (phase === "threshold") return "threshold";
  return undefined;
}

async function captureBaselineOrChosen() {
  const atmosphereMode = phaseMode();
  const frames = [
    ["01-arrival-threshold.png", "/", pinProgress(0.72)],
    ["02-environment.png", "/#about", centerChapter("environment")],
    ["03-engineering.png", "/#skills", centerChapter("engineering")],
    ["04-projects.png", "/#projects", centerChapter("projects")],
    ["05-experience.png", "/#experience", centerChapter("experience")],
    ["06-continue.png", "/#contact", centerChapter("contact")],
    ["07-final-ending.png", "/#contact", centerContinuation],
  ];

  for (const [filename, pathName, setup] of frames) {
    await capture(filename, { atmosphereMode, pathName, setup });
  }

  await capture("08-compact-desktop.png", {
    atmosphereMode,
    pathName: "/#projects",
    setup: centerChapter("projects"),
    viewport: { height: 800, width: 1280 },
  });
  await capture("09-tablet.png", {
    atmosphereMode,
    pathName: "/#experience",
    setup: centerChapter("experience"),
    viewport: { height: 1024, width: 768 },
  });
  await capture("10-mobile.png", {
    atmosphereMode,
    pathName: "/#projects",
    setup: centerChapter("projects"),
    viewport: { height: 844, width: 390 },
  });
  await capture("11-reduced-motion.png", {
    atmosphereMode,
    pathName: "/#experience",
    reducedMotion: "reduce",
    setup: centerChapter("experience"),
  });
  await capture("12-forced-colors.png", {
    atmosphereMode,
    forcedColors: "active",
    pathName: "/#projects",
    setup: centerChapter("projects"),
  });
}

async function captureCandidate() {
  const atmosphereMode = phaseMode();
  if (phase === "static") {
    await capture("01-arrival-workspace.png", {
      atmosphereMode,
      setup: pinProgress(0.88),
    });
    await capture("02-projects.png", {
      atmosphereMode,
      pathName: "/#projects",
      setup: centerChapter("projects"),
    });
    await capture("03-experience.png", {
      atmosphereMode,
      pathName: "/#experience",
      setup: centerChapter("experience"),
    });
    await capture("04-continue.png", {
      atmosphereMode,
      pathName: "/#contact",
      setup: centerChapter("contact"),
    });
    await capture("05-compact-desktop.png", {
      atmosphereMode,
      pathName: "/#projects",
      setup: centerChapter("projects"),
      viewport: { height: 800, width: 1280 },
    });
    await capture("06-mobile.png", {
      atmosphereMode,
      pathName: "/#projects",
      setup: centerChapter("projects"),
      viewport: { height: 844, width: 390 },
    });
  }

  if (phase === "focus") {
    const stateFrame = async (state) => async (page) => {
      await centerChapter("projects")(page);
      await page.getByTestId("journey-chapter-projects").evaluate(
        (element, chapterState) => {
          element.dataset.journeyState = chapterState;
        },
        state,
      );
    };
    await capture("01-approaching.png", {
      atmosphereMode,
      pathName: "/#projects",
      setup: await stateFrame("approaching"),
    });
    await capture("02-active.png", {
      atmosphereMode,
      pathName: "/#projects",
      setup: await stateFrame("active"),
    });
    await capture("03-passed.png", {
      atmosphereMode,
      pathName: "/#projects",
      setup: await stateFrame("passed"),
    });
    await capture("04-reverse.png", {
      atmosphereMode,
      pathName: "/#projects",
      setup: await stateFrame("departing"),
    });
    await capture("05-reduced-motion.png", {
      atmosphereMode,
      pathName: "/#projects",
      reducedMotion: "reduce",
      setup: await stateFrame("active"),
    });
  }

  if (phase === "threshold") {
    await capture("01-screen-crossing.png", {
      atmosphereMode,
      setup: pinProgress(0.78),
    });
    await capture("02-early-workspace.png", {
      atmosphereMode,
      setup: pinProgress(0.96),
    });
    await capture("03-environment-resolved.png", {
      atmosphereMode,
      pathName: "/#about",
      setup: centerChapter("environment"),
    });
  }
}

async function recordJourney() {
  const videoDirectory = path.join(outputDirectory, ".video");
  await mkdir(videoDirectory, { recursive: true });
  const context = await browser.newContext({
    colorScheme: "dark",
    recordVideo: {
      dir: videoDirectory,
      size: { height: 720, width: 1280 },
    },
    viewport: { height: 720, width: 1280 },
  });
  const page = await preparePage(context, {
    atmosphereMode: phaseMode(),
  });
  const chapters = [
    "environment",
    "engineering",
    "projects",
    "experience",
    "contact",
  ];
  for (const chapter of chapters) {
    await page
      .getByTestId(`journey-chapter-${chapter}`)
      .evaluate((element) =>
        element.scrollIntoView({ behavior: "smooth", block: "center" }),
      );
    await page.waitForTimeout(900);
  }
  for (const chapter of [...chapters].reverse()) {
    await page
      .getByTestId(`journey-chapter-${chapter}`)
      .evaluate((element) =>
        element.scrollIntoView({ behavior: "smooth", block: "center" }),
      );
    await page.waitForTimeout(900);
  }
  const video = page.video();
  await context.close();
  if (video) {
    await rename(
      await video.path(),
      path.join(outputDirectory, "13-forward-reverse.webm"),
    );
  }
}

async function captureMetrics() {
  const context = await browser.newContext({
    colorScheme: "dark",
    viewport: { height: 1000, width: 1440 },
  });
  const page = await preparePage(context, {
    atmosphereMode: phaseMode(),
  });
  const messages = [];
  page.on("console", (message) => {
    if (["warning", "error"].includes(message.type())) {
      messages.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => messages.push(`pageerror: ${error.message}`));
  await page.reload({ waitUntil: "networkidle" });

  const resources = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .filter((entry) => entry.name.includes("/_next/"))
      .map((entry) => entry.name),
  );
  const javascript = [...new Set(resources.filter((name) => name.endsWith(".js")))];
  const stylesheets = [
    ...new Set(resources.filter((name) => name.endsWith(".css"))),
  ];
  let decodedJavascriptBytes = 0;
  let decodedCssBytes = 0;
  let threeMatches = 0;
  for (const resource of javascript) {
    const source = await (await fetch(resource)).text();
    decodedJavascriptBytes += Buffer.byteLength(source);
    if (/WebGLRenderer|three\.module|REVISION\s*=/.test(source)) {
      threeMatches += 1;
    }
  }
  for (const resource of stylesheets) {
    decodedCssBytes += Buffer.byteLength(await (await fetch(resource)).text());
  }

  const dom = await page.evaluate(() => ({
    atmosphereElements: document.querySelectorAll("[data-atmosphere-surface]")
      .length,
    focusableAtmosphereElements: document.querySelectorAll(
      "[data-atmosphere-surface] a, [data-atmosphere-surface] button, [data-atmosphere-surface] [tabindex]:not([tabindex='-1'])",
    ).length,
    journeyMotionOwners: document.querySelectorAll(
      '[data-motion-root="helix-experience"]',
    ).length,
  }));
  await writeFile(
    path.join(outputDirectory, "14-metrics.json"),
    `${JSON.stringify(
      {
        consoleWarningsOrErrors: messages,
        decodedCssBytes,
        decodedJavascriptBytes,
        javascriptChunks: javascript.length,
        phase,
        productionRoute: "/",
        stylesheetChunks: stylesheets.length,
        threeMatches,
        ...dom,
      },
      null,
      2,
    )}\n`,
  );
  await context.close();
}

try {
  if (phase === "baseline" || phase === "chosen") {
    await captureBaselineOrChosen();
    await recordJourney();
  } else {
    await captureCandidate();
  }
  await captureMetrics();
} finally {
  await browser.close();
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await app.close();
}
