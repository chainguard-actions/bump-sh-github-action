<!-- markdownlint-disable -->

# Hardening Report: bump-sh--github-action/v1.3.1

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **bump-sh--github-action/v1.3.1** was hardened automatically. 2 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

The workflow file .github/workflows/test.yml references GitHub Actions using mutable tag refs instead of pinned 40-character SHA digests. This exposes the workflow to supply-chain attacks if the upstream action tag is moved or compromised. Failing references: `actions/checkout@v4` (line 22, line 33) and `actions/setup-node@v4` (line 24). These should be pinned to their full commit SHAs, e.g. `actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4`.

Locations:

- `.github/workflows/test.yml:22`
- `.github/workflows/test.yml:24`
- `.github/workflows/test.yml:33`

### missing-permissions (severity: medium)

The workflow file .github/workflows/test.yml has no top-level `permissions:` key, and neither of its jobs (`build`, `test`) defines a job-level `permissions:` block. Without explicit permissions, the workflow inherits the repository's default token permissions, which may be overly broad. A minimal `permissions:` block (e.g. `contents: read`) should be added at the top level or to each job.

Locations:

- `.github/workflows/test.yml:1`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, missing-permissions

**Notes:**

Fixed .github/workflows/test.yml: (1) Pinned actions/checkout@v4 to @34e114876b0b11c390a56381ad16ebd13914f8d5 # v4 at both occurrences (lines 22 and 33). (2) Pinned actions/setup-node@v4 to @49933ea5288caeca8642d1e84afbd3f7d6820020 # v4 (line 24). (3) Added top-level `permissions: contents: read` block to restrict the GITHUB_TOKEN to the minimum required permissions.

