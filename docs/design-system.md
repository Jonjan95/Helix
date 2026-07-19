# Helix design system

This document is the primary visual and interaction reference for Helix. It defines the principles, tokens, patterns, and decision rules that future work should follow. The [design principles](design-principles.md) provide the higher-level product guardrails, while the [architecture guide](architecture.md) explains how the application is organised.

Treat this system as a durable constraint, not a catalogue of fashionable treatments. When a new visual or interaction decision is not covered here, begin with the philosophy and principles below. Extend the system only when a real content or usability need cannot be met with what already exists.

## Philosophy

Helix should feel engineered, intentional, calm, technical, reliable, curious, and premium through restraint.

- **Engineered** means structure is visible in the alignment, spacing, hierarchy, and behaviour. Details should feel measured rather than improvised.
- **Intentional** means every element has a reason to exist. Decoration must clarify context, reinforce the portfolio narrative, or support orientation.
- **Calm** means the interface leaves room for comprehension. It avoids visual noise, urgency, and effects that continuously demand attention.
- **Technical** means the visual language can reference systems, grids, instruments, and precise metadata without becoming a costume.
- **Reliable** means components behave consistently, content remains available, and interaction states are clear.
- **Curious** means the experience can reveal depth and reward exploration while maintaining orientation.
- **Premium through restraint** means confidence comes from proportion, typography, material detail, and finish—not from excess.

Helix communicates precision instead of decoration. Its visual authority should come from a small set of decisions applied consistently: controlled contrast, spacious composition, exact alignment, fine borders, and purposeful cyan signals. It should not be described or styled as futuristic, cyberpunk, AI-themed, neon, or flashy. Those labels encourage surface effects that would compete with the work and age quickly.

The intended impression is that the portfolio has been carefully constructed by someone who values software quality and user experience. The system should make that care visible before any advanced motion is added.

## Design principles

### Every visual decision must support clarity

Hierarchy, spacing, colour, and composition should help a visitor understand where they are, what matters, and what they can do next. If an element does not improve comprehension or reinforce the narrative, remove it.

### Motion exists to guide attention

Motion may explain spatial relationships, preserve context, or direct focus. It must never delay access to content or become the content itself.

### Restraint creates confidence

Use fewer colours, fewer effects, and fewer competing focal points. A controlled system feels more deliberate than a collection of individually impressive moments.

### Consistency is more important than novelty

Reuse established spacing, typography, colour, borders, and interaction patterns. A new treatment must solve a real problem; novelty alone is not sufficient justification.

### Storytelling is prioritised over decoration

Helix is a guided portfolio, not a visual-effects showcase. Visual choices should support the progression from the physical laptop into Jonathan's digital journey and the substance of the work presented there.

### The static experience is the contract

Content order, meaning, navigation, and readability must work without animation. Enhanced presentations may build on that contract but may not replace it.

## Color system

The palette is intentionally narrow. Colour establishes hierarchy and state; it is not used to create spectacle.

| Role | Token | Value | Purpose |
| --- | --- | --- | --- |
| Background | `--color-background` | `#121416` | The primary page field. Its graphite tone reduces glare and gives warm text a stable, quiet foundation. |
| Surface | `--color-surface` | `#191c1f` | Groups content or defines a component plane without creating a strong card effect. |
| Raised surface | `--color-surface-raised` | `#202428` | Separates a clearly elevated or nested layer when a border alone is insufficient. Use sparingly. |
| Borders | `--color-line` | `#343a3f` | Defines structure, boundaries, grids, and technical detail at low visual weight. |
| Primary text | `--color-text` | `#f4f0e8` | Carries headings and essential body content. The warm white avoids the harshness of pure white. |
| Secondary text | `--color-muted` | `#a8adb2` | Supports metadata, secondary explanations, and low-priority labels while remaining readable. |
| Accent | `--color-accent` | `#69d3e7` | Signals focus, current state, key technical markers, and carefully selected points of emphasis. |

Component-specific graphite values may be derived for physical illustration details, such as the laptop bezel or screen. These values must remain neutral, close to the established surfaces, and subordinate to content. They do not create new semantic colour roles.

### Cyan accent usage

Use cyan for:

- keyboard focus outlines;
- active or current-state markers;
- short rules, status dots, indices, and compact metadata accents;
- one deliberate point of emphasis within a composition;
- interactive feedback where the state is also communicated by text, shape, or position.

Do not use cyan for:

- large backgrounds or full-page colour fields;
- long passages of body text;
- multiple competing highlights in the same view;
- decorative glow, ambient lighting, or gradients intended only to create mood;
- success, warning, and error states without an explicit semantic system;
- replacing clear labels or accessible interaction states.

Do not add another brand accent colour. If a future feature requires semantic status colours, define them as a separate, accessible feedback system rather than expanding the visual brand palette casually.

## Typography

Typography should feel spacious, direct, and technically precise without becoming sterile.

### Font families

- The primary family is `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- The technical metadata family is `"SFMono-Regular", Consolas, "Liberation Mono", monospace`.

The sans-serif stack is used for identity, headings, body copy, navigation, and controls. The monospace stack is reserved for concise system-like information: indices, status labels, eyebrows, coordinates, and technical annotations. It should not be used for paragraphs or as a general technology motif.

Do not introduce additional font families unless a documented content need cannot be served by these two roles. A new font must improve readability or meaning, not merely change the mood.

### Weight

- **400**: default body copy and secondary information.
- **430–450**: large headings and introductory statements when the active font supports variable weights; use the closest regular or medium fallback otherwise.
- **500–550**: identity display text and compact emphasis.
- **700**: functional emphasis such as skip links or labels that require strong visibility. Use rarely in editorial content.

Large type should gain authority from scale and spacing, not heavy weight.

### Hierarchy

| Level | Typical role | Guidance |
| --- | --- | --- |
| Identity display | Name or singular hero identity | Largest type in the view. Tight line-height and tracking are acceptable when readability is preserved. |
| Section heading | About, Experience, Skills, Projects, Contact | Visually dominant within its section, with restrained weight and clear separation from supporting copy. |
| Introductory statement | Primary section proposition | Approximately `20–32px`, limited measure, and calmer than the identity display. |
| Lead body | Section summary or project premise | Approximately `20–32px` depending on context; use only once per content group. |
| Body | Explanations and narrative content | Usually `16px` with a line-height near `1.6`. Avoid long lines. |
| Supporting text | Secondary explanations | Approximately `14–16px`, using the muted colour without reducing readability. |
| Metadata | Eyebrows, indices, status labels | Approximately `10–12px`, monospace, increased tracking, and usually uppercase. Keep labels concise. |

Semantic heading levels and visual size are separate decisions. Preserve a logical HTML outline even when a heading is intentionally styled smaller or larger.

### Readability

- Keep body text near `45–75` characters per line.
- Use generous line-height for paragraphs and tighter line-height only for large display type.
- Avoid centre-aligned paragraphs beyond short hero or introductory copy.
- Use negative letter spacing only on large sans-serif headings. Never compress body or metadata text.
- Avoid isolated final words, awkward line breaks, and headings that compete with the primary focal point.
- Spacing should create hierarchy before weight or colour is increased.

## Spacing system

Helix uses an 8px base spacing system. The scale establishes rhythm across layout, components, and content.

| Name | Value | Recommended use |
| --- | --- | --- |
| `space-1` | `8px` | Tight inline gaps, icon-to-label spacing, compact metadata. |
| `space-2` | `16px` | Standard component padding, related text spacing, compact control gaps. |
| `space-3` | `24px` | Comfortable component padding, small content groups, mobile page gutters. |
| `space-4` | `32px` | Separation between related component regions or heading groups. |
| `space-6` | `48px` | Distinct content groups, hero-to-copy spacing, compact section boundaries. |
| `space-8` | `64px` | Major desktop content blocks and standard section rhythm. |
| `space-12` | `96px` | Large section boundaries and intentional breathing room. |
| `space-16` | `128px` | Rare large-screen composition spacing when content density remains low. |

A `4px` half-step is allowed for optical correction, hairline-adjacent spacing, and compact technical details. It is not a parallel spacing system.

Responsive spacing may use `clamp()` to move fluidly between scale values. Prefer endpoints from the scale, and choose the smaller value because the composition changes—not merely because the viewport is smaller.

Avoid arbitrary one-off spacing. When an exception is necessary, document the optical or content reason in the component rather than silently creating a new token.

## Border radius

Helix uses restrained radii that preserve a precise, engineered silhouette.

| Name | Value | Recommended use |
| --- | --- | --- |
| Small | `4px` | Technical panels, compact fields, inner frames, and small controls. |
| Medium | `8px` | Buttons, cards, and standard interactive surfaces. |
| Large | `16px` | Major feature surfaces or physical objects such as the laptop display. |

Values above `16px` are exceptional and should represent a physical form or a clearly distinct container. Full pills are reserved for genuinely pill-shaped controls, tags, or status concepts—not default buttons and cards.

Helix avoids exaggerated rounded corners because they soften every surface equally and weaken the technical hierarchy. Shape should communicate the type and scale of an object, not apply a fashionable signature to unrelated components.

## Borders and elevation

Borders are the default method of separating surfaces.

- Use `1px` borders for cards, component boundaries, laptop details, dividers, and technical grid lines.
- Use `--color-line` for standard structure. Lower-opacity accent borders may mark a focused or narrative layer.
- Avoid stacking several border treatments around the same component unless each boundary describes a real layer.
- Dividers should organise content, not decorate empty space.

Elevation should remain subtle:

- Prefer a change in surface value plus a border before adding shadow.
- Use shadows only when an object must read as physically separated from the page, as with the laptop.
- Shadows should be broad, dark, and low-opacity. They should not glow or introduce coloured light.
- Avoid multi-layered card shadows and floating surfaces without an interaction or spatial reason.

Borders are preferred because they communicate structure without suggesting unnecessary depth. This keeps the page calm and allows future camera movement to carry the meaningful sense of space.

## Layout principles

### Content width

- Standard content is constrained by `--content-width: 76rem`.
- Editorial copy uses a narrower measure within that container.
- A hero visual may use a wider stage when it remains centred and cannot create horizontal overflow.
- Page gutters are fluid, with a mobile target near `24px` and a large-screen maximum near `72px`.

### Vertical rhythm

Major sections need enough vertical space to feel like distinct narrative stops. Use the spacing scale to group headings, lead text, details, and actions. A section should not rely on viewport height alone; content must remain complete and readable when text wraps or zoom increases.

### Grid philosophy

Grids should make alignment legible without making every layout look identical.

- Align primary content to a small number of durable vertical axes.
- Use asymmetric columns when they improve hierarchy, such as section indices beside content.
- Technical grid lines are contextual details, not a universal background texture.
- Preserve whitespace as part of the grid. Do not fill every available column.

### Alignment

- Default long-form content to left alignment.
- Centre-align only short, singular statements or focal compositions such as the hero.
- Align metadata, headings, and body copy deliberately; near-alignment looks accidental.
- Maintain consistent optical edges even when glyphs or physical illustrations need small corrections.

### Responsive behaviour

Responsive design preserves hierarchy and composition rather than proportionally shrinking a desktop arrangement. Components may change alignment, spacing, content density, or visual treatment when the device changes. Content order and meaning must remain consistent.

## Component philosophy

### Buttons

- Use a button for an action and a link for navigation.
- Labels should describe the outcome, not use vague language such as “Click here.”
- Default buttons should be quiet surfaces with clear borders and text. Reserve stronger accent treatment for the single highest-priority action in a context.
- Hover, active, focus, disabled, and loading states must be distinguishable without relying on colour alone.
- Keep corner radius, padding, and typography consistent across button variants.

### Cards

- A card groups content that belongs together and can be understood as one unit.
- Use surface contrast and a fine border before shadow.
- Keep the entire card hierarchy clear even when imagery is unavailable.
- Do not place every text block in a card. Open layout is preferred when no grouping boundary is needed.
- Interactive cards require an obvious destination, complete keyboard behaviour, and a visible focus state.

### Section headers

- Combine a concise monospace eyebrow or index with one clear heading when the metadata improves orientation.
- The heading remains the semantic and visual anchor.
- Supporting text should explain the section's purpose rather than repeat the heading.
- Keep section-header patterns consistent enough that visitors learn the document rhythm.

### Navigation

- Navigation should prioritise orientation and direct access to portfolio content.
- Labels must be plain, stable, and understandable outside the animated journey.
- The current section may use cyan as one reinforcing signal, but must also have a non-colour indication.
- Navigation remains keyboard accessible and usable with motion disabled.
- Mobile navigation may use a different composition, but it must not hide essential destinations behind ambiguous controls.

### Hero

- The laptop is the primary visual portal and Jonathan's identity is the primary content.
- Supporting introduction copy should reinforce the laptop, not compete with it.
- The hero must establish who the portfolio belongs to, the professional direction, and the invitation to continue.
- It must remain understandable as static semantic HTML.
- The laptop must remain recognisable and contained across viewports. Do not sacrifice content readability to preserve identical proportions.

### Project cards

- Project cards should introduce a meaningful story: problem, role, implementation, testing or validation, and outcome.
- Lead with the decision or result that makes the project worth exploring, not a generic thumbnail.
- Metadata should be concise and comparable across projects.
- Images support evidence and context; they are not decorative cover art.
- Do not imply outcomes, responsibilities, or expertise that the final case study cannot support.

### Status labels

- Use status labels for compact, current information such as availability, phase, or system state.
- Use the monospace metadata style and keep wording short.
- A cyan dot may reinforce status, but text must carry the meaning.
- Do not use status labels as decorative badges or create many competing labels.

## Motion language

Motion is a future enhancement, not a requirement for understanding Helix. It should make the spatial story easier to follow and the interface feel physically coherent.

### Principles

- Motion guides attention.
- Motion always has a purpose that can be stated in one sentence.
- Movement should feel controlled, physical, and connected to the visitor's input.
- Camera movement should feel smooth and preserve spatial orientation.
- Scrolling should feel continuous; transitions should not create disconnected scenes.
- Elements should accelerate and settle naturally without calling attention to the easing itself.
- Prefer coordinated movement of a few meaningful layers over many independent effects.
- Opacity may support spatial movement but should not be the only explanation of a major transition.

Do not use:

- bouncing;
- exaggerated elasticity or spring overshoot;
- repeated pulsing, floating, or idle motion;
- motion that blocks reading or navigation;
- dramatic parallax without narrative value;
- long sequences that replay during ordinary navigation;
- scroll hijacking that breaks expected input or browser behaviour.

### Easing philosophy

- **Micro interactions:** use a direct ease-out curve that responds immediately and settles cleanly. A curve near `cubic-bezier(0.2, 0, 0, 1)` is a suitable starting point.
- **Section transitions:** use a balanced ease-in-out curve that makes departure and arrival feel connected. A curve near `cubic-bezier(0.65, 0, 0.35, 1)` is a suitable starting point.
- **Camera and spatial movement:** favour smooth acceleration and a long, controlled deceleration. A curve near `cubic-bezier(0.22, 1, 0.36, 1)` can guide prototypes, but the final movement must be judged in context.

Easing values are starting constraints, not permission to tune every component differently. Reuse a small motion-token set when implementation begins.

### Duration ranges

| Motion type | Preferred range | Purpose |
| --- | --- | --- |
| Micro interaction | `120–200ms` | Focus, hover, pressed state, compact disclosure feedback. |
| Component or section transition | `400–700ms` | Reveal hierarchy or connect adjacent narrative states. |
| Camera movement | `900–1600ms` when time-based | Establish spatial travel without abrupt acceleration. Scroll-linked movement should use an equivalent controlled pace rather than a fixed spectacle. |

Duration should scale with distance and complexity. Short movements should not feel slow; long spatial changes should not feel abrupt.

### Reduced motion

Reduced motion is a designed route through the same story, not a disabled version of the site.

- Replace camera travel with direct state changes or simple cuts.
- Remove continuous, decorative, and depth-based motion.
- Keep essential state feedback immediate and minimal.
- Preserve content order, focus order, navigation, and context.
- Never require a motion sequence to reveal essential content.

Do not implement motion until its purpose, static state, reduced-motion alternative, performance budget, and test strategy are defined.

## Accessibility

### Keyboard navigation

- Every interactive element must be reachable and operable with a keyboard.
- Focus order follows the visual and semantic reading order.
- Skip links remain available where repeated navigation or immersive presentation would delay access to content.
- Avoid custom keyboard interactions when native HTML behaviour already solves the problem.

### Focus states

- Use a clearly visible `2px` cyan outline with sufficient offset as the default focus treatment.
- Do not remove focus outlines without providing an equally visible replacement.
- Focus must remain visible against every surface and must not be clipped by overflow.

### Reduced motion

- Respect `prefers-reduced-motion` at both CSS and JavaScript levels.
- Test reduced-motion behaviour as a complete user journey.
- Motion-sensitive visitors must receive the same information and navigation choices.

### Semantic HTML

- Use landmarks, headings, sections, lists, links, and buttons according to meaning.
- Keep the heading hierarchy logical and give labelled sections stable anchors.
- Add ARIA only when native semantics are insufficient.
- Decorative technical details should be hidden from assistive technology.

### Contrast

- Text and interactive states must meet WCAG AA contrast requirements.
- Secondary text may be quieter but must remain readable at its rendered size.
- Do not use the cyan accent on a colour field without checking the actual contrast pair.
- Never rely on colour alone to communicate state.

### Screen reader support

- Reading order must make sense without the visual composition.
- Interactive labels should describe purpose and destination.
- Announce dynamic changes only when they affect the user's task or context.
- Future immersive layers must not duplicate or obscure the semantic content source.

## Responsive philosophy

### Desktop

Desktop supports the most spacious, cinematic composition. Use the wider stage to establish hierarchy, physical scale, and deliberate whitespace. Do not fill space simply because it is available.

### Tablet

Tablet is a distinct composition, not an intermediate accident. Preserve the laptop silhouette, readable metadata, and comfortable content measure. Reduce empty space and column complexity before reducing essential text.

### Mobile

Mobile prioritises identity, reading order, and direct progress through the content. Recompose wide or asymmetric layouts into a clear vertical flow. Technical details may simplify when they do not carry meaning, but primary content and orientation remain available.

Across all sizes:

- prevent page-level horizontal overflow;
- preserve touch targets and keyboard focus visibility;
- allow text wrapping and browser zoom without overlap;
- use content-driven breakpoints where the composition fails, not device labels alone;
- test representative widths and the difficult widths between them;
- permit desktop and mobile to look different when they communicate the same hierarchy more clearly.

## Future visual direction

Future milestones may explore a smooth camera move toward the laptop, a transition through its screen, entry into a digital portfolio world, and a helix-like path connecting portfolio sections.

These ideas remain conceptual. Their value depends on whether they improve orientation, narrative continuity, curiosity, and recall. The laptop-to-screen transition should feel like entering a coherent space rather than switching to an unrelated visual scene. A future helix should organise the journey and make relationships legible; it should not exist merely as a technical demonstration.

Any future direction must preserve the static content contract, responsive composition, reduced-motion route, performance standards, and semantic source of truth established today.

## Maintaining the system

Before adding or changing a visual pattern, ask:

1. What clarity, orientation, or storytelling problem does this solve?
2. Can an existing token or component pattern solve it?
3. Does it preserve the static and reduced-motion experiences?
4. Is it consistent across relevant viewports and input methods?
5. Can the decision be explained without referring to a visual trend?

When the system needs to evolve, update this document in the same pull request as the implementation. Record the reason for the change, not only the new value. Avoid documenting one-off exceptions as if they were reusable patterns.
