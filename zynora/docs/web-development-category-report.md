# ZYNORA Web Development Category Report

## Implementation summary

- Added the `Web Development` category group with the following 11 subcategories:
  1. Free Hosting & Deployment
  2. Free Domains & Subdomains
  3. AI Website Builders
  4. AI Coding Assistants
  5. Git & Version Control
  6. Code Editors & IDEs
  7. Frontend Development
  8. Backend & Databases
  9. UI/UX & Design Resources
  10. Testing, SEO & Performance
  11. Learning & Documentation
- Added 70 unique web-development seed records and category relationships.
- Existing catalog records are reused by normalized tool name. No duplicate
  catalog entries were created for overlapping tools.
- The website category index, category detail pages, homepage category count,
  All Tools page, and category tool filters use the shared catalog and category
  relationships.

## Catalog counts

- Verified catalog count before this implementation: **1,586 unique tools**.
- Verified catalog count after this implementation: **1,651 unique tools**.
- Net catalog additions: **65 tools**.
- Duplicate seed names: **0**.
- The original request contains **75 tool-to-subcategory placements**, not 72
  unique names. GitHub Pages, Cloudflare Pages, Netlify, Vercel, and Cursor are
  repeated across subcategories, leaving **70 distinct listed names**. All 70
  are represented; no names were invented to force a count of 72.
- The audit found stale relationship slugs that left 47 listed tools outside
  their intended subcategories. Those slugs have been corrected, including
  Cursor in Code Editors & IDEs.
- The original request contains **75 tool-to-subcategory placements**, not 72
  unique names. GitHub Pages, Cloudflare Pages, Netlify, Vercel, and Cursor are
  each repeated across subcategories, so the exact unique-name target in that
  list is **70**. All 70 are included; no tools were invented to force a count
  of 72.
- The audit found stale category relationship slugs that left 47 listed tools
  unattached to their intended subcategories. Those relationships are now
  corrected, including Cursor under Code Editors & IDEs.
- Web-development seed overlap with existing curated records: tools that already
  existed in ZYNORA retain their existing catalog record and receive the new
  web-development category relationships.
- Subcategories added: **11**.
- Sitemap URLs after implementation: **1,767**.

### Subcategory counts

| Subcategory | Tool placements |
| --- | ---: |
| Free Hosting & Deployment | 7 |
| Free Domains & Subdomains | 5 |
| AI Website Builders | 8 |
| AI Coding Assistants | 7 |
| Git & Version Control | 5 |
| Code Editors & IDEs | 7 |
| Frontend Development | 8 |
| Backend & Databases | 8 |
| UI/UX & Design Resources | 8 |
| Testing, SEO & Performance | 7 |
| Learning & Documentation | 5 |

These are 75 subcategory placements for 70 distinct tools. The four hosting
platforms appear under both hosting and subdomains, and Cursor appears under
both AI coding assistants and code editors.

### Subcategory counts

| Subcategory | Tool placements |
| --- | ---: |
| Free Hosting & Deployment | 7 |
| Free Domains & Subdomains | 5 |
| AI Website Builders | 8 |
| AI Coding Assistants | 7 |
| Git & Version Control | 5 |
| Code Editors & IDEs | 7 |
| Frontend Development | 8 |
| Backend & Databases | 8 |
| UI/UX & Design Resources | 8 |
| Testing, SEO & Performance | 7 |
| Learning & Documentation | 5 |

These are **75 placements** representing **70 distinct listed tools** because
the four hosting providers and Cursor are intentionally related to two
subcategories each.

## Category and filtering integration

- Web Development is featured on the homepage and available in category
  navigation.
- Category detail pages support:
  - text search;
  - pricing filters;
  - open-source filters;
  - sorting and existing tool-card presentation.
- The All Tools page now supports pricing and open-source filters alongside
  existing category and sorting controls.
- Homepage and directory category counts are calculated from live category data
  instead of a hard-coded category number.

## Logo implementation

- Downloaded and validated local logos: **57**.
- Failed/missing logos: **13**.
- Logos are stored in
  `public/tool-logos/web-development/`.
- The image manifest is
  `public/tool-logos/web-development/logo-manifest.json`.
- Tool logos resolved by the existing `ToolLogo` component use local paths.
- Failed or unavailable logos use the existing initials fallback.
- Downloaded provenance is recorded as favicon or metadata-derived; manifest
  entries remain `unverified` until an official brand-source review confirms
  their verification status.

## Missing or failed logo tools

- GitHub Pages
- Render
- Replit
- GitHub Copilot
- Aider
- GitHub
- Bitbucket
- CodeSandbox
- CodePen
- Postman
- Figma
- LottieFiles
- W3Schools

Existing Replit, GitHub Copilot, and related curated logos remain in use where
the existing catalog already supplied a working local logo. Repeated/missing
sources did not overwrite those records.

## Pricing status

- Pricing is assigned only as Free, Freemium, Paid, or Unverified based on
  readily available catalog context and the user-requested platform type.
- `Durable`, `Claude Code`, and several other entries are marked `Unverified`
  where official current pricing could not be confirmed during this local
  implementation.
- Free Hosting or Free Subdomain wording does not imply that a custom domain
  registration is free. `is-a.dev` is recorded as a free subdomain service.
- Verify current official pricing pages before making any commercial or ranking
  claims.

## Open-source status

- Open-source status is added as `true`, `false`, or `Unverified` context in the
  catalog type and filter logic.
- Verified open-source flags are limited to tools whose official projects or
  repositories clearly identify open-source status in their catalog seed.
- Tools such as GitHub Pages, GitHub Copilot, Figma, and others remain
  `Unverified` rather than assumed open or closed source.

## SEO

- Web Development and each subcategory use route-specific titles and descriptions
  through the existing category route metadata.
- Canonical URLs remain generated from `https://zynora.tools`.
- Category URLs are discovered automatically by the sitemap generator.
- No invented ratings, reviews, offers, or aggregate scores were added.

## Validation

- Production build passes.
- ESLint passes.
- Sitemap generation runs as part of the build and reports 1,767 URLs.
- Logo manifest contains 57 successfully validated images and 13 failures.
- Existing catalog records are reused and web tools are deduplicated by slug
  and normalized name.
- `scripts/audit-web-development.mjs` verifies all 70 listed unique tools,
  all 11 subcategories, expected per-subcategory counts, unique catalog slugs,
  HTTPS official URLs, and valid category relationships.
- The runtime audit checks all 70 listed unique tools, all 11 subcategories,
  HTTPS website URLs, unique catalog slugs, and category relationships.
- Remaining work: official-source review for unverified logos, and official
  pricing confirmation for entries marked `Unverified`.
