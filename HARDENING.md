<!-- markdownlint-disable -->

# Hardening Report: bump-sh--github-action/v1.2.7

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **bump-sh--github-action/v1.2.7** was hardened automatically. 2 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

The workflow file uses action references pinned to mutable version tags (@v4) instead of immutable full 40-character SHA commit hashes. This exposes the workflow to supply-chain attacks if the tag is moved to a different commit. Failing references: `actions/checkout@v4` (used twice) and `actions/setup-node@v4`.

Locations:

- `.github/workflows/test.yml:14`
- `.github/workflows/test.yml:16`
- `.github/workflows/test.yml:31`

### missing-permissions (severity: medium)

The workflow file has no top-level `permissions:` key, and neither of its jobs (`build`, `test`) defines a job-level `permissions:` block. Without explicit permissions, the workflow inherits the repository's default token permissions, which may be broader than necessary (e.g., write access to contents). Explicit minimal permissions should be declared.

Locations:

- `.github/workflows/test.yml:1`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, missing-permissions

**Notes:**

Fixed .github/workflows/test.yml: (1) Pinned actions/checkout@v4 to SHA 11d5960a326750d5838078e36cf38b85af677262 (both occurrences at lines 14 and 31) and actions/setup-node@v4 to SHA 49933ea5288caeca8642d1e84afbd3f7d6820020 (line 16), preserving the original tag as inline comments. (2) Added top-level `permissions: {}` to deny all token permissions by default, since neither the build nor test jobs require any GitHub token access.

