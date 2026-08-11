import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicDir = join(root, 'public');
const required = [
  'index.html', 'privacy.html', '404.html', 'styles.css', 'script.js', '_headers',
  'assets/proventus-mark.svg', 'assets/proventus-lockup.svg', 'assets/proventus-finance-og.png'
];

for (const file of required) await access(join(publicDir, file));

const index = await readFile(join(publicDir, 'index.html'), 'utf8');
const css = await readFile(join(publicDir, 'styles.css'), 'utf8');
const script = await readFile(join(publicDir, 'script.js'), 'utf8');

const checks = [
  ['five named services', ['Accounting', 'Payroll', 'VAT', 'Tax declarations', 'Financial reporting'].every((term) => index.includes(term))],
  ['one h1', (index.match(/<h1/g) || []).length === 1],
  ['page title', index.includes('<title>Proventus Finance')],
  ['meta description', index.includes('name="description"')],
  ['skip link', index.includes('class="skip-link"')],
  ['privacy route', index.includes('href="/privacy"')],
  ['Airise ship credit', index.includes('Intelligence powered by Airise')],
  ['reduced motion CSS', css.includes('prefers-reduced-motion: reduce')],
  ['responsive CSS', css.includes('@media (max-width: 760px)')],
  ['navigation JS', script.includes("[data-nav-toggle]")],
];

const failed = checks.filter(([, passed]) => !passed);
for (const [name, passed] of checks) console.log(`${passed ? 'PASS' : 'FAIL'}  ${name}`);
if (failed.length) process.exit(1);
console.log(`\n${checks.length} checks passed.`);
