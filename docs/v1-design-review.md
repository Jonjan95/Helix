# Helix v1 design review

## Review boundary

This review evaluates the complete public journey after the merged Story
Before Scroll work. It covers Arrival, The Threshold, Environment, Engineering
Mindset, Selected Projects, Experience, and Continue. It does not redesign the
Helix, propose new motion, change the motion architecture, or review the
isolated spatial lab as part of the public portfolio.

The production build was reviewed with native scrolling at approximately:

- 1440 × 1000 desktop;
- 1024 × 768 laptop;
- 768 × 1024 tablet;
- 390 × 844 mobile.

Direct chapter links, the final page ending, browser console output, and
horizontal overflow were also inspected. This document separates observable
defects from subjective opportunities so that v1.0 does not become an
open-ended redesign.

## Current design baseline

The core direction is coherent and worth keeping:

- Arrival is calm, legible, and clearly establishes the laptop as the entry
  object.
- The Threshold creates a continuous crossing rather than a page change.
- The Helix path gives the long page a stable visual spine without replacing
  semantic HTML.
- PR #25 successfully makes Environment lighter, Engineering more deliberate,
  and the Engineering-to-Projects handoff easier to read.
- Alternating placement remains understandable on desktop and becomes a clear
  single sequence on mobile.
- Continue closes quietly and leaves visible path continuation.
- No horizontal overflow or browser console warning/error was observed in the
  reviewed states.

The remaining work is not a new art direction. It is a small set of release
defects and decisions about information density, visual evidence, and visitor
agency.

## Priority definitions

- **Must fix before v1.0:** an observable usability or presentation defect
  that can prevent a visitor from reaching or understanding content.
- **Should improve before v1.0:** a bounded visual decision that would make the
  portfolio feel more authored and balanced, but does not currently break it.
- **Optional after release:** polish or expansion that is safe to evaluate from
  real visitor feedback.

## Objective defects

### Must fix before v1.0

**D01 — Direct Environment access can be covered by the Threshold at animated
breakpoints.** Opening `/#about` at 1024 × 768 and 768 × 1024 can set
`data-active-chapter="environment"` while the large Threshold surface remains
visually above the Environment heading. The DOM content exists and the journey
state is correct, but visitors see the ghosted laptop identity, `ENTRY LAYER
READY`, or later Environment rows instead of a reliable chapter opening.

Desktop 1440 × 1000 and the static 390 × 844 mobile flow landed acceptably in
the reviewed runs. The defect is therefore a handoff/deep-link calibration
problem, not missing content. Fix layer ownership or post-initialisation anchor
calibration within the existing `JourneyMotion` owner. Add an outcome-based
test that requires the Environment heading to be visibly unobscured after a
direct visit; checking only the active-state attribute is insufficient.

**D02 — The long journey has no visible way to reach evidence or contact
directly.** The only visible journey control is `Scroll to enter`; the skip
link moves to Environment and is intentionally hidden until focused. A visitor
who returns for Projects or Contact must traverse the entire long page, while
the existing hash routes are not discoverable. This conflicts with the
portfolio requirement that the guided story remain clear and usable.

Resolve this with one restrained, accessible chapter-access pattern that
coexists with the journey. It must use the existing anchors and native scroll,
must not become route navigation or a second motion controller, and must remain
compact on mobile. This is a visitor-agency correction, not a request for a
large navigation redesign.

### Should improve before v1.0

No additional objective layout defect was observed. In particular, required
content remains in document flow, mobile scrolling is native, the final routes
are reachable, and the reviewed page widths do not overflow horizontally.

### Optional after release

- Re-test direct chapter links after deployment because font loading and final
  hosting timing can expose calibration races that a local production server
  does not.

## Subjective design opportunities

### Should improve before v1.0

**D03 — Give Selected Projects visual evidence, not merely visual structure.**
Projects is the longest and most important proof chapter, but its evidence is
entirely typographic. The branch treatment, status labels, and technical grid
organise the chapter well; they do not show the work itself. This causes the
experience to shift from visual storytelling into a well-designed README.

Keep the existing narrative and add a deliberately limited evidence set: one
representative, verified visual per project is enough for v1.0. Use real UI,
test output, architecture, or project-state evidence—not decorative mockups.
Define consistent aspect, caption, alt-text, loading, and responsive rules
before adding assets. Do not turn the chapter into a gallery or carousel.

**D04 — Reduce the density change after Engineering.** Environment and
Engineering use generous rhythm and short statements. Projects and Experience
then introduce many paragraphs, subheads, lists, technology labels, and scope
notes. The content is readable, but the journey's energy changes from guided
discovery to documentation, especially at 768 × 1024 and 390 × 844.

Address this only after the approved content pass. Remove semantic repetition
before changing type size or spacing. Preserve visible claim boundaries and
quality evidence. The goal is a clearer first reading, not less substance.

**D05 — Treat tablet as a composition, not a reduced desktop.** At 768 × 1024,
the alternating layout preserves the Helix relationship but gives Projects and
Experience a narrow text column while leaving a large opposite field. Long
headings, metadata, and evidence wrap more often than necessary. Review one
tablet-specific content-width/alignment adjustment that keeps the path visible
without forcing full mobile stacking.

The adjustment must be shared and token-led, not a set of per-chapter pixel
exceptions. Laptop at 1024 × 768 remains balanced and should not inherit the
tablet correction without evidence.

**D06 — Restrain the Threshold's interface chrome.** During the crossing,
`ENTRY LAYER READY` and other system labels can become the most prominent
content in a large dark field. The transition itself remains controlled, but
the labels make the experience feel more simulated and provisional than the
rest of Helix. After the copy decision in C04, reduce or remove chrome that
does not help the visitor understand entry into the workspace. Preserve the
current camera distance, pin duration, spatial relationship, and motion owner.

**D07 — Remove repeated Arrival signals.** The frame focus, laptop status,
eyebrow, heading, and supporting copy all compete to explain the same identity.
The laptop composition is strong, but repeated labels make it feel like a
designed template rather than a confident introduction. Apply the approved
Arrival copy hierarchy from C02–C03 before making any visual change.

### Optional after release

**D08 — Tune the final continuation from real use.** Continue currently ends
with clear native links, `The path remains open`, and a calm continuation
field. Its extra vertical settling space is intentional and not excessive in
the reviewed mobile state. Revisit its length only if analytics-free user
observation shows that visitors mistake it for unfinished space.

**D09 — Consider small chapter-specific evidence accents.** Once real project
media exists, Environment and Experience may benefit from one restrained,
content-derived variation each. Do not add decorative effects merely to make
chapters look different; the existing alternation and hierarchy are already
sufficient for v1.0.

## Chapter-by-chapter decision record

### Arrival

- **Keep:** centered laptop, restrained palette, readable identity, and calm
  initial state across all four viewports.
- **Fix before v1.0:** the repeated identity hierarchy through C02–C03/D07.
- **Do not reopen:** laptop proportions, global lighting, or arrival motion.

### The Threshold

- **Keep:** shallow physical depth, continuous native scroll, current distance,
  pin duration, and responsive/reduced-motion architecture.
- **Fix before v1.0:** direct `#about` handoff at animated tablet/laptop widths
  (D01).
- **Improve:** reduce nonessential interface chrome (D06).
- **Do not reopen:** spatial concept, camera model, or motion ownership.

### Environment

- **Keep:** lighter heading role, inset principles, internal separators, and
  principle/practice hierarchy from PR #25.
- **Fix before v1.0:** no standalone visual defect.
- **Improve:** copy specificity through C05–C07 after Jonathan's input.

### Engineering Mindset

- **Keep:** larger narrative weight, ordered sequence, increased row rhythm,
  and the handoff to Projects.
- **Fix before v1.0:** no standalone visual defect.
- **Improve:** make the method personally earned through C08–C09; do not add an
  effect or new transition.

### Selected Projects

- **Keep:** featured/supporting hierarchy, honest scope boundary, branch
  relationship, and semantic evidence structure.
- **Fix before v1.0:** release-state copy through C10–C11.
- **Improve:** limited real project visuals (D03) and a copy-first density pass
  (D04).

### Experience

- **Keep:** right-side ownership, three connected tracks, and the visual
  emphasis on current software/testing direction.
- **Fix before v1.0:** factual grounding through C14–C15.
- **Improve:** reduce repeated evidence rhythm after the approved content pass;
  include Experience in the tablet composition check (D05).

### Continue

- **Keep:** semantic native links, GitHub/LinkedIn/Email order, restrained row
  treatment, closing line, and visible path continuation.
- **Fix before v1.0:** opportunity and contact accuracy through C18–C19.
- **Improve:** closing voice through C20.
- **Do not add:** a form, social wall, oversized CTA, or animated contact
  treatment.

## Responsive findings

### Desktop — 1440 × 1000

The full alternating composition is strong. Headings, nodes, connectors, and
path crossings remain legible. Large negative space supports the journey rather
than reading as missing content. Projects becomes substantially denser than
the opening chapters, but the left column retains a comfortable measure.

### Laptop — 1024 × 768

Arrival scales well and primary content remains readable. Project and
Experience widths remain usable. The direct `#about` defect is visible here:
Environment can be active behind the Threshold surface.

### Tablet — 768 × 1024

The Helix relationship remains understandable, but the desktop split creates
avoidable wrapping in the two evidence-heavy chapters. This is the main
responsive composition opportunity (D05). Direct `#about` access also showed
the Threshold coverage defect.

### Mobile — 390 × 844

The static document flow is coherent. The laptop, chapter order, vertical
Helix, contact routes, and final continuation remain readable without desktop
camera treatment. Project and Experience body copy is dense but accessible;
the primary issue is reading fatigue, not overflow or hidden content. Direct
`#about` access works in the static flow.

## Accessibility and performance observations

- Semantic headings, lists, articles, landmarks, skip link, and native contact
  links remain intact.
- Mobile uses normal flow and native touch scrolling.
- No horizontal overflow was observed at the reviewed viewport sizes.
- No browser console warning or error was observed during the review.
- The production build remains statically generated.
- No recommendation requires a second motion owner, local ScrollTrigger,
  custom scrollbar, new animation, or new runtime dependency.

These observations do not replace the complete automated validation suite or a
final keyboard, reduced-motion, zoom, and cross-browser release check.

## Finite design path to v1.0

Complete these items in order:

1. **D01:** make direct Environment access visually reliable and add an
   outcome-based regression test.
2. **D02:** approve and implement one restrained, native-anchor chapter access
   pattern.
3. Complete the factual and voice decisions in the content review.
4. **D03:** add at most one verified visual evidence treatment per project.
5. **D04–D05:** run one shared density/tablet composition pass after copy is
   final.
6. **D06–D07:** remove nonessential Threshold and Arrival repetition.
7. Re-run the approved desktop, laptop, tablet, mobile, reduced-motion,
   keyboard, zoom, overflow, console, and static-build review.

Stop when those seven steps pass human review. D08–D09, new chapters, new
motion, 3D work, deeper routes, a CV, and deployment polish are not part of the
v1.0 design gate.
