# DeepSeek Harness integration

This directory is packaged as a DSH bundle targeting `0.2.1-rc.2`. The bundle inserts a dedicated filesystem Skill provider rooted at the package's `skills/` directory. It does not register an MCP server, patch the agent loop, execute target code during installation, or grant host permissions.

## Skill invocation

Use the standard DSH Skills consumer in a profile that includes `@deepseek-ai/dsh-tool-skill`. Ask focused questions for guidance mode. Invoke the full six-phase workflow only for explicit full-audit, pen-test, comprehensive-review, or report-artifact requests. Companion guides and validators are relative to this directory; read the relevant reference and schema before each phase.

The provider has a unique name, `security-audit-bundle`, and uses `includeDefaultRoots: false`, so it contributes only this package's skills and doesn't duplicate standard user/project roots or override the profile's regular filesystem provider.

## Delegation mapping

The upstream describes `research` and `general` task roles; those labels are not DSH tool names. Use the actual configured DSH `subagent` schema. Full audit mode needs distinct independent child runs for reconnaissance, hunting, coverage critics, candidate validation, and final record verification. Preserve parent-only shared-file ownership and unique scratch/artifact paths for each child.

If independent delegation is unavailable, don't flatten those roles into one agent or mark self-review independent. Record the exact missing capability, mark the affected phase incomplete, and do not promote unvalidated candidates into `findings.json`.

## Host files and commands

Use the current host's read/list/search/grep tools where available. Patch/write shared audit files only in explicitly requested full-audit mode and only as the parent; never alter target source. The bundled validators use Node.js without third-party dependencies:

```sh
node skills/security-audit/validate-findings.cjs <output-dir>/findings.json
node skills/security-audit/validate-coverage-ledger.cjs <output-dir>/coverage-ledger.json
node --test skills/security-audit/validate-findings.test.cjs skills/security-audit/validate-coverage-ledger.test.cjs
```

These paths assume commands run from the repository/package root; use actual absolute paths when the audit output is elsewhere. Do not install dependencies into an audited target or allow target builds to fetch packages.

## Sandbox gate

The availability of DSH shell, filesystem, and subagent tools does not establish the OS-enforced isolation mandated by this workflow. Before running repository-controlled builds, tests, processes, browsers, emulators, fuzzers, or fixtures, verify an external sandbox supplies all of these controls:

- no external networking (except an explicitly isolated loopback namespace for a specific approved local check);
- an empty environment populated from an explicit safe allowlist, with scratch-local home, temp directories, and caches;
- read-only target and toolchain access;
- write access for the target-controlled process only to its assigned scratch directory;
- explicit low CPU, memory, process, file-size, disk, and wall-clock limits.

Use dummy principals and fixtures. Do not touch production endpoints, live identities, shared services, cloud control planes, paid API quota, or other users' data. A missing control means source-only analysis and an exact `needs_validation` blocker, not an attempt to work around the sandbox. After target execution stops, the trusted parent alone may promote a narrowly allowlisted regular file to retained artifacts using the no-follow, path-confined, bounded copy procedure in `SKILL.md`.
