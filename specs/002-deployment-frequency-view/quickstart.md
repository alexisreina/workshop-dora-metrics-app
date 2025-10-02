# Quickstart: Deployment Frequency View

## What you'll see
- Chart of Production deployment counts with presets (14/30/90d, 6m, custom)
- Grouping controls (day/week/month); ISO-8601 weeks
- 7-day rolling average toggle (day only; partial window <7d)
- Filters (Project, Repository, Environment) from static lists
- Summary (total, average, delta and percent vs previous period)
- Raw events table (includes non-Production)

## Steps
1. Open the DF page.
2. Switch presets and grouping; verify labels (day `yyyy-mm-dd`, week `yyyy-Www`, month `yyyy-mm`).
3. Toggle rolling average on Day; check partial-window behavior for short ranges.
4. Apply filters; ensure DF counts only exact-match `prod`/`production` events.
5. Review summary deltas vs previous period.
6. Inspect raw events to see non-Production entries.
