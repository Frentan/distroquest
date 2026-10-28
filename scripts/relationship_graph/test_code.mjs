import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspect, writeResult } from './inspect_code.mjs';

const dependencyRoot =
  process.env.DQ_GRAPH_DEPENDENCY_ROOT ??
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
function fixture(t, entries, options = {}) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'dq-code-fixture-'));
  const root = path.join(base, 'repo');
  fs.mkdirSync(root);
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  const content = {
    'tsconfig.json': JSON.stringify({
      compilerOptions: {
        module: 'ESNext',
        moduleResolution: 'Bundler',
        allowImportingTsExtensions: true,
        ...options,
      },
    }),
    ...entries,
  };
  for (const [name, value] of Object.entries(content)) {
    const p = path.join(root, name);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, value);
  }
  return { root, base, inventory: Object.keys(entries) };
}

test('mixed imports and type-closing cycles remain distinct', async (t) => {
  const f = fixture(t, {
    'a.ts': "import { value, type Shape } from './b.ts'; export const a=value;",
    'b.ts':
      "import type { a } from './a.ts'; export const value=1; export type Shape=typeof a;",
  });
  const r = await inspect(f.root, f.inventory, dependencyRoot);
  assert(
    r.edges.some((e) => e.source === 'file:a.ts' && e.type === 'imports_value'),
  );
  assert(
    r.edges.some((e) => e.source === 'file:a.ts' && e.type === 'imports_type'),
  );
  assert.deepEqual(r.diagnostics.resolved_static_value_cycles, []);
  assert.deepEqual(r.diagnostics.all_reference_cycles, [
    ['file:a.ts', 'file:b.ts'],
  ]);
});

test('extensionless imports, index modules and configured aliases resolve', async (t) => {
  const f = fixture(
    t,
    {
      'src/a.ts':
        "import {x} from './lib'; import type {T} from '@domain/types';",
      'src/lib/index.ts': 'export const x=1;',
      'src/domain/types.ts': 'export type T=string;',
    },
    { paths: { '@domain/*': ['./src/domain/*'] } },
  );
  const r = await inspect(f.root, f.inventory, dependencyRoot);
  assert(r.edges.some((e) => e.target === 'file:src/lib/index.ts'));
  assert(
    r.edges.some(
      (e) =>
        e.target === 'file:src/domain/types.ts' && e.type === 'imports_type',
    ),
  );
  assert(!r.diagnostics.issues.length);
});

test('Astro frontmatter and processed script preserve Unicode source positions', async (t) => {
  const source =
    "---\nconst label='é😀';\nimport {x} from './dep.ts';\n---\n<p>é😀</p>\n<script>import {y} from './client.ts';</script>";
  const f = fixture(t, {
    'page.astro': source,
    'dep.ts': 'export const x=1;',
    'client.ts': 'export const y=1;',
  });
  const r = await inspect(f.root, f.inventory, dependencyRoot);
  for (const edge of r.edges.filter((e) => e.source === 'file:page.astro')) {
    const ev = edge.evidence[0];
    assert.equal(
      source.slice(ev.utf16_offset, ev.utf16_offset + ev.syntax.length),
      ev.syntax,
    );
    assert.equal(
      Buffer.from(source)
        .subarray(ev.byte_offset, ev.byte_offset + Buffer.byteLength(ev.syntax))
        .toString(),
      ev.syntax,
    );
  }
  assert(r.edges.some((e) => e.evidence[0].zone === 'frontmatter'));
  assert(r.edges.some((e) => e.evidence[0].zone === 'script'));
});

test('computed imports and unsupported script forms are reported without guessing', async (t) => {
  const f = fixture(t, {
    'dynamic.ts': "const name='./dep.ts'; import(name);",
    'page.astro':
      "<script is:inline>import {x} from './dep.ts';</script><script src='./client.ts'></script>",
    'dep.ts': 'export const x=1;',
  });
  const r = await inspect(f.root, f.inventory, dependencyRoot);
  const kinds = r.diagnostics.issues.map((i) => i.kind);
  assert(kinds.includes('computed_import'));
  assert(kinds.includes('unprocessed_script_import'));
  assert(kinds.includes('unsupported_script_src'));
  assert(!r.edges.length);
});

test('literal dynamic imports, re-exports and CSS resources keep their kinds', async (t) => {
  const f = fixture(t, {
    'a.ts':
      "import './style.css'; export type {T} from './dep.ts'; export {x} from './dep.ts'; import('./dep.ts');",
    'dep.ts': 'export const x=1; export type T=string;',
    'style.css': '',
  });
  const r = await inspect(f.root, f.inventory, dependencyRoot);
  assert.deepEqual(
    new Set(r.edges.map((e) => e.type)),
    new Set([
      'imports_resource',
      'reexports_type',
      'reexports_value',
      'imports_dynamic',
    ]),
  );
});

test('parsing never executes application files; missing targets remain diagnostics', async (t) => {
  const f = fixture(t, {
    'src/pages/index.ts':
      "throw new Error('Must not execute'); import './missing.ts';",
  });
  const r = await inspect(f.root, f.inventory, dependencyRoot);
  assert.equal(r.diagnostics.issues[0].kind, 'unresolved_literal_import');
  assert.equal(r.nodes[0].entry_rule, 'Astro file-based route or endpoint');
});

test('literal dynamic cycles are not presented as static value cycles', async (t) => {
  const f = fixture(t, {
    'a.ts': "import('./b.ts');",
    'b.ts': "import('./a.ts');",
  });
  const r = await inspect(f.root, f.inventory, dependencyRoot);
  assert.deepEqual(r.diagnostics.resolved_static_value_cycles, []);
  assert.deepEqual(r.diagnostics.all_reference_cycles, [
    ['file:a.ts', 'file:b.ts'],
  ]);
});

test('serialization is deterministic and refuses existing output', async (t) => {
  const f = fixture(t, { 'a.ts': 'export const x=1;' });
  const a = path.join(f.base, 'a'),
    b = path.join(f.base, 'b');
  writeResult(await inspect(f.root, f.inventory, dependencyRoot), a);
  writeResult(
    await inspect(f.root, [...f.inventory].reverse(), dependencyRoot),
    b,
  );
  for (const name of fs.readdirSync(a))
    assert.deepEqual(
      fs.readFileSync(path.join(a, name)),
      fs.readFileSync(path.join(b, name)),
    );
  assert.throws(() => writeResult({}, a));
});
