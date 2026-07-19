# Helix concept

This note defines the current boundary of the helix journey. It should be read with the [design system](design-system.md), [experience architecture](experience-architecture.md), and [technical architecture](architecture.md).

## Narrative purpose

The helix is the structural spine of the digital journey. It makes the relationship between chapters spatial: the visitor enters the workspace, follows one continuous path, pauses where an idea earns attention, and sees that the path continues.

The integrated graybox now proves the complete narrative route without presenting its content or visual composition as final:

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

## Graybox content boundary

Environment introduces the shared field. Engineering explains the quality mindset. Selected Projects establishes space for three future case studies: AI-Powered Test Engineer, CortexGrid, and Helix. Experience establishes three provisional areas for software development and testing studies, embedded systems and networking, and technical service and field troubleshooting. Continue provides one verified GitHub route and clearly labels LinkedIn and email as pending final content.

All nodes are stops along the path, not interactive controls. Provisional project summaries are deliberately non-interactive so the graybox does not imply case studies that do not yet exist. Final claims, outcomes, imagery, contact routes, and case-study interaction design require a later content milestone.

## Motion boundary

The scoped GSAP controller owns the entire progressive enhancement. One path timeline introduces the shared structure, while a local timeline at each stop coordinates node emphasis, connector reveal, and semantic content movement. The sequence is scrubbed, reversible, and driven by native scrolling. It animates transforms and opacity only and performs no React state updates per frame.

Desktop shows the complete alternating node-to-content relationship. Tablet reduces horizontal separation. Mobile places a simple vertical path beside content in normal flow, with shorter travel and no journey pinning. Reduced-motion visitors receive the complete static path and every semantic chapter with no camera movement, journey timeline, or pinning.

## Intentionally deferred

- helix navigation, direct manipulation, or clickable node controls;
- real project case studies, imagery, evidence, and interactions;
- final Experience claims, outcomes, and contact content;
- chapter-specific interaction patterns beyond shared journey progression;
- final spacing, art direction, and visual polish;
- Three.js, React Three Fiber, WebGL, canvas, and external 3D assets;
- ambient rotation, continuous background motion, particles, and decorative effects.
