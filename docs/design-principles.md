# Design principles

These principles translate the project vision into practical design constraints.

## Animation supports storytelling

Motion must explain a transition, establish spatial context, guide attention, or reward curiosity. An effect without a clear narrative or UX purpose does not belong in Helix.

## Clarity before spectacle

The content hierarchy, navigation, and meaning must work before visual effects are applied. The static page is the baseline experience, not a fallback that receives less care.

## Accessibility is not optional

Use semantic HTML, logical heading structure, visible focus states, sufficient contrast, keyboard-accessible controls, and meaningful labels. Motion-sensitive visitors must receive a complete and understandable experience through `prefers-reduced-motion` support.

## Performance before unnecessary visual effects

Visual ambition does not justify slow interaction or excessive payloads. Prefer browser-native layout and CSS, measure the cost of new effects, and introduce heavier rendering technology only if it creates clear value.

## Responsive design is intentional, not identical

Desktop and mobile can use different compositions when their space and interaction models demand it. Preserve the same content and narrative meaning while choosing the clearest presentation for each device.

## A restrained visual system

Graphite surfaces, warm white text, a single cyan accent, spacious type, and fine technical details create the foundation. Gradients, glow, and decoration should remain rare and purposeful.

## Content remains primary

Portfolio sections must remain readable, linkable, and available as semantic document content. Future animated layers should enhance this foundation instead of replacing it.
