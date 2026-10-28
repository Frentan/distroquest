/** DistroQuest static-dependency adapter; never imports application modules. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const canonical = (value) =>
  JSON.stringify(value, (_, v) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(
          Object.entries(v).sort(([a], [b]) => a.localeCompare(b, 'en')),
        )
      : v,
  );
const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');
const codeExtension = /\.(?:ts|tsx|astro|mjs|js)$/;

function safePath(root, relative) {
  if (path.isAbsolute(relative) || relative.split('/').includes('..'))
    throw new Error('Unsafe input: ' + relative);
  const parts = relative.split('/');
  return !parts.some((_, index) => {
    const p = path.join(root, ...parts.slice(0, index + 1));
    return fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink();
  });
}

export async function inspect(root, inventory, dependencyRoot = root) {
  root = fs.realpathSync(root);
  const require = createRequire(path.join(dependencyRoot, 'package.json'));
  const ts = require('typescript');
  const { parse } = await import(
    pathToFileURL(require.resolve('@astrojs/compiler-rs')).href
  );
  const compilerPackage = JSON.parse(
    fs.readFileSync(require.resolve('@astrojs/compiler-rs/package.json')),
  );
  const configPath = path.join(root, 'tsconfig.json');
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  if (config.error)
    throw new Error(
      ts.flattenDiagnosticMessageText(config.error.messageText, '\n'),
    );
  const parsedConfig = ts.parseJsonConfigFileContent(
    config.config,
    ts.sys,
    root,
  );
  const options = parsedConfig.options;
  const files = [...new Set(inventory)]
    .filter(
      (f) =>
        codeExtension.test(f) &&
        !f.startsWith('scripts/relationship_graph/') &&
        !f.startsWith('reports/relationship-graph/') &&
        safePath(root, f),
    )
    .sort();
  const nodes = new Map(),
    edges = new Map(),
    issues = [],
    inputs = [],
    occurrences = [];
  const layer = (file) =>
    file.startsWith('src/')
      ? 'application'
      : file.startsWith('tests/')
        ? 'tests'
        : 'tooling';
  function fileNode(file) {
    const id = 'file:' + file;
    if (!nodes.has(id))
      nodes.set(id, {
        id,
        path: file,
        label: path.basename(file),
        kind: file.endsWith('.css') ? 'style' : 'module',
        layer: layer(file),
        scanned: files.includes(file),
        ...(file.startsWith('src/pages/')
          ? { entry_rule: 'Astro file-based route or endpoint' }
          : {}),
      });
    return id;
  }
  files.forEach(fileNode);
  function position(text, offset) {
    // Both installed parsers return UTF-16 AST offsets, verified with Unicode fixtures.
    const prefix = text.slice(0, offset),
      line = prefix.split('\n').length;
    return {
      line,
      column: [...prefix.slice(prefix.lastIndexOf('\n') + 1)].length + 1,
      utf16_offset: offset,
      byte_offset: Buffer.byteLength(prefix, 'utf8'),
    };
  }
  function record(file, text, specifier, kinds, zone, offset, end, rule) {
    const ev = {
      path: file,
      ...position(text, offset),
      literal: specifier,
      syntax: text.slice(offset, end),
      zone,
      rule,
      parser: file.endsWith('.astro') ? 'astro/compiler-rs' : 'typescript',
    };
    let target;
    if (!specifier.startsWith('.')) {
      const builtin = specifier.startsWith('node:');
      const packageName = builtin
        ? specifier
        : specifier.startsWith('@')
          ? specifier.split('/').slice(0, 2).join('/')
          : specifier.split('/')[0];
      // TS aliases, when configured, resolve before treating a bare name as a package.
      const resolved =
        !builtin && options.paths
          ? ts.resolveModuleName(
              specifier,
              path.join(root, file),
              options,
              ts.sys,
            ).resolvedModule
          : undefined;
      if (resolved && !resolved.isExternalLibraryImport)
        target = path
          .relative(root, resolved.resolvedFileName)
          .replaceAll(path.sep, '/');
      else {
        target = (builtin ? 'builtin:' : 'package:') + packageName;
        nodes.set(target, {
          id: target,
          label: packageName,
          kind: builtin ? 'builtin' : 'package',
          scanned: false,
        });
      }
    } else {
      const exact = path.resolve(root, path.dirname(file), specifier);
      if (/\.(?:astro|css)$/.test(specifier) && fs.existsSync(exact))
        target = path.relative(root, exact).replaceAll(path.sep, '/');
      else {
        const resolved = ts.resolveModuleName(
          specifier,
          path.join(root, file),
          options,
          ts.sys,
        ).resolvedModule;
        if (resolved)
          target = path
            .relative(root, resolved.resolvedFileName)
            .replaceAll(path.sep, '/');
      }
      if (!target) {
        issues.push({ kind: 'unresolved_literal_import', ...ev });
        return;
      }
    }
    if (!target.startsWith('package:') && !target.startsWith('builtin:')) {
      if (target.startsWith('../') || !safePath(root, target)) {
        issues.push({ kind: 'outside_or_symlink_target', ...ev, target });
        return;
      }
      target = fileNode(target);
    }
    occurrences.push({ file, specifier, kinds, target });
    for (let kind of new Set(kinds)) {
      if (target.endsWith('.css')) kind = 'resource';
      const type =
        kind === 'resource'
          ? 'imports_resource'
          : rule === 're-export'
            ? 'reexports_' + kind
            : 'imports_' + kind;
      const key = canonical([fileNode(file), type, target]);
      if (!edges.has(key))
        edges.set(key, { source: fileNode(file), type, target, evidence: [] });
      const list = edges.get(key).evidence;
      if (!list.some((old) => canonical(old) === canonical(ev))) list.push(ev);
    }
  }
  function computed(file, text, offset, expression, zone) {
    issues.push({
      kind: 'computed_import',
      path: file,
      ...position(text, offset),
      expression,
      zone,
    });
  }
  function tsKinds(node) {
    if (node.isTypeOnly) return ['type'];
    if (ts.isImportDeclaration(node)) {
      const c = node.importClause;
      if (!c) return ['value'];
      if (c.phaseModifier === ts.SyntaxKind.TypeKeyword) return ['type'];
      const result = c.name ? ['value'] : [];
      if (c.namedBindings)
        result.push(
          ...(ts.isNamedImports(c.namedBindings)
            ? c.namedBindings.elements.map((e) =>
                e.isTypeOnly ? 'type' : 'value',
              )
            : ['value']),
        );
      return result.length ? result : ['value'];
    }
    return node.exportClause && ts.isNamedExports(node.exportClause)
      ? node.exportClause.elements.map((e) => (e.isTypeOnly ? 'type' : 'value'))
      : ['value'];
  }
  function parseTs(file, text) {
    const tree = ts.createSourceFile(
      file,
      text,
      ts.ScriptTarget.Latest,
      true,
      file.endsWith('.mjs') || file.endsWith('.js')
        ? ts.ScriptKind.JS
        : ts.ScriptKind.TS,
    );
    issues.push(
      ...tree.parseDiagnostics.map((d) => ({
        kind: 'parse_error',
        path: file,
        message: ts.flattenDiagnosticMessageText(d.messageText, '\n'),
      })),
    );
    function walk(n) {
      if (
        (ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) &&
        n.moduleSpecifier &&
        ts.isStringLiteral(n.moduleSpecifier)
      ) {
        record(
          file,
          text,
          n.moduleSpecifier.text,
          tsKinds(n),
          'module',
          n.moduleSpecifier.getStart(tree),
          n.moduleSpecifier.end,
          ts.isExportDeclaration(n) ? 're-export' : 'import',
        );
      }
      if (
        ts.isCallExpression(n) &&
        n.expression.kind === ts.SyntaxKind.ImportKeyword
      ) {
        const arg = n.arguments[0];
        if (
          arg &&
          (ts.isStringLiteral(arg) || ts.isNoSubstitutionTemplateLiteral(arg))
        )
          record(
            file,
            text,
            arg.text,
            ['dynamic'],
            'module',
            arg.getStart(tree),
            arg.end,
            'dynamic-import',
          );
        else
          computed(
            file,
            text,
            n.getStart(tree),
            arg?.getText(tree) ?? '',
            'module',
          );
      }
      if (
        ts.isImportTypeNode(n) &&
        ts.isLiteralTypeNode(n.argument) &&
        ts.isStringLiteral(n.argument.literal)
      ) {
        const arg = n.argument.literal;
        record(
          file,
          text,
          arg.text,
          ['type'],
          'module',
          arg.getStart(tree),
          arg.end,
          'import-type',
        );
      }
      if (
        ts.isCallExpression(n) &&
        n.expression.getText(tree) === 'import.meta.glob'
      )
        issues.push({
          kind: 'unsupported_glob',
          path: file,
          ...position(text, n.getStart(tree)),
        });
      if (ts.isCallExpression(n) && n.expression.getText(tree) === 'require')
        issues.push({
          kind: 'unsupported_require',
          path: file,
          ...position(text, n.getStart(tree)),
        });
      ts.forEachChild(n, walk);
    }
    walk(tree);
  }
  function parseAstro(file, text) {
    const { ast, diagnostics } = parse(text);
    issues.push(
      ...diagnostics.map((d) => ({
        kind: 'astro_diagnostic',
        path: file,
        severity: d.severity,
        message: d.text,
      })),
    );
    function walk(n, zone = 'template', unprocessedScript = false) {
      if (!n || typeof n !== 'object') return;
      if (
        n.type === 'JSXElement' &&
        n.openingElement?.name?.name === 'script'
      ) {
        const attrs = n.openingElement.attributes ?? [];
        const name = (a) =>
          a.name?.type === 'JSXNamespacedName'
            ? a.name.namespace.name + ':' + a.name.name.name
            : (a.name?.name ?? 'unknown');
        unprocessedScript = attrs.some((a) => name(a) !== 'src');
        for (const a of attrs)
          if (name(a) === 'src')
            issues.push({
              kind: 'unsupported_script_src',
              path: file,
              ...position(text, a.start),
              syntax: text.slice(a.start, a.end),
            });
      }
      if (n.type === 'AstroFrontmatter') zone = 'frontmatter';
      if (n.type === 'AstroScript')
        zone = unprocessedScript ? 'inline-script' : 'script';
      if (n.type === 'ImportDeclaration') {
        const kinds =
          n.importKind === 'type'
            ? ['type']
            : n.specifiers?.length
              ? n.specifiers.map((s) =>
                  s.importKind === 'type' ? 'type' : 'value',
                )
              : ['value'];
        if (unprocessedScript)
          issues.push({
            kind: 'unprocessed_script_import',
            path: file,
            ...position(text, n.start),
            literal: n.source.value,
          });
        else
          record(
            file,
            text,
            n.source.value,
            kinds,
            zone,
            n.source.start,
            n.source.end,
            'import',
          );
      }
      if (
        ['ExportNamedDeclaration', 'ExportAllDeclaration'].includes(n.type) &&
        n.source
      ) {
        const kinds =
          n.exportKind === 'type'
            ? ['type']
            : n.specifiers?.length
              ? n.specifiers.map((s) =>
                  s.exportKind === 'type' ? 'type' : 'value',
                )
              : ['value'];
        if (unprocessedScript)
          issues.push({
            kind: 'unprocessed_script_import',
            path: file,
            ...position(text, n.start),
            literal: n.source.value,
          });
        else
          record(
            file,
            text,
            n.source.value,
            kinds,
            zone,
            n.source.start,
            n.source.end,
            're-export',
          );
      }
      if (n.type === 'ImportExpression') {
        if (unprocessedScript)
          issues.push({
            kind: 'unprocessed_script_import',
            path: file,
            ...position(text, n.start),
          });
        else if (
          n.source?.type === 'Literal' &&
          typeof n.source.value === 'string'
        )
          record(
            file,
            text,
            n.source.value,
            ['dynamic'],
            zone,
            n.source.start,
            n.source.end,
            'dynamic-import',
          );
        else
          computed(
            file,
            text,
            n.start,
            text.slice(n.source?.start, n.source?.end),
            zone,
          );
      }
      for (const [key, value] of Object.entries(n)) {
        if (key === 'comments') continue;
        if (Array.isArray(value))
          value.forEach((v) => walk(v, zone, unprocessedScript));
        else if (value && typeof value === 'object')
          walk(value, zone, unprocessedScript);
      }
    }
    walk(ast);
  }
  for (const file of files) {
    const data = fs.readFileSync(path.join(root, file));
    inputs.push({ path: file, sha256: hash(data) });
    if (file.endsWith('.astro')) parseAstro(file, data.toString());
    else parseTs(file, data.toString());
  }
  const edgeRows = [...edges.values()].sort((a, b) =>
    canonical([a.source, a.type, a.target]).localeCompare(
      canonical([b.source, b.type, b.target]),
      'en',
    ),
  );
  for (const edge of edgeRows)
    edge.evidence.sort((a, b) =>
      canonical(a).localeCompare(canonical(b), 'en'),
    );
  const isValue = (e) =>
    !e.type.endsWith('_type') && e.type !== 'imports_dynamic';
  function cycles(rows) {
    const adjacency = new Map(files.map((f) => ['file:' + f, []]));
    for (const e of rows)
      if (adjacency.has(e.source) && adjacency.has(e.target))
        adjacency.get(e.source).push(e.target);
    let serial = 0;
    const indexes = new Map(),
      low = new Map(),
      stack = [],
      active = new Set(),
      groups = [];
    function visit(v) {
      indexes.set(v, serial);
      low.set(v, serial++);
      stack.push(v);
      active.add(v);
      for (const w of adjacency.get(v)) {
        if (!indexes.has(w)) {
          visit(w);
          low.set(v, Math.min(low.get(v), low.get(w)));
        } else if (active.has(w))
          low.set(v, Math.min(low.get(v), indexes.get(w)));
      }
      if (low.get(v) === indexes.get(v)) {
        const group = [];
        let w;
        do {
          w = stack.pop();
          active.delete(w);
          group.push(w);
        } while (w !== v);
        if (group.length > 1 || adjacency.get(v).includes(v))
          groups.push(group.sort());
      }
    }
    for (const v of [...adjacency.keys()].sort()) if (!indexes.has(v)) visit(v);
    return groups.sort((a, b) =>
      canonical(a).localeCompare(canonical(b), 'en'),
    );
  }
  const engine = 'file:src/recommendations/engine.ts';
  const directUsers = [
    ...new Set(
      edgeRows
        .filter((e) => e.target === engine && isValue(e))
        .map((e) => e.source),
    ),
  ].sort();
  const diagnosticCounts = Object.fromEntries(
    [...new Set(issues.map((i) => i.kind))]
      .sort()
      .map((kind) => [kind, issues.filter((i) => i.kind === kind).length]),
  );
  return {
    nodes: [...nodes.values()].sort((a, b) => a.id.localeCompare(b.id, 'en')),
    edges: edgeRows,
    diagnostics: {
      scope:
        'Tracked TS, Astro, JS and MJS only; static module references, not a call graph or bundle analysis.',
      tools: {
        node: process.version,
        typescript: ts.version,
        astroCompiler: compilerPackage.version,
      },
      inputs,
      configuration: {
        tsconfig_sha256: hash(fs.readFileSync(configPath)),
        paths: options.paths ?? null,
      },
      counts: {
        files: files.length,
        literal_occurrences: occurrences.length,
        edges: edgeRows.length,
        nodes: nodes.size,
        local_occurrences: occurrences.filter((o) =>
          o.target.startsWith('file:'),
        ).length,
        external_occurrences: occurrences.filter(
          (o) => !o.target.startsWith('file:'),
        ).length,
        issues: diagnosticCounts,
      },
      resolved_static_value_cycles: cycles(edgeRows.filter(isValue)),
      all_reference_cycles: cycles(edgeRows),
      direct_value_users_of_engine: directUsers,
      issues: issues.sort((a, b) =>
        canonical(a).localeCompare(canonical(b), 'en'),
      ),
    },
  };
}

export function writeResult(result, out) {
  const resolved = path.resolve(out);
  if (!resolved.startsWith('/tmp/'))
    throw new Error('Trial output must stay under /tmp.');
  fs.mkdirSync(resolved, { mode: 0o700 });
  for (const name of ['nodes', 'edges'])
    fs.writeFileSync(
      path.join(resolved, name + '.jsonl'),
      result[name].map(canonical).join('\n') + '\n',
    );
  fs.writeFileSync(
    path.join(resolved, 'diagnostics.json'),
    JSON.stringify(result.diagnostics, null, 2) + '\n',
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  const [root, inventory, out] = process.argv.slice(2);
  const result = await inspect(root, JSON.parse(fs.readFileSync(inventory)));
  writeResult(result, out);
  console.log(JSON.stringify(result.diagnostics.counts));
}
