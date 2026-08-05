# Arrival Director

The Arrival Director is an isolated visual authoring tool at
`/lab/machine/director`. It lets a human reviewer define, compare, and export
the six poses that may later become the production Arrival sequence. It is not
an animation generator and it does not decide what the final composition
should be.

The tool exists because camera and machine composition are visual decisions.
Expressing those decisions as named poses gives a reviewer direct control over
framing while keeping production code unchanged until the direction is
explicitly approved.

## Boundaries

- The director reuses the Helix Machine model and the measured scene assembly
  already proven in Machine Lab.
- The homepage does not import the director and its current Arrival behavior is
  unchanged.
- The route is `noindex`, is covered by the `/lab/` robots exclusion, and is not
  included in the sitemap.
- Poses are stored in `localStorage` under a versioned key. No pose database,
  network request, or production configuration is involved.
- The six committed slots contain the same neutral baseline. Their names
  describe review checkpoints, but their values are not proposed designs.
- Exported, reviewer-authored JSON must not be committed as a production
  decision without a separate human approval and integration task.

## Opening the tool

Start the development server:

```bash
npm run dev
```

Then open `http://localhost:3000/lab/machine/director`.

The Machine Lab remains available at `http://localhost:3000/lab/machine` for
deterministic sequence playback. The director is the pose-authoring surface;
Machine Lab remains the motion-tuning surface.

## Controls

Every numeric parameter has both a range input for visual adjustment and a
number input for exact entry. Editing a control changes only the unsaved
working pose. The saved pose and browser storage remain unchanged until
**Save pose locally** is used.

The director exposes:

- camera position X, Y, and Z;
- camera target X, Y, and Z;
- camera field of view;
- machine position X, Y, and Z;
- machine scale;
- lid angle in radians, where `0` is open and the upper end of the control is
  nearly closed;
- screen luminance from dark (`0`) to powered (`1`);
- semantic identity X and Y offsets;
- semantic identity scale;
- the five approved viewport presets.

The director never interpolates, optimizes, or changes these values on behalf
of the reviewer. Selecting a viewport changes only the review frame.

## Defining the six poses

Work through the slots in narrative order. At every slot, check the active
viewport and at least one neighboring viewport before saving.

1. **closed-dark** — establish the opening silhouette with a dark display.
2. **opening-midpoint** — define a mechanically legible intermediate lid pose.
3. **open-hero** — establish the readable open-machine composition.
4. **identity-hold** — place the powered display and semantic identity for its
   principal reading moment.
5. **front-facing** — define the composition after the camera has aligned with
   the screen plane.
6. **threshold-entry** — define the final frame before the existing threshold
   takes over.

For each slot:

1. Select the pose from **Active pose**.
2. Adjust only the values needed for that composition.
3. Enable guides temporarily to check alignment and text safety.
4. Disable guides and judge the unassisted frame.
5. Review at the intended viewport presets.
6. Choose **Save pose locally** only when the frame represents the reviewer’s
   current decision.

**Reset** discards unsaved changes and returns to the last locally saved value.
**Duplicate pose** creates a new locally saved copy for exploration. Rename and
delete actions affect only the browser-local library.

## Visual guides

All guides are disabled by default so they cannot be mistaken for part of the
design. They can be enabled independently:

- viewport center;
- thirds grid;
- projected screen bounds;
- screen center;
- camera target;
- safe text region.

The viewport guides describe the chosen review frame. Screen guides follow the
runtime display anchor. They are diagnostic references, not rules that every
approved pose must mechanically center.

## Comparing poses

Choose two saved poses and select **Compare two saved poses**. The director
shows both saved states in the same viewport preset without modifying either
pose. Return to the editor preview before changing the working pose.

Comparison uses saved values intentionally. Save a working pose first when its
latest adjustments should be included in the comparison.

## Import and export

**Copy current pose as JSON** copies the unsaved working pose. **Copy all poses
as JSON** copies a versioned collection of saved poses. If clipboard permission
is unavailable, the JSON is placed in the import/export text field instead.

The import field accepts:

- one valid pose object;
- an array of pose objects; or
- the versioned collection produced by **Copy all poses as JSON**.

Imported values are validated against the director’s explicit ranges. Invalid
or out-of-range input is rejected rather than silently changed. Imported IDs
that already exist receive a local import suffix so an existing pose is not
overwritten.

To hand off an approved review:

1. Confirm the six intended pose names and saved values.
2. Select **Copy all poses as JSON**.
3. Store the export as review evidence outside production source code.
4. Record which viewport was used for each approval.
5. Open a separate integration task that explicitly maps approved poses into a
   continuous motion function.

An export is evidence of a human decision. It is not, by itself, production
animation configuration.

## Accessibility and reduced motion

The identity remains semantic HTML rendered outside WebGL. Native form
controls, labels, fieldsets, buttons, status feedback, focus styles, and
document order make the authoring surface keyboard usable. Guides are
decorative and hidden from assistive technology.

The director contains no pose animation. With `prefers-reduced-motion: reduce`,
the selected pose remains a static, fully controllable scene and the page
records the reduced-motion state for validation. No pinning or motion-only
content is introduced.

## Fallback and isolation

The existing static Machine Lab fallback appears when WebGL is unavailable,
the model fails, or `?webgl=off` is used for review. Authoring controls and
locally stored values remain visible; only the 3D preview is unavailable.

The source model remains:

- **Model:** “Laptop”
- **Creator:** [Aullwen](https://sketchfab.com/Aullwen)
- **Source:** [Sketchfab](https://sketchfab.com/3d-models/laptop-7d870e900889481395b4a575b9fa8c3e)
- **License:** [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/)
- **Modification note:** the model was modified for Helix, including runtime
  material treatment, hinge assembly, display fitting, and semantic HTML
  alignment.

The director introduces no new dependency, scroll owner, animation loop, or
production asset request.
