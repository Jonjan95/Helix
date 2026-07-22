# Helix concept

This note defines the current boundary of the helix journey. It should be read with the [design system](design-system.md), [experience architecture](experience-architecture.md), and [technical architecture](architecture.md).

## Narrative purpose

The helix is the structural spine of the digital journey. It makes the relationship between chapters spatial: the visitor enters the workspace, follows one continuous path, pauses where an idea earns attention, and sees that the path continues.

The integrated journey now proves the complete narrative route without presenting every chapter or the visual composition as final:

`workspace → Environment → Engineering → Selected Projects → Experience → Continue`

The helix remains a narrative organiser rather than the premise of the portfolio. Semantic chapter order, readable content, and direct anchors remain the source of orientation.

## Integrated visual structure

The approved finite SVG strategy now spans the full journey: two restrained rails, repeated crossbars, and five stop positions rendered with normal browser technology. Every chapter shares one graphite grid so the path enters from the workspace, crosses each stop, and continues beyond Contact without resetting into a new panel.

Negative space, clipping, fine connection lines, and a limited cyan signal create depth and precision. The form should feel engineered and spatial rather than biological or decorative. It has no glow, continuous rotation, ambient loop, particle field, simulated physics, or dashboard treatment.

The SVG remains decorative, non-focusable, and hidden from assistive technology. Essential labels and prose never live exclusively inside it.

## Chapter attachment pattern

`HelixChapter` defines the smallest reusable attachment pattern:

- one configured node receives the local active visual state;
- a restrained connector establishes the spatial relationship;
- semantic chapter content sits outside the SVG;
- the shared path remains visible before and after the stop;
- stable data attributes provide scoped motion and testing hooks.

The pattern is intentionally bounded rather than a generic page builder. Stops alternate around the path and can change spacing or density to serve their content. Reuse preserves narrative continuity without producing identical cards along a rail.

## Current content boundary

Environment introduces the shared field. Engineering explains the quality mindset. Selected Projects is the first content-complete destination: AI-Powered Test Engineer leads the chapter, with CortexGrid and Helix as supporting engineering evidence. Experience still establishes three provisional areas for software development and testing studies, embedded systems and networking, and technical service and field troubleshooting. Continue provides one verified GitHub route and clearly labels LinkedIn and email as pending final content.

All nodes remain stops along the path, not interactive controls. The project destination uses normal repository links, but does not imply detail routes, galleries, production usage, or outcomes that do not exist. Final Experience claims, personal outcomes, imagery, contact routes, and case-study interaction design require later content milestones.

## Selected Projects destination

The chapter demonstrates the design system through hierarchy rather than three matching cards. AI-Powered Test Engineer receives the longest problem, approach, technical, and quality narrative. CortexGrid and Helix use the same semantic evidence vocabulary with less visual weight. Fine separators, numbered metadata, restrained status labels, and one consistent link treatment keep all three attached to the existing left-side Projects stop.

Project claims are a maintained snapshot of the public source repositories, not live repository data. Status and boundary copy distinguish implemented workflows from prototypes, active development, and planned work. Every public repository receives a descriptive HTTPS link; a future unavailable or private project must be presented as text, never as a placeholder link.

The expanded content increases the chapter's natural document height, so the existing Projects pacing profile has room to remain primary through the final supporting project. Desktop uses the available side of the path for a featured/supporting hierarchy, tablet simplifies the internal grids, and mobile stacks the same semantic articles beside the vertical path. Reduced motion exposes the identical hierarchy statically and introduces no project-specific animation.

The visual review evidence is stored in [`docs/media/selected-projects`](media/selected-projects). It records the forward desktop handoffs, featured and supporting evidence, tablet and mobile compositions, repository-link target review, and the complete reduced-motion chapter.

## Motion boundary

The scoped GSAP controller owns the entire progressive enhancement. One path timeline introduces the shared structure, while a local timeline at each stop coordinates node emphasis, connector reveal, and semantic content movement. The sequence is scrubbed, reversible, and driven by native scrolling. It animates transforms and opacity only and performs no React state updates per frame.

Desktop shows the complete alternating node-to-content relationship. Tablet reduces horizontal separation. Mobile places a simple vertical path beside content in normal flow, with shorter travel and no journey pinning. Reduced-motion visitors receive the complete static path and every semantic chapter with no camera movement, journey timeline, or pinning.

## Calibration audit

The complete graybox establishes the correct order and shared path, but its first integrated review identified several pacing issues that should be resolved before visual polish:

- Environment is reported as active while the visitor is still at the laptop, before its node becomes a visible destination.
- The workspace threshold, journey marker, and first path geometry create a visible seam instead of one spatial handoff.
- The current future, active, and past states change abruptly and do not describe approach or departure.
- Initial hash navigation can resolve before laptop pin geometry is established, leaving direct chapter links at the wrong scroll position.
- Tablet leaves too much path-only space before Environment and weakens the node-to-content relationship.
- Continue has less settling distance than the middle chapters, particularly when travelling backward from the end.

The calibration preserves the single motion owner and semantic structure while introducing a five-state chapter model, per-chapter pacing profiles, clearer active-node hierarchy, earlier path continuity, reliable initial-anchor restoration, and responsive spacing adjustments. These changes refine the existing system; they do not introduce final content or a new helix design.

## Calibrated journey behavior

The calibration resolves those issues without changing the approved journey architecture. Before the workspace handoff, no chapter is presented as active. The laptop screen frame recedes as the workspace layer becomes dominant, and a short centreline carries the screen geometry into the shared path. Environment can then approach before it becomes the first active destination.

Each stop now moves through five explicit visual states: `upcoming`, `approaching`, `active`, `departing`, and `passed`. The active stop receives the clearest cyan node and full content emphasis. Adjacent stops retain enough presence to explain direction, while distant stops are quieter. These states are orientation signals rather than content states; the prose and links remain readable in the document regardless of motion.

Pacing is configured by chapter role instead of one universal trigger range. Environment settles quickly after entry, Engineering and Selected Projects receive longer reading spans, Experience returns to a standard cadence, and Continue has additional space to resolve the route. Desktop retains the complete spatial sequence, tablet shortens travel and separation, and mobile keeps an unpinned vertical flow with minimal movement. Reduced motion bypasses the five-state sequence and exposes every stop statically.

Direct chapter fragments are restored only after ScrollTrigger has established the final document geometry. The target is placed inside its stable focus range instead of at an arbitrary pinned offset. This keeps refreshes and links to `#about`, `#skills`, `#projects`, `#experience`, and `#contact` predictable across desktop and mobile.

The visual review evidence is stored in [`docs/media/journey-calibration`](media/journey-calibration). It includes the desktop handoff and every focused stop, a reverse transition, tablet and mobile compositions, and the complete reduced-motion route. These images record the calibrated graybox; they are not final art-direction references.

## Intentionally deferred

- helix navigation, direct manipulation, or clickable node controls;
- project detail routes, imagery, galleries, modals, and case-study interactions;
- final Experience claims, outcomes, and contact content;
- chapter-specific interaction patterns beyond shared journey progression;
- final spacing, art direction, and visual polish;
- Three.js, React Three Fiber, WebGL, canvas, and external 3D assets;
- ambient rotation, continuous background motion, particles, and decorative effects.
