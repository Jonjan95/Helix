import { copyFile, mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import next from "next";
import { chromium } from "@playwright/test";

const outputDirectory = path.join(
  process.cwd(),
  "docs",
  "media",
  "production-readiness",
);
const port = 3100;
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

async function capture(
  filename,
  {
    fullPage = false,
    media,
    pathName = "/",
    setup,
    viewport = { height: 1000, width: 1440 },
  } = {},
) {
  const context = await browser.newContext({
    colorScheme: "dark",
    reducedMotion: media?.reducedMotion,
    viewport,
  });
  const page = await context.newPage();

  if (media?.forcedColors) {
    await page.emulateMedia({ forcedColors: media.forcedColors });
  }

  await page.goto(`${baseUrl}${pathName}`, { waitUntil: "networkidle" });
  if (setup) {
    await setup(page);
  }
  await page.waitForTimeout(250);
  await page.screenshot({
    fullPage,
    path: path.join(outputDirectory, filename),
  });
  await context.close();
}

const center = (testId) => async (page) => {
  await page.getByTestId(testId).evaluate((element) => {
    element.scrollIntoView({ behavior: "auto", block: "center" });
  });
};

try {
  await capture("01-desktop-arrival.png");
  await capture("02-desktop-environment.png", {
    pathName: "/#about",
  });
  await capture("03-desktop-projects.png", {
    pathName: "/#projects",
  });
  await capture("04-desktop-experience.png", {
    pathName: "/#experience",
  });
  await capture("05-desktop-continue.png", {
    pathName: "/#contact",
  });
  await capture("06-desktop-path-ending.png", {
    setup: async (page) => {
      await page.evaluate(() =>
        window.scrollTo({
          behavior: "auto",
          top: document.documentElement.scrollHeight,
        }),
      );
    },
  });
  await capture("07-default-not-found.png", {
    pathName: "/release-audit-not-found",
  });

  const mobile = { height: 844, width: 390 };
  await capture("08-mobile-arrival.png", { viewport: mobile });
  await capture("09-mobile-projects.png", {
    setup: center("journey-chapter-projects"),
    viewport: mobile,
  });
  await capture("10-mobile-continue-ending.png", {
    setup: center("journey-continuation"),
    viewport: mobile,
  });

  await capture("11-keyboard-skip-focus.png", {
    setup: async (page) => {
      await page.keyboard.press("Tab");
    },
  });
  await capture("12-keyboard-project-focus.png", {
    pathName: "/#projects",
    setup: async (page) => {
      const link = page.getByRole("link", {
        name: "View source on GitHub for AI-Powered Test Engineer",
      });
      await link.focus();
    },
  });
  await capture("13-keyboard-contact-focus.png", {
    pathName: "/#contact",
    setup: async (page) => {
      await page.getByRole("link", { name: /Explore GitHub/ }).focus();
    },
  });
  await capture("14-zoom-200-reflow-equivalent.png", {
    media: { reducedMotion: "reduce" },
    setup: center("journey-chapter-projects"),
    viewport: { height: 500, width: 720 },
  });
  await capture("15-zoom-400-reflow-equivalent.png", {
    media: { reducedMotion: "reduce" },
    setup: center("journey-chapter-experience"),
    viewport: { height: 250, width: 360 },
  });
  await capture("16-reduced-motion-full-journey.png", {
    fullPage: true,
    media: { reducedMotion: "reduce" },
    viewport: { height: 900, width: 1280 },
  });
  await capture("17-forced-colors.png", {
    media: { forcedColors: "active", reducedMotion: "reduce" },
    setup: center("journey-chapter-engineering"),
    viewport: { height: 500, width: 720 },
  });

  await copyFile(
    path.join(process.cwd(), "app", "opengraph-image.png"),
    path.join(outputDirectory, "18-open-graph-preview.png"),
  );
  await copyFile(
    path.join(process.cwd(), "app", "icon.png"),
    path.join(outputDirectory, "19-browser-icon-source.png"),
  );
} finally {
  await browser.close();
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await app.close();
}
