# Helix concept

This note defines the boundary of the first helix prototype. It should be read with the [design system](design-system.md), [experience architecture](experience-architecture.md), and [technical architecture](architecture.md).

## Narrative purpose

The helix is a relationship map inside the digital workspace. It gives the visitor a first sense that the journey continues through connected ideas rather than through a conventional list of pages. It appears after Orientation has established place and identity, so the metaphor supports the story instead of becoming its premise.

At this stage, the structure makes one promise: the path continues inward. It does not explain projects, skills, or experience, and it does not replace the semantic chapter sequence.

## Visual structure

The prototype uses two restrained SVG rails, a finite set of crossbars, and six neutral node slots. Fine borders, graphite surfaces, warm white details, and one cyan rail connect it to the workspace without adding another visual language.

Depth comes from overlap, perspective, opacity, scale, and forward translation. The form should feel engineered and spatial rather than biological, decorative, or spectacular. It has no glow, continuous rotation, ambient loop, particle field, or simulated physics.

The SVG is intentionally decorative. The document's headings and chapters remain the source of meaning for assistive technology and for any presentation without motion.

## Future chapter relationships

The node slots provide stable conceptual attachment points for Orientation, Engineering Mindset, Selected Work, Proof, Future, and continuation beyond the current prototype. They do not currently navigate, reveal content, or imply a final one-to-one layout.

A future milestone may connect chapter introductions or evidence to these points only if doing so improves orientation and makes relationships easier to understand. The semantic content must remain in normal document flow, and a node must never become the only way to reach essential information.

## Motion boundary

The reveal extends the existing journey motion boundary. Native scrolling carries the visitor from the workspace into the structure; the scene then resolves through controlled translation and modest depth separation. The motion is reversible and unpinned, and it animates only transforms and opacity.

Desktop receives the fullest spatial treatment. Tablet reduces travel and depth. Mobile retains the structure in normal flow with a short, restrained reveal. Reduced-motion visitors receive the complete static structure with no helix timeline, camera movement, or pinned sequence.

## Intentionally deferred

- final chapter content and labels attached to nodes;
- helix navigation or direct manipulation;
- project interactions and evidence reveals;
- motion for Engineering Mindset or later chapters;
- a complete helix journey or final visual composition;
- Three.js, React Three Fiber, WebGL, and external 3D assets;
- ambient rotation, continuous background motion, particles, and decorative effects.
