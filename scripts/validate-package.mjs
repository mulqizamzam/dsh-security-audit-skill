import assert from "node:assert/strict";
import { lstat, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = async (p) => readFile(path.join(root, p), "utf8");
const pkg = JSON.parse(await read("package.json"));
assert.equal(pkg.name, "dsh-security-audit-skill");
assert.equal(pkg.version, "0.1.0");
assert.equal(pkg.type, "module");
assert.equal(pkg.engines?.dsh, "0.2.1-rc.2");
assert.equal(pkg.dsh?.bundle?.patch, "./cordis.patch.yml");
assert.ok(pkg.exports?.["./package.json"]);
assert.ok(pkg.files?.includes("skills/security-audit/**"));

const patch = await read("cordis.patch.yml");
for (const marker of [
  "- insert:", "id: dsh-security-audit-skill-filesystem",
  "name: '@deepseek-ai/dsh-skill-filesystem'", "providerName: security-audit-bundle",
  "includeDefaultRoots: false", "customSkillDirs:",
  "createRequire(baseUrl).resolve('dsh-security-audit-skill/package.json')"
]) assert.ok(patch.includes(marker), `Missing bundle setting: ${marker}`);

const required = [
  "README.md", "LICENSE", "cordis.patch.yml", "icon.svg", "assets/logo-light.svg",
  "assets/logo-dark.svg", "locale/en.json", "CONVERSION.md", "CHANGELOG.md",
  "skills/security-audit/SKILL.md", "skills/security-audit/DEEPSEEK-HARNESS.md",
  "skills/security-audit/RECONNAISSANCE.md", "skills/security-audit/HUNTING.md",
  "skills/security-audit/ATTACK-CLASSES.md", "skills/security-audit/VALIDATION-AND-REPORTING.md",
  "skills/security-audit/report-schema.json", "skills/security-audit/validate-findings.cjs",
  "skills/security-audit/validate-findings.test.cjs", "skills/security-audit/validate-coverage-ledger.cjs",
  "skills/security-audit/validate-coverage-ledger.test.cjs"
];
for (const p of required) await lstat(path.join(root, p));
JSON.parse(await read("skills/security-audit/report-schema.json"));
JSON.parse(await read("locale/en.json"));

const skill = await read("skills/security-audit/SKILL.md");
assert.match(skill, /^name: security-audit$/m);
assert.match(skill, /^description: .+$/m);
for (const marker of ["## Universal execution safety", "## Full audit workflow", "DEEPSEEK-HARNESS.md",
  "RECONNAISSANCE.md", "HUNTING.md", "VALIDATION-AND-REPORTING.md", "report-schema.json",
  "validate-findings.cjs", "validate-coverage-ledger.cjs"]) assert.ok(skill.includes(marker), `Main skill missing ${marker}`);

for (const p of ["icon.svg", "assets/logo-light.svg", "assets/logo-dark.svg"]) {
  const svg = await read(p);
  assert.match(svg, /<svg\b/);
  const m = svg.match(/viewBox=["']0 0 (\d+) (\d+)["']/);
  assert.ok(m && m[1] === m[2], `${p} must use a square viewBox`);
  assert.ok(!/https?:\/\//i.test(svg), `${p} must be self-contained`);
}
async function scan(dir, rel = "") {
  for (const entry of await readdir(dir, {withFileTypes:true})) {
    const next = rel ? rel + "/" + entry.name : entry.name;
    assert.ok(!next.split("/").includes(".."), `unsafe path ${next}`);
    const full = path.join(dir, entry.name);
    const st = await lstat(full);
    assert.ok(!st.isSymbolicLink(), `symlink forbidden: ${next}`);
    if (entry.isDirectory()) await scan(full, next);
    if (/(^|\/)(__pycache__|node_modules|\.git)(\/|$)|\.pyc$/.test(next)) assert.fail(`transient/unwanted path: ${next}`);
  }
}
await scan(root);

for (const p of ["README.md", "CONVERSION.md", "skills/security-audit/SKILL.md", "skills/security-audit/DEEPSEEK-HARNESS.md"]) {
  const body = await read(p);
  const base = path.dirname(path.join(root, p));
  for (const m of body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const href = m[1].trim();
    if (!href || href.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//")) continue;
    const target = decodeURIComponent(href.split("#", 1)[0]);
    if (!target) continue;
    const resolved = path.resolve(base, target);
    assert.ok(resolved === root || resolved.startsWith(root + path.sep), `markdown link escapes root: ${p} -> ${href}`);
    await lstat(resolved).catch(() => { throw new Error(`broken local link: ${p} -> ${href}`); });
  }
}
console.log("DSH bundle package validation passed.");
