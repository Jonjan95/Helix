# Deployment

Helix is a locally validated Next.js release candidate. No hosting provider or production domain is committed to the repository. These instructions target a standard Node-capable Next.js platform without adding speculative vendor configuration.

## Requirements

- Node.js 24 LTS-compatible runtime
- npm
- a public HTTPS origin chosen for the portfolio

The host must support a normal Next.js production build and server. The current repository is not configured as a static export, even though every public route is prerendered.

## Required environment variable

Set this before the production build:

```text
NEXT_PUBLIC_SITE_URL=https://your-verified-domain.example
```

Use only the canonical origin. Do not include a page path, query, or fragment. The application normalizes the value to `/`.

This value is public configuration, not a secret. `.env.example` documents it; a real `.env` file must remain untracked.

When the value is valid, Helix publishes:

- a canonical root URL;
- an Open Graph URL;
- indexable robots rules;
- an absolute sitemap URL;
- exactly one sitemap record for `/`.

When it is missing or invalid, the build still works, but canonical and Open Graph URLs are omitted, robots blocks indexing, and the sitemap is empty. This is safe for local or preview use but is not an acceptable final public configuration.

## Build and run

```bash
npm ci
npm run build
npm run start
```

Expected production routes:

- `/`
- `/robots.txt`
- `/sitemap.xml`
- generated Open Graph image route
- generated icon routes
- Next.js default not-found route

The build output should identify every listed route as static.

## Validation before deployment

Install the managed browsers once:

```bash
npx playwright install chromium firefox webkit
```

Run:

```bash
npm run validate
npm run test:release
npm audit
```

`npm run validate` is the required core sequence: lint, typecheck, production build, and the established Chromium suite. `npm run test:release` is the focused Chromium, Firefox, and WebKit release matrix.

To regenerate the repository-owned identity assets:

```bash
npm run assets:generate
```

To regenerate the documentation-only release evidence after a material release change:

```bash
npm run evidence:capture
```

Neither generation script runs in production.

## Host configuration

Use one canonical host. After a real domain is known, configure hosting-level redirects for:

- HTTP to HTTPS;
- preview or old deployment URLs to the canonical origin when appropriate;
- `www` to apex, or apex to `www`, according to the chosen canonical origin;
- a consistent trailing-slash policy.

Do not add these redirects in repository code until the domains are known.

The Next.js response configuration supplies:

- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- a permissions policy disabling camera, microphone, and geolocation.

Confirm that the selected host preserves these headers. Add a Content Security Policy only in a separately tested change; Next.js scripts and the GSAP boundary must not be broken by a speculative policy.

## Preview deployments

Preview deployments should normally omit `NEXT_PUBLIC_SITE_URL` unless the preview has an intentional canonical role. The safe fallback blocks indexing and avoids publishing a preview hostname as canonical.

If the platform automatically exposes environment variables, do not map an arbitrary preview URL to `NEXT_PUBLIC_SITE_URL` for the production environment.

## Post-deployment smoke test

After deploying the exact reviewed commit:

1. Open the public URL in a normal browser and confirm the title and tab icon.
2. Inspect the page source for the canonical URL and Open Graph metadata.
3. Fetch `/robots.txt` and confirm `Allow: /` plus the production sitemap.
4. Fetch `/sitemap.xml` and confirm exactly one canonical root URL.
5. Share or inspect the Open Graph preview at a real public URL.
6. Follow all three project links and the GitHub, LinkedIn, and email routes.
7. Test the skip link and all keyboard focus targets.
8. Test reduced motion.
9. Review desktop, mobile portrait, and mobile landscape for overflow.
10. Check the browser console.
11. Confirm invalid paths return 404.
12. Verify HTTPS and canonical-host redirects.

This public smoke test is required before describing Helix as production-proven.

## CI

The repository workflow runs on pull requests and `main` pushes:

```text
npm ci
npx playwright install --with-deps chromium
npm run validate
```

The broader three-browser matrix remains an explicit release check so ordinary pull requests stay reasonably fast. Run it before deployment and after changes to motion, layout, metadata, browser support, or reduced-motion behavior.

## Privacy and analytics

Helix uses no analytics, trackers, cookie banner, contact backend, social embed, runtime GitHub API, or external font. Analytics is intentionally excluded from the first release and must be considered in a separate privacy-reviewed change.

Only the intentionally public GitHub, LinkedIn, and professional email routes are present. Never commit phone numbers, addresses, client identities, tokens, private notes, `.env` files, or deployment credentials.

## Maintenance

For each meaningful release:

1. update project statuses and scope boundaries;
2. verify repository and contact links;
3. rerun `npm run validate`, `npm run test:release`, and `npm audit`;
4. review metadata and the configured canonical URL;
5. regenerate the social preview only when positioning changes materially;
6. review the browser console and mobile overflow;
7. smoke-test the public URL after deployment.

Keep deployment-provider configuration minimal. Do not add multiple hosting files, a CMS, analytics, or a release-management system without a verified need.
