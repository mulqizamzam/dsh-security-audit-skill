# DeepSeek Harness Security Audit Skill

A DeepSeek Harness (DSH) bundle that makes Cloudflare's source-first `security-audit` workflow available through the native Harness Skills system.

The port preserves the six-phase audit process, the domain attack-class guides, structured finding and coverage-ledger schemas, zero-dependency validators, and their regression tests. The Harness bundle adds the packaged skill directory to the active profile without requiring an MCP server or a separate runtime service.

## Compatibility

- **DeepSeek Harness:** exactly `0.2.1-rc.2` (`engines.dsh` is pinned to this prerelease).
- **Package:** `dsh-security-audit-skill` `0.1.0`.
- **Runtime dependencies:** the target profile must provide Harness Skills support. Independent delegation and safe target-code execution depend on the tools and OS-enforced sandbox available in the selected profile; this bundle does not invent either capability.

## Install

From a trusted shell with DSH installed, add the public GitHub package to the profile you use:

```sh
dsh plugin --profile web add github:mulqizamzam/dsh-security-audit-skill
```

Replace `web` with your actual profile (for example, `desktop`, `tui`, or a custom profile). Then inspect the composed configuration and launch that profile:

```sh
dsh --profile web --dump-config
dsh --profile web
```

The bundle registers an isolated filesystem Skill provider pointing at the packaged `skills/` directory. In a Harness profile with the standard `tool-skill` consumer, invoke the `security-audit` skill by asking a focused security question or explicitly requesting a full codebase audit. The full workflow writes reports only when the request authorizes a complete audit/report artifact.

## What it preserves

- Guidance mode for security questions, triage, methodology, and focused source investigation.
- Full six-phase audits: reconnaissance; coverage-led hunting; candidate validation; structured outputs; independent record verification; target-neutral reporting.
- Core and specialized attack classes covering AI/LLM, client-side, cloud/deployment, data isolation/lifecycle, desktop/mobile/IPC, memory safety/binaries, RPC/messaging, resource exhaustion, supply chain/release, and HTTP/authentication.
- `report-schema.json`, `validate-findings.cjs`, `validate-coverage-ledger.cjs`, and the original regression suites.
- Strict rules for sandboxed local reproduction, separate verifier ownership, evidence-backed severity, prior-run reconciliation, honest `needs_validation` records, and explicit incomplete/partial coverage.

## Security boundary

The skill is defensive and source-first. Do not probe live production services or execute repository-controlled code unless an OS-enforced sandbox can guarantee no external network, an allowlisted clean environment, resource limits, read-only target/toolchain access, and write isolation to per-agent scratch directories. If a required control or delegation tool is unavailable, record the exact blocker and stop that part of the workflow; do not simulate independent verification or claim unrun tests.

Installing the bundle does not itself create a sandbox or grant host permissions. Review the profile's effective configuration and sandbox guarantees before auditing untrusted projects.

## Validation

Run:

```sh
npm run validate
npm test
npm pack --ignore-scripts
```

The CI workflow also packs the package twice, compares SHA-256 hashes, unpacks a fresh archive, and runs validation and regression tests against the extracted package.

## Attribution

This repository is a DeepSeek Harness port of [`cloudflare/security-audit-skill`](https://github.com/cloudflare/security-audit-skill), inspected at source commit [`c1c8a8c1471069fb0e188eeaff69b8e8db6564a8`](https://github.com/cloudflare/security-audit-skill/commit/c1c8a8c1471069fb0e188eeaff69b8e8db6564a8). The upstream MIT copyright and license notice are retained in [LICENSE](LICENSE). See [CONVERSION.md](CONVERSION.md) for the workflow disposition and porting decisions.
