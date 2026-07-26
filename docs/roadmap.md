# Roadmap

Each milestone should produce a coherent, testable improvement. The order can evolve, but accessibility and performance checks belong throughout the work.

## 1. Static foundation — complete

- Establish Next.js, TypeScript, CSS Modules, ESLint, and Playwright.
- Create the responsive laptop hero and semantic content sections.
- Define the visual tokens and initial reduced-motion policy.

## 2. Laptop hero refinement — content complete

- Replace provisional identity and introduction copy.
- Refine the laptop proportions and responsive compositions.
- Test hierarchy, contrast, keyboard flow, and screen-reader output.

Jonathan Jansson is now the single public identity. The finite Arrival scene pairs his full name with a verified Malmö location, a study-level professional title, current testing-and-quality direction, and one concise systems-focused summary. Desktop and mobile preserve the semantic laptop, visible entry cue, one logical `h1`, and reduced-motion access without adding imagery, calls to action, or role rotation.

## 3. Scroll-driven laptop zoom — prototype complete

- Prototype the camera move with GSAP and ScrollTrigger.
- Preserve a stable document flow and usable no-motion version.
- Validate performance on representative desktop and mobile devices.

## 4. Transition into the digital journey — prototype complete

- Define the spatial handoff from the physical laptop to screen content.
- Make the transition understandable with motion disabled.
- Establish navigation and orientation within the digital space.

## 5. Helix prototype — complete journey graybox

- Test a lightweight spiral or DNA-like path without committing to a 3D library.
- Evaluate whether the metaphor improves comprehension and recall.
- Keep semantic sections as the content source of truth.

The current journey connects all five stops with one accessible, responsive path and a reversible motion layer. Its first focused visual-polish pass is complete; new art direction, node interaction, and any decision about 3D rendering remain open.

## 6. Content destinations — complete

- Maintain verified project data, roles, decisions, quality evidence, current status, and honest scope boundaries.
- Preserve the featured AI-Powered Test Engineer narrative and the supporting CortexGrid and Helix hierarchy as the projects evolve.
- Design detail routes, imagery, or deeper case-study interactions only after those content needs are verified.

The first chapter-level showcase is complete: three typed project records render as semantic, responsive articles with verified public repository links and a static reduced-motion path. Detail routes, galleries, project media, repository statistics, and project-specific interactions remain deferred.

Experience is the second content-complete chapter. Three typed tracks connect current software-and-quality studies, previous embedded-systems studies, and practical field troubleshooting without reproducing a chronological CV. Claims remain bounded to verified study, public project, and field-service evidence; client identities, guessed dates, exhaustive employment history, and unsupported outcomes remain excluded. The chapter reuses the expanded journey pacing role, keeps every article in semantic document flow, and introduces no Experience-specific motion. A downloadable CV remains deferred until its final content and privacy boundary are verified separately.

Continue is the third content-complete chapter. A purpose-built contact model renders verified GitHub, LinkedIn, and professional email routes as native links in one calm semantic list. GitHub receives restrained evidence emphasis; every route remains keyboard-reachable, touch-safe, and immediately visible with reduced motion. The chapter retains the exit pacing role and visible path continuation without adding a footer panel, contact form, service integration, or Continue-specific motion. Final copy polish, scheduling tools, analytics, and downloadable CV functionality remain deferred.

Environment and Engineering Mindset complete the early journey without competing with those evidence chapters. Three typed Environment principles describe small, reviewable steps, checking what changed, and learning by building. Four typed Engineering steps preserve the transferable Understand, Isolate, Observe, Verify sequence, followed by one restrained handoff into Projects. Both chapters remain semantic, server rendered, responsive, static under reduced motion, and governed only by the existing centralized pacing roles.

The portfolio-wide voice and concision pass is complete. All six chapters now use one direct, personal voice; repeated process terminology and duplicated qualification have been reduced without changing project statuses, study or employment boundaries, contact routes, layout, pacing, or motion. The [content voice audit](content-voice-audit.md) records the inventory, terminology choices, and before-and-after measurements.

## 7. Accessibility and reduced motion — release-candidate audit complete

- Continue auditing keyboard navigation, focus order, headings, landmarks, labels, zoom, and screen-reader output.
- Maintain and extend the tested complete reduced-motion journey.
- Test contrast, zoom, screen readers, and alternate input methods.

The release audit extends the first complete audit with accessibility-tree inspection, keyboard and reverse-focus review, forced-colors emulation, 200% and 400% reflow equivalents, and reduced-motion checks in Chromium, Firefox, and WebKit. A hands-on screen-reader session, physical browser-chrome zoom, alternate input, and real-device review remain post-deployment checks.

## 8. Testing and performance — release candidate complete

- Maintain end-to-end coverage across the six approved responsive presentations.
- Add automated accessibility checks and focused interaction tests.
- Measure Core Web Vitals, animation smoothness, and asset weight.

The current Chromium suite covers 1440 × 1000, 1280 × 800, 1024 × 768, 768 × 1024, 390 × 844, and 360 × 800, including static generation, console safety, overflow, touch targets, direct fragments, and reversible chapter ownership. A focused 18-check release matrix now passes in Chromium, Firefox, and WebKit and adds mobile landscape, metadata resources, headers, 404 behavior, forced colors, zoom-equivalent reflow, and reduced motion. Lighthouse 13.0.3 measured 98/100 mobile and 100/100 desktop Performance, with 100 Accessibility, Best Practices, and SEO on the configured build.

The first post-exploration production design iteration is a reviewable laptop-threshold refinement. It uses shallow CSS perspective inside the existing motion owner, preserves mobile and reduced-motion behavior, and includes matched control and revised evidence. The later layered-SVG Helix-depth recommendation remains a separate milestone and must not be inferred from this threshold review.

## 9. Final content and deployment — locally deployment-ready

- Maintain the approved voice and claim boundaries as project details evolve.
- Complete metadata, social previews, analytics decisions, and privacy review.
- Run final cross-browser checks and deploy the production portfolio.

The focused visual-polish milestone is complete. Typography, editorial measure, supporting-project composition, cyan discipline, separators, path contrast, action states, laptop finish, and the final ending were refined without changing motion or adding dependencies. The [visual polish audit](visual-polish-audit.md) records the decisions and evidence.

Production metadata, favicon and Apple icon, the 1200 × 630 social preview, safe canonical handling, robots, sitemap, response headers, CI, dependency cleanup, deployment documentation, and release evidence are complete. Analytics is intentionally excluded for privacy. No platform or domain is guessed; the production build must receive `NEXT_PUBLIC_SITE_URL`.

The next focused milestone is deployment rather than further implementation: select the host, configure the verified origin, deploy the reviewed release candidate, then smoke-test the public URL, browser tab, social preview, redirects, a hands-on screen reader, physical zoom, and real devices. Only after that should richer spatial or 3D experiments resume.

The [spatial design exploration](spatial-design-exploration.md) is now complete on an unlisted, direct-access experimental route that remains outside production navigation and indexing. Its recommendation is a small CSS-perspective laptop threshold combined with layered SVG path depth; Three.js remains lab-only and is not approved for the portfolio experience. A future implementation issue should validate that hybrid against the existing journey timing before any broader spatial redesign.
