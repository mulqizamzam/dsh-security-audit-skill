# DeepSeek Harness Security Audit Skill

A DeepSeek Harness (DSH) bundle that exposes the source-first `security-audit` workflow through the native Harness Skills system.

**Target runtime:** DeepSeek Harness `0.2.1-rc.2` (pinned in `engines.dsh`).  
**Bundle version:** `0.1.0`.

## Install

With DSH installed, install the public bundle into the profile you use:

```sh
dsh plugin --profile web add github:mulqizamzam/dsh-security-audit-skill
dsh --profile web --dump-config
dsh --profile web
```

Replace `web` with your actual profile name. This bundle contributes a dedicated filesystem Skill provider rooted at its own `skills/` directory; it does not require an MCP server or override the existing filesystem provider. The profile must include the normal DSH Skills consumer and, for the complete workflow, a genuinely independent configured subagent capability.

## Preserved workflows

- Guidance mode for security questions, focused source reviews, and finding triage; full six-phase audits only on explicit full-audit, pen-test, comprehensive-review, or reporting requests.
- Reconnaissance, deterministic coverage ledger, coverage-led hunting, adversarial candidate validation, machine-validated records, independent record verification, and target-neutral reports.
- Core and specialized attack classes: AI/LLM, browser/client, cloud/deployment, tenant and data lifecycle, desktop/mobile/IPC, native memory/binary/kernel, RPC/messaging, availability, supply chain/release, HTTP and authentication.
- The findings schema, both zero-dependency Node validators, and the upstream regression suites.

## Security boundary

This is a defensive, source-first workflow. Never execute target-controlled builds, tests, processes, browsers, emulators, fuzzers, or fixtures unless an OS-enforced sandbox guarantees disabled external networking, an allowlisted clean environment, read-only target/toolchain access, per-agent write isolation, and explicit resource limits. DSH tool availability alone does not prove those controls exist. If independent delegation or a required sandbox control is unavailable, preserve the blocker and mark the relevant audit phase incomplete rather than simulating independent verification.

Never probe production endpoints, live identities, shared infrastructure, or another user's data. Findings require source-grounded trust-boundary evidence and a bounded observed result; unresolved facts belong in `needs_validation` without severity.

## Validate

```sh
npm run validate
npm test
npm pack
```

CI also compares two package archives and revalidates a clean extraction. A Harness profile-boot test remains a separate environment-dependent check.

## Provenance

Ported from [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill), inspected at [source commit `c1c8a8c1471069fb0e188eeaff69b8e8db6564a8`](https://github.com/cloudflare/security-audit-skill/commit/c1c8a8c1471069fb0e188eeaff69b8e8db6564a8). The upstream MIT license and copyright notice are retained. See [CONVERSION.md](CONVERSION.md) for decisions and verification boundaries.
