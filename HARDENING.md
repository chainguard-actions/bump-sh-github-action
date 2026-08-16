<!-- markdownlint-disable -->

# Hardening Report: bump-sh--github-action/v1.3.0

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **bump-sh--github-action/v1.3.0** was hardened automatically. 2 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

The workflow file uses action references pinned to mutable version tags instead of immutable 40-character SHA digests. Failing references: actions/checkout@v4 (lines 21 and 33) and actions/setup-node@v4 (line 23). These should be pinned to full commit SHAs.

Locations:

- `.github/workflows/test.yml:21`
- `.github/workflows/test.yml:23`
- `.github/workflows/test.yml:33`

### missing-permissions (severity: medium)

The workflow file has no top-level permissions: key, and neither the build job nor the test job defines a job-level permissions: block. The GITHUB_TOKEN inherits potentially over-broad default permissions. Add a minimal permissions block such as contents: read.

Locations:

- `.github/workflows/test.yml:1`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, missing-permissions

**Notes:**

Pinned actions/checkout@v4 to SHA 34e114876b0b11c390a56381ad16ebd13914f8d5 (both occurrences at lines 21 and 33) and actions/setup-node@v4 to SHA 49933ea5288caeca8642d1e84afbd3f7d6820020 (line 23). Added top-level `permissions: contents: read` block to restrict GITHUB_TOKEN to the minimum required permissions.

