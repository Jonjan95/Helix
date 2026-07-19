# Helix concept

This note defines the current boundary of the helix journey. It should be read with the [design system](design-system.md), [experience architecture](experience-architecture.md), and [technical architecture](architecture.md).

## Narrative purpose

The helix is the structural spine of the digital journey. It makes the relationship between chapters spatial: the visitor enters the workspace, follows one continuous path, pauses where an idea earns attention, and sees that the path continues.

Engineering Mindset is the first implemented stop. It proves one complete narrative pattern without committing every later chapter to a final composition:

`workspace → helix path → active node → Engineering content → continuing path`

The helix remains a narrative organiser rather than the premise of the portfolio. Semantic chapter order, readable content, and direct anchors remain the source of orientation.

## Integrated visual structure

The approved finite SVG strategy remains: two restrained rails, twelve crossbars, and six node positions rendered with normal browser technology. The former outer panel, raised surface, inner frame, and prototype telemetry have been removed. Orientation and Engineering now share one graphite grid so the rails enter from the workspace and continue beyond the first content stop.

Negative space, clipping, fine connection lines, and a limited cyan signal create depth and precision. The form should feel engineered and spatial rather than biological or decorative. It has no glow, continuous rotation, ambient loop, particle field, simulated physics, or dashboard treatment.

The SVG remains decorative, non-focusable, and hidden from assistive technology. Essential labels and prose never live exclusively inside it.

## Chapter attachment pattern

`HelixChapter` defines the smallest reusable attachment pattern:

- one configured node receives the active visual state;
- a restrained connector establishes the spatial relationship;
- semantic chapter content sits outside the SVG;
- a continuation cue shows that the stop is not the end of the journey;
- stable data attributes provide scoped motion and testing hooks.

The pattern is intentionally fixed rather than a generic page builder. A later chapter may reuse its responsibilities while changing side, spacing, or density to serve that content. Reuse should preserve narrative continuity, not produce identical cards along a rail.

## Engineering Mindset node

The Engineering stop explains Jonathan's approach through one grounded proposition: quality belongs throughout the build. Its provisional content connects clear requirements, testable behaviour, reliable implementation, proportionate complexity, feedback, and learning. It does not present proficiency ratings, a technology inventory, or unsupported expertise claims.

The active node is a stop along the path, not an interactive control. Future nodes remain visually quiet and expose no unfinished content.

## Motion boundary

The existing scoped GSAP controller owns the entire enhancement. One unpinned helix timeline coordinates forward travel, local node emphasis, connector reveal, Engineering content, and the continuing-path cue. The sequence is scrubbed, reversible, and driven by native scrolling. It animates transforms and opacity only and performs no React state updates per frame.

Desktop shows the complete node-to-content relationship. Tablet reduces horizontal separation. Mobile stacks the path and content in normal flow with shorter travel and no helix pinning. Reduced-motion visitors receive the complete static helix, active Engineering node, semantic content, and continuation cue with no helix timeline or camera movement.

## Intentionally deferred

- Selected Work, Proof, Future, and other node attachments;
- helix navigation, direct manipulation, or clickable node controls;
- project interactions and evidence reveals;
- animation owned by later chapters;
- the complete helix journey and final visual composition;
- Three.js, React Three Fiber, WebGL, canvas, and external 3D assets;
- ambient rotation, continuous background motion, particles, and decorative effects.
