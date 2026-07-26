import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const outputDirectory = path.join(process.cwd(), "app");

const assetMarkup = (format) => {
  const isIcon = format !== "social";
  const isSmallIcon = format === "small-icon";
  const iconScale = isSmallIcon ? 0.35 : 1;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <style>
      * { box-sizing: border-box; }
      html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; }
      body {
        align-items: stretch;
        background: #111416;
        color: #f2eee5;
        display: flex;
        font-family: Arial, Helvetica, sans-serif;
        padding: ${isIcon ? `${44 * iconScale}px` : "64px 72px"};
      }
      .frame {
        border: 1px solid #343a3f;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
        padding: ${isIcon ? `${40 * iconScale}px` : "48px"};
        position: relative;
      }
      .frame::before {
        background:
          linear-gradient(rgba(103, 214, 234, 0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(103, 214, 234, 0.07) 1px, transparent 1px);
        background-size: ${isIcon ? `${32 * iconScale}px ${32 * iconScale}px` : "48px 48px"};
        content: "";
        inset: 0;
        mask-image: linear-gradient(to bottom right, black, transparent 72%);
        position: absolute;
      }
      .label, .identity, .mark { position: relative; z-index: 1; }
      .label {
        color: #9da6ac;
        font-family: Consolas, "Courier New", monospace;
        font-size: ${isIcon ? `${20 * iconScale}px` : "20px"};
        letter-spacing: 0.16em;
      }
      .identity h1 {
        font-size: ${isIcon ? `${74 * iconScale}px` : "72px"};
        font-weight: 500;
        letter-spacing: -0.04em;
        line-height: 0.94;
        margin: 0 0 ${isIcon ? `${20 * iconScale}px` : "22px"};
        max-width: 900px;
      }
      .identity p {
        color: #b7bdc0;
        font-size: ${isIcon ? `${24 * iconScale}px` : "25px"};
        letter-spacing: 0.015em;
        line-height: 1.35;
        margin: 0;
      }
      .mark {
        align-items: center;
        color: #67d6ea;
        display: flex;
        font-family: Consolas, "Courier New", monospace;
        font-size: ${isIcon ? `${42 * iconScale}px` : "26px"};
        gap: ${isIcon ? `${18 * iconScale}px` : "18px"};
        letter-spacing: 0.12em;
      }
      .mark::before {
        background: #67d6ea;
        content: "";
        height: 1px;
        width: ${isIcon ? `${52 * iconScale}px` : "96px"};
      }
      ${isIcon ? ".identity p { display: none; }" : ""}
    </style>
  </head>
  <body>
    <main class="frame">
      <div class="label">HELIX / PORTFOLIO</div>
      <div class="identity">
        <h1>${isIcon ? "JJ" : "Jonathan Jansson"}</h1>
        <p>Software development · Testing &amp; quality</p>
      </div>
      <div class="mark">${isIcon ? "H" : "ENGINEERED WITH INTENT"}</div>
    </main>
  </body>
</html>`;
};

await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch();

try {
  const socialPage = await browser.newPage({
    deviceScaleFactor: 1,
    viewport: { height: 630, width: 1200 },
  });
  await socialPage.setContent(assetMarkup("social"));
  await socialPage.screenshot({
    path: path.join(outputDirectory, "opengraph-image.png"),
  });

  for (const [filename, size] of [
    ["icon.png", 512],
    ["apple-icon.png", 180],
  ]) {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { height: size, width: size },
    });
    await page.setContent(assetMarkup(size < 512 ? "small-icon" : "icon"));
    await page.screenshot({ path: path.join(outputDirectory, filename) });
    await page.close();
  }

  await socialPage.close();
} finally {
  await browser.close();
}
