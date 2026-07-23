# Full journey audit

This document records the first portfolio-wide review of Helix as one continuous experience. It is intentionally focused on observed behaviour and high-confidence decisions rather than final art direction or copy critique.

## Review boundary

| Item | Reviewed state |
| --- | --- |
| Audit date | 2026-07-23 |
| Reviewed commit | `8fd7dde95125e4c65188548735fd382152659092` (`main`, merged PR #13) |
| Viewports | 1440 × 1000, 1280 × 800, 1024 × 768, 768 × 1024, 390 × 844, 360 × 800 |
| Motion | Standard motion and `prefers-reduced-motion: reduce` |
| Journey direction | Forward from Arrival to Continue and reverse from Continue to Arrival |
| Validation baseline | `npm run validate`: lint, typecheck, static build, and 16 Chromium tests passed |

The review covered the laptop entry, workspace handoff, five Helix stops, direct chapter fragments, all project and contact links, semantic structure, responsive layouts, reduced motion, browser console output, and static generation.

## Prioritized findings

| ID | Area | Priority | Finding | Decision | Status |
| --- | --- | --- | --- | --- | --- |
| A11Y-01 | Skip navigation | Blocker | The first-focus skip link targets `#main-content`, but that element wraps the Arrival scene as well as the portfolio journey. Activating it does not bypass the immersive entry. | Retarget the link to the first journey stop and describe that destination accurately. | Fixed in this PR |
| A11Y-02 | Mobile touch target | Blocker | At 360px and 390px widths, the visible “Scroll to enter” link is approximately 15px high. Other project and contact links meet or exceed 44px. | Give the entry link a minimum 44px target without increasing its visual weight. | Fixed in this PR |
| TEST-01 | Responsive regression coverage | Important | The required 1280 × 800 and 360 × 800 audit sizes are not in the automated overflow matrix. Manual review found no overflow after a fresh layout. | Add both sizes to the existing outcome-based viewport test and cover the entry-link target. | Fixed in this PR |
| VIS-01 | Direct chapter entry | Polish | Direct fragments preserve the active node and show the chapter heading with useful preceding context, but the amount of previous-chapter content varies by chapter and viewport. | Keep the calibrated fragment restoration; revisit only if final content changes chapter height materially. | Deferred |
| VIS-02 | Tablet density | Polish | At 768px, the alternating composition remains readable but Experience metadata and long headings use a narrow measure. No overlap or overflow occurs. | Preserve the current side relationship; re-evaluate during final visual polish rather than introducing a breakpoint-only layout rewrite. | Deferred |
| CNT-01 | Arrival and early chapters | Content later | Arrival identity copy and the lighter Environment and Engineering chapters remain less complete than the three evidence chapters. | Address in the planned content pass; do not use spacing or motion to disguise incomplete content. | Deferred |
| CNT-02 | Evidence prose | Content later | Some project and experience explanations are formal and repeated evidence labels create a dense reading rhythm. Claims remain accurate and the hierarchy remains usable. | Refine tone and concision in a dedicated copy pass with claim verification. | Deferred |

## Forward journey findings

- Arrival is calm, immediately identifies Jonathan, and makes the laptop the clear gateway. The entry cue is visible, but its touch target needs correction.
- The laptop-to-workspace handoff remains understandable and finite. No chapter is reported active before the workspace sequence begins.
- Environment and Engineering are intentionally lighter than later chapters. Their spacing creates progression without a broken or trapped interval.
- Projects retains a clear featured/supporting hierarchy. The featured project carries the deepest narrative; the two supporting projects remain visibly subordinate and owned by Projects.
- Experience preserves Track 01 emphasis while keeping Tracks 02 and 03 discoverable. The final field-service perspective is read before Continue becomes dominant.
- Continue lowers density appropriately, keeps all three routes readable, and leaves the path visibly open without excessive final dead space.
- No high-confidence pacing change is justified. Existing `entry`, `featured`, `expanded`, and `exit` roles remain appropriate.

## Reverse journey findings

- Continue restores to Experience before Experience restores to Projects.
- Projects restores before Engineering, and the earlier nodes return with coherent `active`, `upcoming`, and `passed` states.
- No content remains emphasized under the wrong node during the reviewed reverse sequence.
- The laptop and workspace return without an invalid transform, blank interval, or path jump.
- Reverse behaviour uses the same centralized state model as forward travel; no reverse-specific fix is required.

## Responsive findings

- **1440 × 1000:** The full alternating composition, path, content measures, and final continuation remain balanced.
- **1280 × 800:** Projects and Experience remain readable and in bounds after a fresh layout. This required review size was missing from automated coverage.
- **1024 × 768:** The path and text remain separate, headings wrap cleanly, and completed chapters retain usable reading width.
- **768 × 1024:** The side association remains understandable. Experience metadata is dense but readable; no breakpoint rewrite is justified by the evidence.
- **390 × 844:** Semantic order, native scrolling, vertical path continuity, contact targets, and project links are sound.
- **360 × 800:** No horizontal overflow occurs. The entry link is the only current interactive target below 44px.

## Accessibility findings

- One logical `h1` identifies Jonathan; chapter headings use `h2`, and project and experience titles use `h3`.
- Landmarks, semantic articles, lists, native links, unique IDs, and document order remain coherent.
- The Helix SVG is decorative, non-focusable, and hidden from assistive technology.
- Focus treatment remains visible and uses the approved cyan outline.
- Project and contact links have descriptive accessible names and follow document order.
- Reduced motion exposes every chapter and route without pinning, opacity dependency, or motion-only information.
- The skip destination and entry-link target size are the two accessibility blockers selected for repair.

## Link findings

Verified destinations:

- GitHub profile: `https://github.com/Jonjan95`
- LinkedIn profile: `https://se.linkedin.com/in/jonathan-jansson-b94783270`
- Email: `mailto:jonis.jansson@hotmail.com`
- AI-Powered Test Engineer: `https://github.com/Jonjan95/AI-Powered-Test-Engineer`
- CortexGrid: `https://github.com/Jonjan95/CortexGrid`
- Helix: `https://github.com/Jonjan95/Helix`
- Direct chapters: `#about`, `#skills`, `#projects`, `#experience`, and `#contact`

No `href="#"`, empty anchor, fake button, malformed `mailto:`, or unimplemented route claim was found. External links consistently use native same-tab navigation.

The GitHub profile and all three repositories returned HTTP 200 during the final audit. The LinkedIn URL remains the identity-matched public route verified for PR #13; LinkedIn returned its automated-request status 999 to the command-line probe, so that response is recorded as an automation limitation rather than evidence of a broken destination. The email route is a valid native `mailto:` value and requires the visitor to have a mail client configured.

## Performance and console findings

- `/` remains statically prerendered.
- `JourneyMotion` remains the only client motion owner.
- The implementation retains one scoped GSAP context, one responsive match-media boundary, one path timeline, and one chapter timeline per stop.
- No duplicate scroll listener, runtime profile request, hydration mismatch, large runtime asset, or new dependency was found.
- Baseline browser review produced 0 warnings and 0 errors.

## Final validation

`npm run validate` passed after the selected fixes:

- `npm run lint` — passed;
- `npm run typecheck` — passed;
- `npm run build` — passed; `/` remains statically prerendered;
- `npm run test:e2e` — passed; 18/18 Chromium tests.

The final browser review reported 0 console warnings and 0 console errors. All six approved viewport sizes reported zero horizontal overflow. The 360px entry cue measured 44px high after the fix, mobile remained unpinned, reduced motion exposed the complete static route, and forward and reverse ownership checks passed.

## Visual evidence

The 16-image review sequence and forward/reverse recording are stored in [`docs/media/full-journey-audit`](media/full-journey-audit):

1. Desktop Arrival.
2. Desktop workspace entry.
3. Engineering transitioning toward Projects.
4. Projects active.
5. Projects transitioning toward Experience.
6. Experience active.
7. Experience transitioning toward Continue.
8. Continue and the final path ending.
9. Laptop Projects.
10. Laptop Experience.
11. Tablet Experience.
12. Mobile early journey.
13. Mobile Projects.
14. Mobile Experience.
15. Mobile Continue and final ending.
16. Complete reduced-motion sequence.
17. Forward-and-reverse journey recording (`.webm`).

## Fixes completed in this PR

1. Make the skip link bypass Arrival and land at the first semantic journey stop.
2. Make the mobile entry cue a minimum 44px touch target.
3. Add 1280 × 800 and 360 × 800 to the responsive overflow matrix.
4. Add an outcome assertion for the entry cue target and the corrected skip destination.

## Intentionally deferred

- portfolio-wide voice and concision work;
- final Arrival identity and biography copy;
- content completion for Environment and Engineering;
- tablet metadata polish that does not currently impair use;
- project detail routes, imagery, and case-study interactions;
- downloadable CV and exhaustive employment history;
- final cross-browser, screen-reader, 200% zoom, and production-device audits;
- interactive nodes, Three.js, WebGL, canvas, and final visual polish.

## Remaining recommendations

The next milestone should be a focused Arrival and early-journey content pass. It should replace the remaining provisional identity and early-chapter copy, confirm the Orientation-to-Engineering narrative handoff, and re-run this audit without changing the established motion architecture.
