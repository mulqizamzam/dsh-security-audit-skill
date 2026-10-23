# Conversion brief

## Source and destination

- Source: [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill)
- Inspected source ref: [`c1c8a8c1471069fb0e188eeaff69b8e8db6564a8`](https://github.com/cloudflare/security-audit-skill/commit/c1c8a8c1471069fb0e188eeaff69b8e8db6564a8)
- Destination: [mulqizamzam/dsh-security-audit-skill](https://github.com/mulqizamzam/dsh-security-audit-skill)
- Runtime: DSH `0.2.1-rc.2`, pinned using `engines.dsh`.
- Architecture: one native DSH npm bundle that registers a filesystem Skills provider; no MCP service and no custom server.

## Workflow disposition

| Source component | Disposition | Reason |
|---|---|---|
| Main `SKILL.md` | `compile_skill` | Preserves six phases, evidence bar, safety gates, output contract, and distinct guidance/full-audit modes; replaces platform integration instructions. |
| Reconnaissance, hunting, validation/reporting guides | `preserve_skill` + DSH port | Phase prompts, coverage invariants, parent-owned ledgers, independent validation, and stop states retained; task roles mapped to DSH delegation concepts. |
| Attack-class/domain companion guides | `preserve_skill` | Core plus AI/LLM, client-side, cloud, tenant/lifecycle, desktop/mobile/IPC, native memory/binary/kernel, protocols/messaging, exhaustion/availability, supply chain/release, HTTP/auth. |
| JSON report schema | `preserve_skill` | Maintains a machine-readable finding contract. |
| Both `.cjs` validators and their test suites | `preserve_skill` | Keeps zero-dependency validation and regression checks. |
| Source README / installation snippets | `reference_only` and rewrite | Replaces upstream Skills CLI installation with DSH bundle installation; source attribution is maintained. |
| Upstream MIT `LICENSE` | `preserve_skill` | Includes the original copyright and permission notice. |
| Source-platform Task tool arguments and `subagent_type` labels | `discard` / replace | Replaced with capability-based DSH delegation guidance; no unsupported arguments are fabricated. |

No useful domain workflow was intentionally removed. The bundle doesn't claim that packaging provides independent subagents, a security sandbox, or any host permission.

## DSH-native design

The `package.json` declares `dsh.bundle.patch` and exact `engines.dsh`. The patch inserts `@deepseek-ai/dsh-skill-filesystem` under a new row ID and sets a unique provider name, with the bundle's package-relative `skills/` directory as its only custom root (`includeDefaultRoots: false`). Existing provider rows are not overridden. The package exports its `package.json` so the DSH-supported module-resolution expression can locate the Skill directory after package installation.

### Host capability profile

| Capability | Disposition | Conditions |
|---|---|---|
| Read/list/search/grep | Preferred | Use native DSH workspace tools available in the active profile. |
| Write/patch | Mutation | Parent writes audit artifacts only when the user requested full audit/report mode; never edit audited source. |
| Shell/Node | Optional | Validator and regression checks require Node. Run target-controlled commands only inside the mandated OS sandbox. |
| Python | Optional | Use for deterministic local transformations only where actually provided and subject to the same execution boundary. |
| Independent subagents | Preferred for full audits | Use the real configured DSH `subagent` schema; if not present, don't simulate independence and mark the run incomplete. |
| OS-enforced sandbox | Required for target execution | DSH shell/tool availability alone is not evidence of isolation. Missing control means source-only analysis and `needs_validation`. |
| MCP/network service | Not needed | This workflow is local/source-first and adds no network client. |

## Public distribution safety

- No credentials, private aliases, hidden telemetry, production endpoint probes, or install-time scripts are added.
- Target-controlled code is never run without disabled external networking, a clean allowlisted environment, read-only target/toolchain access, per-agent scratch-only writes, explicit resource caps, and trusted parent-side artifact promotion.
- `needs_validation` identifies the precise unresolved fact and has no severity. Severity exists only for confirmed boundary violations with evidenced impact.
- Parent owns the shared ledger and final outputs. Child runs receive distinct scratch roots and only the context required for their assignment.
- Upstream source and licensing are attributed in the README and this document.

## Brand rationale

A shield expresses the reviewed security boundary; the inset check represents inspection followed by evidence-based validation. Light and dark variants share identical geometry, and the compact icon is simplified for legibility at small sizes.

## Evidence and open validation

The source README, license, main skill, companion guides, schema, validators, and regression tests were inspected via GitHub's repository API at the recorded source ref. The local Autopilot analyzer was **not executed**: this execution environment could not resolve GitHub and has no mounted target checkout. The disposition is therefore manual source review, not a claimed analyzer report.

The package includes executable Node checks, original source regression tests, deterministic-packaging and fresh-extraction CI. A real DSH `0.2.1-rc.2` profile-boot/Skills-discovery smoke test requires that runtime and is not claimed by package-level validation alone.
