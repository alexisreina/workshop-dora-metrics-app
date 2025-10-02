# Research: Deployment Frequency View

## Unknowns Resolved

- Custom date range maximum size: Defer to implementation defaults (no hard cap) for mock.
- Event `duration` attribute: Omit from UI; keep optional in events for realism.

## Decisions

- Use ISO-8601 week definition with Monday start; label `yyyy-Www`.
- Rolling average computes partial-window for <7 days.
- Summary includes delta and percent change vs previous period.
- Filters sourced from static predefined lists for determinism.
- Production environment match is exact `prod` or `production` (case-insensitive); exclude partials like `prod-eu`.

## Rationale

- Determinism ensures repeatable demos and tests without external dependencies.
- ISO-8601 weeks avoid locale ambiguity and align with analytics norms.
- Partial-window keeps signal visible in short ranges without disabling UX.
- Exact-match production avoids misclassification while allowing multi-env datasets.

## Alternatives Considered

- Locale-based weeks → rejected for ambiguity across regions.
- Disabling rolling avg <7 days → rejected; reduces insight for short ranges.
- Prefix/contains production matching → rejected; risks false positives.
