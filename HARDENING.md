<!-- markdownlint-disable -->

# Hardening Report: bump-sh--github-action/v1.2.10

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **bump-sh--github-action/v1.2.10** was hardened automatically. 2 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

The workflow file uses tag-based (mutable) action references instead of full 40-character commit SHA pins. This exposes the workflow to supply-chain attacks if the referenced tags are moved or compromised. Failing references: `actions/checkout@v4` (lines 18 and 33) and `actions/setup-node@v4` (line 21). These should be pinned to their full SHA digests, e.g. `actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4`.

Locations:

- `.github/workflows/test.yml:18`
- `.github/workflows/test.yml:21`
- `.github/workflows/test.yml:33`

### missing-permissions (severity: medium)

The workflow file `.github/workflows/test.yml` has no top-level `permissions:` key, and neither the `build` job nor the `test` job defines its own `permissions:` block. Without explicit permissions, the workflow inherits the repository's default token permissions (which may be `write-all` on older repositories), granting broader access than necessary. A minimal `permissions:` block (e.g. `contents: read`) should be added at the top level or per job.

Locations:

- `.github/workflows/test.yml:1`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, missing-permissions

**Notes:**

Fixed .github/workflows/test.yml: (1) Pinned actions/checkout@v4 → @11d5960a326750d5838078e36cf38b85af677262 # v4 at both occurrences (lines 18 and 33), and actions/setup-node@v4 → @49933ea5288caeca8642d1e84afbd3f7d6820020 # v4 (line 21). (2) Added top-level `permissions: contents: read` block to restrict the default GITHUB_TOKEN to the minimum needed for checkout-based CI.

