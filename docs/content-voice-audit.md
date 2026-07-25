# Content voice audit

This document records the portfolio-wide voice and concision review completed after the six-chapter Helix journey became content-complete. It is a practical reference for future copy changes, not a second design system.

## Review boundary

| Item | Reviewed state |
| --- | --- |
| Base commit | `bd96861e8ddcb2dc2fd545f261d43d18d2bd78db` (`main`, merged PR #15) |
| Journey | Arrival, Environment, Engineering Mindset, Selected Projects, Experience, Continue |
| Prior evidence | Merged PRs #11–#15 and their responsive, motion, reduced-motion, and accessibility evidence |
| Public-copy sources | `app/layout.tsx`, semantic component labels, and the typed records in `data/early-journey.ts`, `data/helix-chapters.ts`, `data/projects.ts`, `data/experience.ts`, and `data/contact.ts` |
| Supporting sources | README, design system, design principles, experience architecture, architecture guide, Helix concept, roadmap, and full-journey audit |

The review covers visible copy, metadata, accessible link names, chapter labels, system labels, statuses, and calls to action. Internal selectors, test ids, data keys, and decorative SVG geometry are outside the copy inventory.

## Audit method

1. Inventory every public text source in reading order.
2. Read the complete journey as one narrative.
3. Compare the copy with the established claim and privacy boundaries.
4. Count chapter words, sentence length, and recurring technical terms as diagnostic evidence.
5. Classify repetition as useful consistency, necessary technical precision, or removable process language.
6. Rewrite within the existing typed data and component boundaries.
7. Read and measure the complete revised journey again before approval.

Counts are estimates based on visible strings in the typed data plus repeated interface labels. They are used to reveal density and repetition, not to reward the lowest possible word count.

## Content inventory

- **Arrival:** identity, location, focus, title, summary, laptop status, and entry cue.
- **Environment:** chapter label, heading, introduction, three principle titles, summaries, and practice lines.
- **Engineering Mindset:** chapter label, heading, introduction, Understand–Isolate–Observe–Verify summaries, and Projects handoff.
- **Selected Projects:** chapter introduction; three project names, roles, summaries, problems, approaches, technical evidence, quality evidence, technology lists, statuses, current boundaries, and repository actions.
- **Experience:** chapter introduction; three track categories, timeframes, titles, summaries, evidence, environment labels, and present-day connections.
- **Continue:** chapter introduction, current direction, GitHub/LinkedIn/email descriptions and actions, closing line, and accessible link names.
- **Metadata and utility copy:** document title, description, skip link, scroll cue, workspace markers, and path continuation labels.

## Current voice findings

The current copy is accurate, careful, and technically credible. Its main weakness is cumulative: chapters written in separate milestones repeat the same reasoning vocabulary and qualification patterns until the page begins to read like engineering documentation.

- Arrival is clear but its technology list is broad for a first introduction.
- Environment describes real habits, but titles and practice lines sometimes sound like process policy.
- Engineering has a strong four-step structure, while its introduction repeats language used again in Experience.
- Projects contains the strongest proof and the highest density. Summary, problem, approach, evidence, and boundary text sometimes explain the same distinction more than once.
- Experience is grounded, but repeated evidence labels and formal conclusions make the three tracks feel mechanically uniform.
- Continue repeats Jonathan’s target roles across its introduction, direction statement, and email description.
- Accessible names are accurate but longer than their visible actions need.

The voice is most natural when it describes a concrete action in first-person language. It becomes least natural when several abstract nouns are grouped into one sentence.

## Repeated concepts and phrases

Baseline estimates:

| Measure | Before |
| --- | ---: |
| Total visible words | 1,386 |
| Arrival | 46 |
| Environment | 104 |
| Engineering | 100 |
| Projects | 629 |
| Experience | 420 |
| Continue | 87 |
| Average sentence length | 17.0 words |

The most visible repeated terms are `evidence` (13), `behaviour` (11), `technical` (11), `quality` (10), `system`/`systems` (17 combined), and `boundary`/`boundaries` (14 combined). `current`, `validation`/`validate`, `structured`, `practice`, and `workflow` also recur across chapter roles.

The following patterns need particular attention:

- repeated groups of three abstract nouns;
- repeated explanations of system boundaries;
- repeated statements that tests or inspection make behaviour visible;
- repeated “current direction” conclusions;
- summary, problem, and approach fields restating the same project premise;
- formal labels such as “Evidence in practice” and “What it contributes now” reinforcing a résumé-like rhythm;
- boundary copy expanding into disclaimer-like paragraphs;
- consecutive sentences with the same “concept, process, outcome” structure.

## Finding classification

### Preserve

- `Understand`, `Isolate`, `Observe`, and `Verify`;
- project names, ordering, featured state, repository destinations, and statuses;
- the distinction between implemented, prototype, active, and planned work;
- the three Experience tracks and their study, project, and employment boundaries;
- GitHub, LinkedIn, and Email order and destinations;
- concise technical names when they identify real tools or layers.

### Simplify

- process-heavy headings and chapter introductions;
- repeated evidence and boundary language;
- duplicated role lists in Continue;
- long accessible names where the destination is already clear;
- technology accumulation that does not add new proof.

### Remove or merge

- evidence bullets that merely repeat a project summary;
- multiple sentences protecting the same factual boundary;
- formal conclusions that repeat the preceding track;
- generic phrases that could describe any careful engineering project.

## Claim and privacy boundaries

The rewrite must continue to distinguish:

- ongoing software-development studies from completed education;
- coursework and personal projects from professional software or QA employment;
- previous embedded studies from current specialization;
- field-service work from software-development employment;
- implemented features from planned features;
- public repositories and contact routes from private planning or client information.

The copy must not introduce seniority, expertise, leadership, production ownership, enterprise responsibility, quantified impact, named clients, private employer details, or functionality unsupported by the repositories. Shorter wording must never remove a qualification that protects one of these boundaries.

## Target voice

Helix should sound like one technically curious person explaining his work clearly.

- **Direct before formal:** describe what Jonathan does, checks, or learned.
- **Specific before abstract:** prefer tests, APIs, devices, issues, and fault reports over broad process language.
- **Personal without becoming autobiographical:** use first person where it creates connection, then let the work carry the proof.
- **Confident without inflation:** state the current direction plainly and keep study or project context visible.
- **Technical but readable:** retain terms that help a recruiter or engineer understand the work; remove jargon used only for tone.
- **Concise without becoming vague:** keep distinctive engineering evidence and remove duplicated explanation.
- **Natural in rhythm:** vary sentence length and avoid making every record end with a slogan.

## Terminology decisions

- Keep British English `behaviour`, matching the existing documentation, but use it only when the observable result is the point.
- Keep `quality` in Jonathan’s study focus and where it identifies a real testing concern; do not use it as a general synonym for care.
- Keep `boundary` for an implemented-versus-planned project limit or a meaningful system interface. Prefer `limit`, `layer`, or a concrete component elsewhere.
- Keep `evidence` in structural UI labels only where it helps scanning. In prose, prefer the actual proof: tests, builds, logs, results, or repository history.
- Keep official technology and status names unchanged.
- Use `testing` and `QA` precisely. Do not imply professional QA employment.
- Use `current` only when it distinguishes ongoing studies or active work from previous experience.
- Prefer `check` over `validate` or `verify` in conversational prose; retain `Verify` as the established Engineering step.

## Changes made

To be completed after the rewrite. This section will record the significant decisions rather than every sentence edit.

## Intentionally preserved wording

- `Jonathan Jansson`
- `Understand`, `Isolate`, `Observe`, `Verify`
- `AI-Powered Test Engineer`, `CortexGrid`, and `Helix`
- `ACTIVE DEVELOPMENT` and `PROTOTYPE COMPLETE`
- `The path remains open.`

Other wording may remain where the full-page review shows that it is already natural, accurate, and useful.

## Unresolved content questions

- Whether `Test & quality` is the most natural compact focus label outside the main title.
- Whether future final content should name the current study programme and LIA period once approved public wording and dates are available.
- Whether project case studies will eventually need shorter overview copy here and deeper technical detail on separate routes.
- Whether a professional email using a personal domain should replace the current verified address before deployment.

These questions do not block the voice pass and must not be answered by guessing.

## Recommendations for future copy updates

- Read the entire page after editing any chapter; local improvements can reintroduce portfolio-wide repetition.
- Keep factual content in the existing typed data modules.
- Add a technical term only when it changes what the visitor understands.
- Recheck public repositories before changing project status or implemented/planned boundaries.
- Treat content measurements as diagnostics, never acceptance targets.
- Run a final human review with confirmed education dates, opportunity wording, and deployment metadata before launch.
