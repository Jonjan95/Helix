# Visual polish audit

This document records the focused visual-system review completed after the portfolio-wide content pass. It is an implementation audit: findings are tied to observed layouts, changed rules, and measured outcomes rather than proposed art direction.

## Review boundary

| Item | Reviewed state |
| --- | --- |
| Base commit | `fe825b637c7e8ad2f39942801fa7a8bba48f53bb` (`main`, merged PR #16) |
| Branch | `style/visual-polish` |
| Viewports | 1440 × 1000, 1280 × 800, 1024 × 768, 768 × 1024, 390 × 844, 360 × 800 |
| Journey | Arrival, workspace entry, Environment, Engineering Mindset, Selected Projects, Experience, Continue, final path ending |
| Alternate states | reduced motion, direct fragments, forward and reverse ownership, keyboard focus, 200% reflow equivalent |
| Evidence | [`docs/media/visual-polish`](media/visual-polish) |

PR #16 merged with one committed file (`docs/content-voice-audit.md`). The completed visitor-copy implementation, related documentation, and regression updates were still present as an uncommitted local worktree when this review began. Those inherited changes are preserved on this branch and are not visual-polish authorship; they must be called out in the pull request diff.

## Audit method

1. Read the design, experience, architecture, concept, roadmap, journey-audit, and voice-audit references.
2. Capture the inherited pre-polish state at all six approved viewport sizes.
3. Inspect Arrival and every direct chapter fragment at desktop and mobile sizes.
4. Measure horizontal bounds and interactive target heights.
5. Classify observed issues as Blocker, Important, Polish, or Deferred art direction.
6. Make CSS-only refinements within the existing components and motion architecture.
7. Repeat the viewport, interaction, reduced-motion, forward/reverse, console, and static-generation checks.

The browser’s UI zoom could not be changed through the automated in-app surface. A 720 × 500 CSS viewport rendered at device scale factor 2 was therefore used as the 200% reflow equivalent for Arrival, Projects, Experience, and Continue. This verified reflow and overflow outcomes but does not replace a final manual browser-chrome zoom check on production hardware.

## Prioritized findings

### Blocker

No text overlap, clipping, horizontal overflow, broken focus state, missing route, path obstruction, or reduced-motion omission was found at the approved sizes.

### Important

- Supporting projects were rendered as two columns inside one 37rem side column. Their narrative and evidence became narrow text strips even at 1440 × 1000. They now stack as two substantial, quieter articles beneath the featured project.
- Repository actions measured 17px high on desktop. They now expose a 44px minimum target at every approved viewport while retaining native text-link presentation.
- Cyan marked every project status, project index, experience index, and evidence bullet. Supporting records now use strong neutral metadata; cyan remains on the featured project, the current Experience track, active nodes, connectors, and primary contact route.
- Upcoming and passed chapter content dropped to 0.48 and 0.58 opacity. The resulting muted body copy was needlessly faint during ownership transitions. Those states now retain 0.58 and 0.66 opacity while active content remains the clear focus.
- The Helix rails and rungs competed with right-side chapter headings. Rail, axis, and rung contrast was reduced without changing SVG geometry or active-state ownership.

### Polish

- Chapter headings used a tight 0.98 line height and a 5rem ceiling. The revised scale has a 4.75rem ceiling, a 1.01 line height, slightly calmer tracking, and a 13ch measure.
- Chapter introductions now use a 33rem editorial measure, slightly smaller responsive type, and a more generous 1.52 line height.
- Evidence groups now share soft and strong separator tokens instead of several near-duplicate white-alpha values.
- Repository and contact arrows use the same short interaction timing and restrained directional movement; reduced motion removes that movement.
- The laptop has a slightly smaller maximum width, quieter shell and base borders, a more balanced screen ratio, less compressed name tracking, and a broader neutral shadow.
- Continue’s continuation line and page-bottom space were shortened to create a complete but open ending.

### Deferred art direction

- project screenshots or case-study media;
- portrait or biography imagery;
- a new font pairing;
- 3D laptop or WebGL path;
- interactive nodes or a second navigation layer;
- illustration, glow, gradients as a new language, particles, or animated backgrounds.

## Typography findings

The single laptop-screen `h1` remains the strongest identity element. Chapter `h2` rules are shared across all five journey stops and remain clearly above project/track `h3` headings. The featured project and current Experience track retain larger `h3` values than their supporting records, and the difference is now covered by a computed-style regression test.

Metadata remains uppercase monospace, but cyan is no longer the default for all indices and statuses. Body and supporting copy keep the existing sans-serif family. No new font, manual heading break, or visitor-facing wording was added.

## Spacing and content measure findings

The page keeps the established viewport-paced chapter roles. No evidence justified a motion-timing change or a new spacing system. Chapter outer padding now uses a narrower `5.5rem–8rem` range, while internal lists use consistent 1.4rem row padding and shared group spacing.

Arrival summary measure changed from 42rem to 40rem. Chapter introductions changed from 36rem to 33rem. Featured evidence remains two-column only while the containing side column can support it; existing laptop/tablet rules collapse it. Supporting projects now stack at all sizes, removing their compressed desktop text strips. Experience remains one continuous evidence column.

## Color, cyan, separators, and borders

The palette is unchanged. Five maintenance tokens were added:

- `--color-line-soft`;
- `--color-line-strong`;
- `--color-muted-strong`;
- `--duration-interaction`;
- `--ease-interaction`.

Cyan continues to communicate the current path state, featured project, current Experience track, primary contact route, focus, and meaningful connector detail. Supporting statuses, indices, and list marks now use neutral values. Muted copy remains at the existing readable palette value; inactive-state opacity was raised.

Related content groups now use `--color-line-soft` or `--color-line-strong`. The change aligns Environment rows, project evidence, Experience evidence, contact routes, and supporting-project boundaries without turning them into identical cards or a second timeline.

## Laptop findings

Arrival remained balanced at 1440 × 1000, 1280 × 800, mobile, and the 200% reflow equivalent. The laptop is still semantic HTML/CSS and still supports rather than replaces the identity. No chrome, reflection, perspective overhaul, image asset, or motion value was added.

## Path and node findings

The SVG coordinates, shared path architecture, five nodes, and centralized state model are unchanged. The axis, back rail, front rail, and rungs are quieter; the active node ring is slightly tighter; connector peak opacity is lower. Upcoming and passed content remains more legible.

Mobile retains the single vertical path and 3.25rem reading offset. Reduced motion retains the static path and nodes without transforms, pinning, or hidden content.

## Chapter-specific decisions

- **Arrival:** narrower summary measure and restrained laptop material refinement; identity and entry sequence unchanged.
- **Environment:** consistent row spacing and dividers; remains the lightest structured chapter.
- **Engineering Mindset:** shared row and divider refinements improve the Understand–Isolate–Observe–Verify scan; handoff unchanged.
- **Selected Projects:** featured/current cyan discipline retained; supporting projects now stack; every repository link has a 44px target.
- **Experience:** current Track 01 retains the larger heading and cyan state; Tracks 02 and 03 receive neutral, readable metadata rather than footnote-like dimming.
- **Continue:** route separators and hover/focus feedback now match project actions; the final continuation and bottom space are shorter.

## Interaction findings

Global focus remains a 2px cyan outline with a 3px offset. The skip link, repository links, and contact links retain native semantics. Repository and contact actions share a 160ms interaction duration and restrained arrow movement. Focus is not communicated by color alone: links retain underline or outline treatment. Reduced motion removes nonessential transitions and arrow movement.

Final browser inspection reported 0 warnings and 0 errors.

## Responsive findings

- **1440 × 1000:** alternating composition and path remain balanced; supporting-project text is no longer compressed.
- **1280 × 800:** Arrival fits; headings and evidence remain in bounds; repository targets measure 44px.
- **1024 × 768:** internal featured grids collapse before text becomes narrow; route actions move below descriptions.
- **768 × 1024:** the composition simplifies to the mobile association because the scrollbar-reduced CSS width crosses the content breakpoint; order and path association remain clear.
- **390 × 844:** path offset leaves a readable content column; all project and contact actions remain touch-safe.
- **360 × 800:** no horizontal overflow or clipped heading was found; the final ending remains intentional.

All six measured `scrollWidth` values equalled their `clientWidth`.

## Accessibility and reduced motion

- one `h1` and the existing logical `h2`–`h4` order are preserved;
- semantic sections, articles, lists, native links, IDs, and destinations are unchanged;
- keyboard order remains skip link, entry cue, project repositories, and contact routes in document order;
- focus-visible retains a computed non-none 2px outline;
- repository targets are at least 44px at all approved sizes; contact targets exceed 44px;
- reduced motion exposes every chapter, project, track, route, node, and continuation without pin spacers or transformed content;
- direct fragments still enter the calibrated ownership range;
- the 200% reflow equivalent found no horizontal overflow in Arrival, Projects, Experience, or Continue.

The remaining accessibility limitation is a final manual browser-chrome zoom, screen-reader, alternate-input, and real-device pass.

## Performance and CSS cleanup

No dependency, runtime asset, client state, listener, animation controller, or hydration boundary was added. The change is CSS and outcome-based test coverage. Clearly duplicated supporting-project breakpoint overrides were removed after the stack became the shared rule. No speculative selector purge was performed.

`JourneyMotion`, `journey-motion.config.ts`, GSAP timelines, trigger ranges, transforms, durations, forward behavior, and reverse behavior are explicitly unchanged.

## Validation

Final approved sequence:

- `npm run lint` — passed;
- `npm run typecheck` — passed;
- `npm run build` — passed; `/` is statically prerendered;
- `npm run test:e2e` — passed, 21/21 Chromium tests;
- `npm run validate` — passed.

Browser review: 0 warnings, 0 errors, and no horizontal overflow at all six approved viewports. Automated forward/reverse ownership, reduced motion, direct fragments, keyboard order, focus treatment, and target sizing passed.

## Evidence

Before evidence is stored in [`docs/media/visual-polish/before`](media/visual-polish/before). The final 22-image sequence is stored in [`docs/media/visual-polish/after`](media/visual-polish/after):

1. desktop Arrival;
2. workspace entry;
3. Environment;
4. Engineering Mindset;
5. featured project;
6. supporting projects;
7. Experience Track 01;
8. Experience Tracks 02 and 03;
9. Continue;
10. final path ending;
11. compact-desktop Arrival;
12. compact-desktop Projects;
13. compact-desktop Experience;
14. tablet early chapter;
15. tablet evidence chapter;
16. tablet Continue;
17. mobile Arrival;
18. mobile Environment and Engineering;
19. mobile Projects;
20. mobile Experience;
21. mobile Continue and ending;
22. complete reduced-motion static journey.

No new recording was created. The earlier forward-and-reverse recording remains at [`docs/media/full-journey-audit/17-forward-reverse-journey.webm`](media/full-journey-audit/17-forward-reverse-journey.webm); automated ownership coverage was rerun after the polish changes.

## Intentionally unchanged

- visitor-facing copy and typed content models;
- chapter order, placements, pacing roles, and direct fragments;
- native scrolling and the single motion owner;
- laptop-to-workspace sequence;
- SVG path geometry;
- contact and repository destinations;
- static rendering and reduced-motion component tree;
- factual claim and privacy boundaries.

## Recommendation

The next milestone should be production readiness: metadata and social previews, analytics/privacy decision, final browser-chrome zoom, screen-reader and alternate-input checks, cross-browser and real-device review, then deployment. New art direction should remain separate from that release work.

## Production-readiness follow-up

Production readiness is now complete at the local release-candidate level. The follow-up adds no new visual direction and leaves every polish decision, motion value, path geometry, chapter placement, and visitor-facing claim unchanged.

Repository-owned icons and the Open Graph preview carry the restrained visual language into browser and sharing surfaces. Chromium, Firefox, and WebKit release checks pass; forced-colors and 200%/400% reflow equivalents preserve the semantic composition; the configured Lighthouse build scores 100 for Accessibility, Best Practices, and SEO. A real production URL, physical device, hands-on screen-reader, and browser-chrome zoom review remain part of the deployment smoke test. See the [production-readiness audit](production-readiness-audit.md).
