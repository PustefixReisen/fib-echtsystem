import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve('apps/editorial-web/dist');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const paths = [...html.matchAll(/(?:src|href)="(\/redaktion\/[^"]+)"/g)].map(match => match[1]);
if (!paths.some(path => path.endsWith('.js')) || !paths.some(path => path.endsWith('.css'))) {
  throw new Error('index.html must reference JS and CSS assets');
}
for (const path of paths) {
  const relative = path.slice('/redaktion/'.length);
  const full = resolve(root, relative);
  if (!full.startsWith(root + '/')) throw new Error('Unsafe asset path: ' + path);
  if (!statSync(full).isFile() || statSync(full).size < 100) throw new Error('Missing or empty asset: ' + path);
}
let checked = 0;
for (const name of readdirSync(join(root, 'assets'))) {
  if (!name.endsWith('.js')) continue;
  const file = join(root, 'assets', name);
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error('JavaScript syntax invalid: ' + name + '\n' + result.stderr);
  checked++;
}
if (!checked) throw new Error('No JavaScript bundles found');
console.log('Editorial build validated:', checked, 'JS bundle(s),', paths.length, 'HTML asset references.');
