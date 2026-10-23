import test from "node:test";
import assert from "node:assert/strict";
import {readFile,lstat} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=(p)=>readFile(path.join(root,p),"utf8");

test("pins the requested Harness runtime and declares a native bundle",async()=>{
 const p=JSON.parse(await read("package.json"));
 assert.equal(p.engines.dsh,"0.2.1-rc.2");
 assert.equal(p.peerDependencies["@deepseek-ai/dsh-skill-filesystem"],"0.2.1-rc.2");
 assert.equal(p.dsh.bundle.patch,"./cordis.patch.yml");
 assert.equal(p.version,"0.1.0");
});
test("adds a dedicated provider without overriding the default provider",async()=>{
 const p=await read("cordis.patch.yml");
 assert.match(p,/id: dsh-security-audit-skill-filesystem/);
 assert.match(p,/providerName: security-audit-bundle/);
 assert.match(p,/includeDefaultRoots: false/);
 assert.match(p,/customSkillDirs:/);
});
test("retains upstream attack domains, validators, schema, and tests",async()=>{
 for(const p of [
  "skills/security-audit/SKILL.md","skills/security-audit/AI-AND-LLM.md",
  "skills/security-audit/ATTACK-CLASSES.md","skills/security-audit/CLIENT-SIDE.md",
  "skills/security-audit/CLOUD-AND-DEPLOYMENT.md","skills/security-audit/DATA-ISOLATION-AND-LIFECYCLE.md",
  "skills/security-audit/DESKTOP-MOBILE-AND-LOCAL-IPC.md","skills/security-audit/MEMORY-SAFETY-AND-BINARY.md",
  "skills/security-audit/PROTOCOLS-RPC-AND-MESSAGING.md","skills/security-audit/RESOURCE-EXHAUSTION-AND-AVAILABILITY.md",
  "skills/security-audit/SUPPLY-CHAIN-AND-RELEASE.md","skills/security-audit/WEB-PROTOCOL-AND-AUTH.md",
  "skills/security-audit/report-schema.json","skills/security-audit/validate-findings.cjs",
  "skills/security-audit/validate-findings.test.cjs","skills/security-audit/validate-coverage-ledger.cjs",
  "skills/security-audit/validate-coverage-ledger.test.cjs"
 ]) await lstat(path.join(root,p));
 JSON.parse(await read("skills/security-audit/report-schema.json"));
});
test("documentation admits sandbox and delegation limitations",async()=>{
 const p=await read("skills/security-audit/DEEPSEEK-HARNESS.md");
 assert.match(p,/do not by themselves establish the OS-enforced isolation/i);
 assert.match(p,/mark the affected phase incomplete/i);
});
test("preserves MIT notice and self-contained square brand assets",async()=>{
 assert.match(await read("LICENSE"),/Cloudflare, Inc\./);
 for(const p of ["icon.svg","assets/logo-light.svg","assets/logo-dark.svg"]){
  const svg=await read(p); assert.match(svg,/<svg\b/); assert.match(svg,/viewBox="0 0 128 128"/);
 }
});
