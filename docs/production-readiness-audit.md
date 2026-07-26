# Production Readiness Audit

Audit date: 2026-07-26

Reviewed base commit: `6ec12b91330f1f44cf6836443d536a73d62b3bdf`

Release status: locally validated release candidate; production URL and hosting destination pending

## Release boundary

This release contains the complete public journey: Arrival, Environment, Engineering Mindset, Selected Projects, Experience, and Continue. It preserves the approved copy, visual system, native scrolling, calibrated pacing, single `JourneyMotion` owner, typed local data, static rendering, responsive layouts, reduced-motion path, and verified public links.

Project detail pages, a CV download, a contact form, analytics, runtime GitHub data, a CMS, interactive Helix nodes, and 3D rendering are optional later work. None is required for an understandable and professionally reviewable first release.

## Hosting assumptions

No hosting platform, custom domain, or verified production URL existed at the audited base commit. The release therefore assumes a standard Node-capable Next.js host and introduces no vendor configuration. A public deployment must set `NEXT_PUBLIC_SITE_URL` to its canonical HTTPS origin before building. See [deployment.md](deployment.md).

The URL helper accepts HTTPS origins and localhost, removes paths, queries, and fragments, and normalizes the root. Without a valid value, Helix builds and runs locally but deliberately:

- emits no canonical URL or Open Graph URL;
- serves `robots.txt` with `Disallow: /`;
- serves an empty sitemap.

This prevents an unconfigured preview from advertising localhost or being indexed under an unintended host. A configured build emits the canonical root, Open Graph URL, an indexable robots response, and exactly one sitemap entry.

## Prioritized findings

### Blocker

- **Dependency advisories:** the baseline audit reported 12 high-severity advisories across Next.js, Sharp, PostCSS, and the ESLint toolchain. Next.js and its lint configuration were updated to 16.2.12, Playwright to 1.62.0, PostCSS to 8.5.23, and narrowly scoped patched transitive overrides were added for Sharp, Minimatch, and Brace Expansion. ESLint remains on the plugin-compatible 9.39.5 line. Final `npm audit` reports 0 vulnerabilities.
- **Production origin not selected:** code is deployment-ready, but a real public release is blocked until a hosting destination is selected and `NEXT_PUBLIC_SITE_URL` is configured. No speculative domain was committed.

### Important

- The base had only title and description metadata. It had no author, application name, canonical handling, Open Graph fields, Twitter card fields, social image, favicon, Apple icon, robots route, or sitemap route. These are now complete and environment-aware.
- The missing favicon produced a browser-console 404 and lowered Lighthouse Best Practices. Repository-owned icons now resolve through Next.js metadata routes.
- The scroll-entry, project, and contact links used accessible names that did not contain their visible labels. Project labels now include “View source on GitHub”; the entry name includes “Scroll to enter”; contact links use their complete visible content instead of an overriding `aria-label`.
- The repository had no CI workflow or broader browser command. Pull requests now run the approved Chromium validation sequence, while `npm run test:release` provides a focused Chromium, Firefox, and WebKit release matrix.
- No release or deployment documentation existed. This audit and `docs/deployment.md` now define the configuration, evidence, and maintenance boundary.

### Polish

- The default Next.js 404 is plain but correct, returns HTTP 404, and does not trap visitors. A custom error-page feature was not justified for this release.
- Lighthouse mobile LCP was 2.5 seconds in the local throttled audit. The page remains image-light, static, and stable, so no speculative motion removal or visual downgrade was made.
- Lighthouse reports unused or legacy-compatible JavaScript opportunities. The measured client JavaScript is primarily framework code plus the intentional GSAP journey boundary. This is a monitoring item rather than a release defect.
- Playwright Firefox reports its own scroll-linked positioning diagnostic for the intentional pinned camera transition. It produced no application error, failed state, or usability defect. The diagnostic is classified separately from application console output.

### Deferred experiment

- analytics, pending a separate privacy review;
- project detail routes, CV delivery, and a contact form;
- interactive path nodes and richer spatial or 3D exploration;
- custom error-page art direction;
- performance changes that would alter the approved journey without measured user benefit.

## Metadata, assets, and SEO

Final public metadata:

- title: `Jonathan Jansson | Software Development & Testing`;
- description: `Portfolio of Jonathan Jansson, a software development student in Malmö focused on testing and quality.`;
- application name: `Helix`;
- author and creator: `Jonathan Jansson`;
- Open Graph type: `website`;
- Twitter card: `summary_large_image`.

`app/opengraph-image.png` is a deterministic 1200 × 630, 39,886-byte repository-owned preview. It uses only the established graphite, warm-white, and cyan language and carries no unsupported claim. `app/icon.png` is 512 × 512 and `app/apple-icon.png` is 180 × 180. The source files are 11,761 and 6,181 bytes respectively in the final generation. `scripts/generate-release-assets.mjs` regenerates all three without a runtime dependency or external font.

The base had no `public/` directory and no unused public runtime assets. Documentation evidence remains under `docs/media/` and is not imported into the production route. The new release evidence totals about 2.03 MB and remains documentation-only.

With a configured site URL, `/robots.txt` allows `/` and references the absolute sitemap. `/sitemap.xml` contains exactly the canonical root. Without configuration, robots blocks indexing and the sitemap is empty. This intentional local result makes an unconfigured Lighthouse SEO audit score 63; the configured release build scores 100.

No keyword list, theme color, manifest, installability claim, or nonexistent route was added.

## Accessibility findings

The audit confirmed:

- document language is English;
- the skip link is the first useful control and lands on the first semantic journey stop;
- one logical `h1` identifies Jonathan;
- chapter `h2` headings and project/experience subheadings form a coherent hierarchy;
- native links retain visible focus and meaningful destination names;
- decorative indices and the Helix SVG do not enter the accessibility snapshot;
- project articles, Experience tracks, and contact routes are understandable without motion;
- touch targets remain at least 44px where the approved interaction matrix requires it;
- no release feature depends on client-side metadata or motion.

Method: the semantic DOM/accessibility snapshot was inspected in the Codex in-app browser, and Playwright verified headings, names, keyboard order, focus styles, touch targets, fragments, and link destinations. This was not a full hands-on NVDA, JAWS, or VoiceOver session and must not be represented as one.

The initial Lighthouse accessibility finding was the label-in-name mismatch described above. After the fix, both mobile and desktop Accessibility scores are 100. Automated scores support but do not replace assistive-technology testing.

## Keyboard, zoom, contrast, and reduced motion

Chromium keyboard-only review covered the skip link, entry link, all repository links, and all contact links in forward document order. Shift+Tab was reviewed through the same native focus sequence, no trap exists, and the decorative SVG is not focusable. Focus remains a visible two-pixel outline in the established theme.

WebKit on Windows follows Safari’s default automation setting, which does not include links in sequential Tab focus unless the user enables that browser preference. The release matrix therefore verifies WebKit’s rendered focus state programmatically while Chromium and Firefox verify sequential Tab focus. Physical Safari settings were not tested.

Reflow equivalents were reviewed at 720 CSS pixels wide for 200% and 360 CSS pixels wide for 400%, using the reduced-motion static path where necessary. All six chapters, the skip link, project links, and contact links remained reachable without essential horizontal scrolling or clipped text. These are viewport-based reflow equivalents, not a physical browser-chrome zoom session; that distinction remains a post-deployment manual check.

Playwright forced-colors emulation preserved readable text, identifiable native links, visible focus, and semantic structure even when the decorative path and separators were visually reduced. No forced-colors-specific redesign was needed.

Reduced motion creates no camera timeline, chapter timeline, ScrollTrigger, or pin spacer. Every chapter, project, Experience track, contact route, and metadata resource remains immediately available. This was revalidated in Chromium, Firefox, and WebKit.

## Browser, viewport, and mobile findings

The focused release suite passed 18/18 checks across Playwright-managed Chromium 151, Firefox 153, and WebKit 26.5. It verifies metadata resources, headers, 404 behavior, console safety, desktop and mobile traversal, path and laptop presence, horizontal bounds, reduced motion, forced colors, and zoom-equivalent reflow.

The established Chromium suite additionally passed at:

- 1440 × 1000;
- 1280 × 800;
- 1024 × 768;
- 768 × 1024;
- 390 × 844;
- 360 × 800.

The release suite also covered 844 × 390 mobile landscape. All measured layouts had `scrollWidth <= clientWidth`. Mobile and landscape results are browser emulation; no physical phone or physical Safari device was available.

Application console review found 0 warnings and 0 errors in Chromium and WebKit, and 0 application warnings or errors in Firefox. Firefox’s engine-generated scroll-linked positioning diagnostic is recorded under Polish rather than silently treated as application output.

## Performance, bundles, and Core Web Vitals risk

Lighthouse 13.0.3 ran against the configured production build with Playwright Chromium on Windows:

| Mode | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT | Speed Index |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 98 | 100 | 100 | 100 | 2.5 s | 0 | 20 ms | 1.1 s |
| Desktop | 100 | 100 | 100 | 100 | 0.5 s | 0 | 0 ms | 0.3 s |

The reports completed successfully. Lighthouse then emitted a Windows temporary-directory cleanup `EPERM` message after writing each JSON report; it did not invalidate the reports. Synthetic results vary by host and are not a production SLA.

Final build inventory:

- three static HTML files, 111,520 bytes total;
- seven client JavaScript chunks, 764,346 bytes total;
- two CSS files, 35,899 bytes total;
- no external web-font request;
- no runtime project image, portrait, analytics script, profile embed, or third-party widget.

The likely LCP candidate is the server-rendered Arrival identity/laptop composition. It is not blocked on a runtime image or custom font. CLS risk is low because content is present in initial HTML, the route has no runtime content fetch, and measured CLS was 0. INP risk is concentrated in the intentional GSAP/ScrollTrigger client boundary; it uses transforms and opacity, one scoped owner, and no React state updates per scroll frame. TBT remained 20 ms mobile and 0 ms desktop.

The current system font stack avoids network failure, licensing, and font-swap layout risk. Social asset generation uses browser-standard Arial/Helvetica/monospace fallbacks and requires no private font file.

## Links, fallbacks, security, and privacy

Verified public routes:

- GitHub profile: HTTP 200;
- AI-Powered Test Engineer repository: HTTP 200;
- CortexGrid repository: HTTP 200;
- Helix repository: HTTP 200;
- LinkedIn: identity-matched HTTPS route; automated request returned LinkedIn’s anti-automation status 999, not a broken-link conclusion;
- email: valid `mailto:jonis.jansson@hotmail.com`.

Internal checks cover the skip link, entry link, five chapter fragments, canonical root behavior, robots, sitemap, icons, and social image. No `href="#"`, empty destination, fake control, or malformed mail route exists.

The semantic portfolio remains in static HTML if JavaScript is unavailable; only the enhanced motion and chapter-state styling are absent. Direct fragments are restored after ScrollTrigger refresh. The default invalid route returns 404.

No secret, token, private note, environment value, unsafe HTML, runtime external script, phone number, address, client identity, or private repository detail was found in tracked release files. `.env.example` contains only a non-secret placeholder. External links retain the repository’s native same-tab convention, so no `target="_blank"`/`rel` risk was introduced.

Next.js now returns conservative `nosniff`, `DENY` framing, strict-origin referrer, and disabled camera/microphone/geolocation headers. A strict CSP was not added because it requires hosting-specific testing with Next.js scripts and the motion runtime. Source-map exposure and HTTP-to-HTTPS or apex/`www` redirects remain hosting decisions.

Analytics is intentionally excluded from the initial release. This avoids trackers, cookies, consent state, and third-party performance scripts. Any future analytics work requires a separate privacy-reviewed decision.

## CI and deployment findings

`.github/workflows/validate.yml` runs on pull requests and `main` pushes with Node 24, `npm ci`, Playwright Chromium installation, and `npm run validate`. The required CI remains focused and predictable.

`npm run test:release` is the broader pre-release matrix. It is kept separate because installing and running all three browser engines on every small change adds cost without improving the core feedback loop. A maintainer should run it before deployment or after changes to layout, motion, metadata, or browser support.

Standard deployment requires no platform file. The build remains fully prerendered, asset paths are root-relative, and fragments do not require server rewrites. The host must support the documented Node version, run `npm ci` and `npm run build`, set the canonical URL before the build, and serve the Next.js output.

## Fixes completed

1. Added safe site-URL normalization and environment-aware canonical behavior.
2. Completed title, description, author, creator, application, Open Graph, and Twitter metadata.
3. Added deterministic Open Graph, favicon, and Apple icon assets.
4. Added native robots and sitemap routes with safe unconfigured behavior.
5. Added tested baseline response headers.
6. Corrected label-in-name accessibility mismatches.
7. Updated vulnerable dependencies and reduced `npm audit` to 0 findings.
8. Added release metadata, resource, 404, header, console, zoom, forced-colors, mobile-landscape, and three-browser coverage.
9. Added required CI and separate release-matrix commands.
10. Added deployment and maintenance documentation.
11. Captured 19 repository-owned evidence files.

## Exact validation

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run build` — passed; `/`, metadata assets, robots, and sitemap are statically generated.
- `npm run test:e2e` — passed, 27/27 Chromium tests.
- `npm run test:release` — passed, 18/18 focused checks across Chromium, Firefox, and WebKit.
- configured metadata build and test — passed with `NEXT_PUBLIC_SITE_URL=https://portfolio.example.com` used only as a local validation value.
- `npm audit` — passed, 0 vulnerabilities.
- Lighthouse 13.0.3 configured mobile/desktop — 98/100 Performance, 100/100 Accessibility, 100/100 Best Practices, 100/100 SEO.
- public-link probes — GitHub and three repositories HTTP 200; LinkedIn 999 anti-automation response; email syntax valid.
- accessibility snapshot — completed through the in-app browser; not a full physical screen-reader session.
- physical device and public production smoke test — unavailable because no deployment destination exists.

## Evidence

The final 19-item evidence set is stored in [`docs/media/production-readiness`](media/production-readiness):

1. desktop Arrival;
2. desktop Environment;
3. desktop Projects;
4. desktop Experience;
5. desktop Continue;
6. final path ending;
7. default 404;
8. mobile Arrival;
9. mobile Projects;
10. mobile Continue and ending;
11. skip-link focus;
12. project-link focus;
13. contact-link focus;
14. 200% reflow equivalent;
15. 400% reflow equivalent;
16. complete reduced-motion journey;
17. forced-colors emulation;
18. Open Graph preview;
19. browser icon source.

The browser-icon file verifies the shipped 512px source; headless screenshots do not include physical browser chrome, so a real browser-tab capture remains part of the production smoke test.

## Deferred risks and recommendation

Known limitations are a pending real hostname, no public deployment smoke test, no physical mobile or Safari test, no hands-on screen-reader session, viewport-based rather than browser-chrome zoom evidence, and the Firefox scroll-linked diagnostic. None indicates a verified defect in the current release candidate, but each should be stated honestly.

Helix is locally validated and deployment-ready once a hosting target and canonical URL are selected. It should not yet be described as publicly production-proven. The next milestone should be a small deployment issue: choose the host, configure `NEXT_PUBLIC_SITE_URL`, deploy this exact release candidate, verify HTTPS and canonical redirects, then repeat the production URL smoke, social-preview, physical browser-tab, screen-reader, and real-device checks. Experimental 3D or visual work should begin only after that release is stable.
