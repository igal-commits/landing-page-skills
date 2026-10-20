// Lint the pack. Fails (exit 1) on:
//   - a skill whose frontmatter name differs from its folder, or whose description does not start
//     with "Use when" or is over 1024 characters
//   - an em dash or en dash anywhere in the text files (house style)
//   - anything that looks like a secret, an internal identifier, a private path or an email
// Run: node tools/lint-pack.mjs
import fs from 'fs';
import path from 'path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const TEXT = /\.(md|json|js|mjs|sh|html|css|txt|yml|yaml)$/;
const SKIP_DIRS = new Set(['.git', 'node_modules']);
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p); else if (TEXT.test(e.name) || e.name === 'LICENSE') files.push(p);
  }
})(root);

const problems = [];
const rel = f => path.relative(root, f);

// ---- skills
for (const d of fs.readdirSync(path.join(root, 'skills'))) {
  const f = path.join(root, 'skills', d, 'SKILL.md');
  if (!fs.existsSync(f)) { problems.push(`skills/${d}: no SKILL.md`); continue; }
  const t = fs.readFileSync(f, 'utf8');
  const m = t.match(/^---\nname: (.+)\ndescription: (.+)\n---\n/);
  if (!m) { problems.push(`skills/${d}: frontmatter must be name then description`); continue; }
  if (m[1] !== d) problems.push(`skills/${d}: name "${m[1]}" differs from folder`);
  if (!/^Use when/.test(m[2])) problems.push(`skills/${d}: description must start with "Use when"`);
  if (m[2].length > 1024) problems.push(`skills/${d}: description is ${m[2].length} characters`);
}

// ---- dashes and secrets
const secret = [
  [/AIza[0-9A-Za-z_\-]{20,}/, 'Google API key'],
  [/\bsk-[A-Za-z0-9_\-]{20,}/, 'secret key'],
  [/\bgh[pousr]_[A-Za-z0-9]{20,}/, 'GitHub token'],
  [/\bfigd_[A-Za-z0-9_\-]{20,}/, 'Figma token'],
  [/\bxox[abprs]-[A-Za-z0-9\-]{10,}/, 'Slack token'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS key id'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
  [/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i, 'uuid (internal identifier?)'],
  [/\b[0-9a-f]{24}\b/i, '24-hex id (site or item id?)'],
  [/\b[0-9a-f]{32}\b/i, '32-hex id (page or hash?)'],
  [/\/Users\/[A-Za-z0-9_.\-]+/, 'private home path'],
  [/(^|[^A-Za-z])~\/(\.claude\.json|\.env|\.ssh|\.config)/, 'config path'],
  [/[A-Za-z0-9._%+\-]+@(?!users\.noreply\.github\.com|example\.com)[A-Za-z0-9.\-]+\.[a-z]{2,}/, 'email address'],
  [/\.env\.[a-z]+/, 'env file name'],
];
for (const f of files) {
  const t = fs.readFileSync(f, 'utf8');
  if (t.includes(String.fromCharCode(8212)) || t.includes(String.fromCharCode(8211))) problems.push(`${rel(f)}: contains an em or en dash`);
  if (rel(f) === 'tools/lint-pack.mjs') continue;
  for (const [re, what] of secret) {
    const m = t.match(re);
    if (m) problems.push(`${rel(f)}: ${what}: ${m[0].slice(0, 40)}`);
  }
}

if (problems.length) { console.error(problems.join('\n')); console.error(`\n${problems.length} problem(s)`); process.exit(1); }
console.log(`ok: ${fs.readdirSync(path.join(root, 'skills')).length} skills, ${files.length} text files checked`);
