# Story Before Scroll

## Review boundary

This review covers the static reading relationship between Environment,
Engineering Mindset, and the opening of Selected Projects. It begins from
merged PR #24 at `38d0435749d630ac6a3e770222670539ce918a0a`.

Content, chapter order, chapter pacing roles, `JourneyMotion`, the laptop
threshold, Helix geometry, atmospheric effects, Projects content, and all later
chapters remain unchanged.

## Narrative responsibility

The experience architecture gives the first three workspace moments different
jobs:

- **Environment / Orientation** establishes a light, human frame for how
  Jonathan learns and works.
- **Engineering Mindset** turns that frame into a deliberate method.
- **Selected Projects** tests that method against concrete work.

The static composition should make that escalation understandable before
scroll-driven state is applied.

## Baseline findings

The chapter order and alternating Helix placement are already clear. Content is
readable, semantic, restrained, and connected to the path.

The main limitation is repetition. Environment and Engineering Mindset use the
same large heading, introduction, bordered list, row spacing, item hierarchy,
and content width. Environment therefore reads as the first method list rather
than a lighter orientation, while Engineering can feel like another equivalent
section instead of the point where the story deepens.

The Engineering-to-Projects handoff is stronger because the existing
concluding sentence creates a visible premise above the next chapter. The
Environment-to-Engineering handoff relies almost entirely on alternating
placement and the Helix path.

[Baseline evidence](media/story-before-scroll/before) records desktop, compact
desktop, tablet, mobile, and both chapter boundaries.

## Intended correction

Create hierarchy between the chapters without changing their information:

1. Let Environment introduce a broad way of working.
2. Treat its three principles as supporting observations rather than a formal
   process.
3. Let Engineering become the first explicit sequence.
4. Give the existing Engineering handoff enough separation to turn Projects
   into the answer to its closing thought.

This is a static reading correction. Chapter spans, active-state timing, and
scroll behaviour remain unchanged.

## Visual decisions

### Environment heading

The Environment heading is slightly smaller than the Engineering heading on
wide desktop, with a wider measure that preserves its intentional three-line
shape.

**Why:** Orientation should establish the setting without feeling like the
first climax. The wider measure prevents the reduced size from making the
heading taller or more fragmented.

### Environment principle alignment

The principle list is inset toward the Helix on wide screens. It returns to the
chapter's normal text edge on mobile.

**Why:** The heading and introduction remain the chapter's primary statement.
The principles now read as supporting evidence that moves the visitor toward
the central journey rather than as a second section header.

### Environment separators

The list no longer begins with a full-width top rule. Fine separators exist
only between the three principles.

**Why:** Removing the opening boundary makes the list feel connected to the
introduction. Keeping internal separators preserves scanability without
turning the chapter into an unstructured paragraph.

### “How I work” evidence

Each existing practice statement receives a small inset and a fine left rule.
Its copy, type role, and order are unchanged.

**Why:** The visual relationship now reads as principle first, concrete
practice second. This helps explain why Environment exists without adding
explanatory copy.

### Engineering sequence

Engineering keeps the full content edge, top boundary, and ordered-list
structure. The gap before the sequence, index column, and row spacing increase
slightly.

**Why:** The chapter should feel more methodical and sustain deeper focus. Its
four steps now read as the deliberate progression promised by the preceding
Environment observations.

### Engineering-to-Projects handoff

The existing handoff sentence receives more space above it and a slightly
stronger text inset.

**Why:** The sentence is the narrative hinge: the method has been explained,
and Projects will now test it. More separation gives it the role of a
conclusion rather than a fifth list row.

### What did not change

- No visitor-facing copy changed.
- No chapter span, pacing role, or motion threshold changed.
- No Helix rail, node, connector, crossing, branch, or atmosphere changed.
- No new divider, effect, animation, dependency, or decorative element was
  added.
- Projects and every later chapter remain structurally and visually unchanged.

## Responsive review

- **Wide desktop:** receives the full hierarchy difference: smaller Environment
  heading, inset principles, open list beginning, and full-width Engineering
  sequence.
- **Compact desktop and tablet:** reduce the Environment inset so the supporting
  column does not become cramped.
- **Mobile:** returns the Environment list to normal document alignment while
  preserving the principle/practice hierarchy and separators. Semantic order
  remains Environment, Engineering, Projects.

No reviewed viewport gained horizontal overflow. Mobile retains normal document
flow and no pin spacer.

## Accessibility and performance

The implementation changes two presentational class assignments and CSS only.
Heading levels, list semantics, landmarks, content order, focus behaviour, and
accessible names are unchanged.

There is no new JavaScript, DOM element, event listener, animation, dependency,
asset, or runtime layout measurement. The route remains statically generated,
and the existing single `JourneyMotion` owner remains unchanged.

## Before and after

- [Before](media/story-before-scroll/before)
- [After](media/story-before-scroll/after)

Both sets use matching scroll positions and include Environment,
Environment-to-Engineering, Engineering, Engineering-to-Projects, compact
desktop, tablet, and mobile frames.

## Recommendation

**Keep.** The chapters retain the same content and visual language, but no
longer carry equal narrative weight. Environment introduces a perspective,
Engineering formalises it, and the existing closing sentence points directly
to Projects.
