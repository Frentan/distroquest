#!/usr/bin/env python3
"""Check or refresh DistroQuest's disposable relationship maps; never execute app modules."""

import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile

from inspect_docs import inspect as inspect_docs, write_result
from render import dot, load, render, selections

TOOL_DIR = Path(__file__).resolve().parent
REPORT_DIR = 'reports/relationship-graph'
EXCLUDED = (REPORT_DIR + '/', 'scripts/relationship_graph/')
EXTENSIONS = {'.md', '.ts', '.tsx', '.astro', '.mjs', '.js'}
ARTIFACTS = {'README.md', 'documentation/overview.png', 'code/engine-neighborhood.png'}
EXPORT_ARTIFACTS = {'README.md'} | {
    f'{folder}/{name}{suffix}'
    for folder, name in (('documentation', 'overview'), ('code', 'engine-neighborhood'))
    for suffix in ('.dot', '.svg', '.png')
} | {f'{folder}/{name}' for folder in ('documentation', 'code')
     for name in ('nodes.jsonl', 'edges.jsonl', 'diagnostics.json')}


def canonical(value):
    return json.dumps(value, sort_keys=True, ensure_ascii=False, indent=2) + '\n'


def digest(data):
    return hashlib.sha256(data).hexdigest()


def inventory(root):
    result = subprocess.run(['git', '-C', str(root), 'ls-files', '--cached', '--others',
                             '--exclude-standard', '-z'], check=True, capture_output=True)
    return sorted({name for name in result.stdout.decode('utf-8').split('\0')
                   if name and Path(name).suffix in EXTENSIONS and not name.startswith(EXCLUDED)})


def target_directory(root):
    for rel in ('reports', REPORT_DIR):
        if (root / rel).is_symlink():
            raise ValueError('Report directory must not be a symlink: ' + rel)
    folder = root / REPORT_DIR
    if folder.exists():
        for path in folder.rglob('*'):
            if path.is_symlink():
                raise ValueError('Report artifacts must not be symlinks: ' + str(path.relative_to(root)))
            if path.is_file() and path.relative_to(folder).as_posix() not in ARTIFACTS | {'snapshot.json'}:
                raise ValueError('Unexpected file in generated directory: ' + str(path.relative_to(root)))
    return folder


def state(root, names, docs, code):
    version = subprocess.run(['dot', '-V'], check=True, capture_output=True, timeout=10)
    return {
        'schema': 1,
        'inventory': names,
        'graph_sha256': digest(canonical({'documentation': docs, 'code': code}).encode()),
        'implementation': {p.name: digest(p.read_bytes()) for p in sorted(TOOL_DIR.iterdir())
                           if p.suffix in {'.py', '.mjs', '.json'}},
        'configuration': {rel: digest((root / rel).read_bytes())
                          for rel in ('tsconfig.json', 'package.json', 'package-lock.json')},
        'renderer': (version.stdout + version.stderr).decode().strip(),
        'parsers': code['diagnostics']['tools'],
        'png_dpi': 110,
    }


def freshness(folder, current):
    try:
        saved = json.loads((folder / 'snapshot.json').read_text(encoding='utf-8'))
        if (saved['fingerprint'] != digest(canonical(saved['state']).encode())
                or set(saved['artifacts']) != ARTIFACTS):
            return ['snapshot manifest is invalid']
    except (OSError, ValueError, KeyError, TypeError):
        return ['snapshot manifest is missing or invalid']
    reasons = []
    if saved['state'] != current:
        reasons.append('inputs, relationships, tools, theme, or view definitions changed')
    for rel in sorted(ARTIFACTS):
        path = folder / rel
        if not path.is_file() or digest(path.read_bytes()) != saved['artifacts'][rel]:
            reasons.append('missing or modified artifact: ' + rel)
    return reasons


def report(docs, code, doc_view, code_view, current):
    dd, cd = docs['diagnostics'], code['diagnostics']
    dc, cc = dd['counts'], cd['counts']
    def files(keys):
        return ['- `' + key.removeprefix('file:') + '`' for key in keys] or ['None.']
    lines = ['# DistroQuest relationship maps', '',
             'Generated from explicit file links and module references. Source files remain',
             'canonical; these maps are disposable. Placement adds no relationships.', '',
             '```sh', 'python3 -B scripts/relationship_graph/refresh.py --check',
             'python3 -B scripts/relationship_graph/refresh.py --refresh', '```', '',
             'Run from the repository root. Check is read-only: exit 0 means current, 1 stale,',
             'and 2 error. Refresh regenerates this directory; do not edit its contents.',
             'Both modes parse files without executing application modules or starting a server.', '',
             '## Questions', '',
             '1. Which documentation is reachable from the root README?',
             '2. Which application, tooling, and test files reference the ranking engine?',
             '3. Which dependency cycles involve type-only references?', '',
             '## Documentation navigation', '',
             f"Scanned {dc['documents']} Markdown files. The extraction has {dc['nodes']} nodes and {dc['edges']} edges;",
             f'the view shows {len(doc_view[0])} nodes and {len(doc_view[1])} inter-file edges. Self-links stay in the data.', '',
             '![Documentation navigation](documentation/overview.png)', '',
             'Files unreachable from the root README:', '']
    lines += files(dd['unreachable_from_readme'])
    lines += ['', 'The art roster and style guide intentionally form a separate reference pair.',
              'Root reachability differs from having incoming links; this is not a repair request.', '',
              'Documents without incoming links from another scanned document:', '']
    lines += files(dd['no_incoming_document_links'])
    lines += ['', f"Missing local targets: {dc['issues'].get('missing_target', 0)}. Unchecked fragment occurrences: {dc['issues'].get('unchecked_anchor', 0)}.",
              'External URLs are counted, never fetched. Images are checked as resources rather',
              'than relationship edges. Duplicate links retain every source occurrence.', '',
              '## Recommendation-engine neighborhood', '',
              f"Scanned {cc['files']} code files; {cc['literal_occurrences']} resolved literal occurrences form {cc['edges']} typed edges",
              f"across {cc['nodes']} nodes. Mixed declarations can contribute both value and type edges.", '',
              '![Recommendation-engine neighborhood](code/engine-neighborhood.png)', '',
              f'The view contains {len(code_view[0])} nodes and {len(code_view[1])} edges: the engine, its direct static',
              'value-reference users and local dependencies, plus the English quiz route,',
              'QuizPage, Quiz and client. Other locales are scanned but omitted from this view.',
              'Views refuse more than 25 nodes or 50 edges rather than silently truncating.', '',
              'The processed script in Quiz.astro records its bridge to quiz/client.ts.',
              'The route/component/client/state/engine chain is a static dependency path,',
              'not proof of runtime execution order.', '',
              f"Direct static value-reference users of the engine ({len(cd['direct_value_users_of_engine'])}):", '']
    lines += files(cd['direct_value_users_of_engine'])
    lines += ['', f"Resolved static value cycles: {len(cd['resolved_static_value_cycles'])}.",
              f"Groups with cycles across all reference kinds: {len(cd['all_reference_cycles'])}.",
              'Literal dynamic imports are excluded from the static-value cycle check.', '']
    for label, groups in (('Static value group', cd['resolved_static_value_cycles']),
                          ('All-reference group', cd['all_reference_cycles'])):
        for group in groups:
            lines += [f'{label} ({len(group)} files):', ''] + files(group) + ['']
    lines += ['A type-closing cycle records a type contract; it does not establish a runtime defect.', '',
              'Unresolved or unsupported code forms:', '']
    lines += ['- `' + issue['path'] + (':' + str(issue['line']) if 'line' in issue else '')
              + '`: ' + issue['kind'] for issue in cd['issues']] or ['None.']
    lines += ['', '## Scope and reproduction', '',
              '- Inputs are tracked and non-ignored untracked Markdown, TS, TSX, Astro, JS and MJS.',
              '  AGENTS.md and symlinks are not scanned as documentation. Ignored files, generated',
              '  reports and this graph toolkit are excluded. Explicit code links become terminal targets.',
              '- Relative Markdown paths are resolved from the referring file, with URL decoding.',
              '  Missing targets, unsupported syntax, symlinks and boundary escapes are reported.',
              '  Anchors are recorded but not validated; HTML anchor links and wiki links are unsupported.',
              '- Code uses the installed TypeScript resolver and Astro compiler. Literal imports,',
              '  re-exports, types, frontmatter and processed scripts retain exact source locations.',
              '  Computed imports, require, globs, script src and unprocessed scripts are reported',
              '  without guessing targets. Packages and built-ins are terminal nodes.',
              '- This is not a call graph, bundle analysis, runtime coverage or dead-code detector.',
              '  Astro file routes need no incoming imports. No semantic edges are inferred.',
              '- Requirements: Python 3 standard library, existing npm dependencies, Graphviz dot',
              '  and Fira Sans (regular, bold and italic). No extra npm or Python dependencies.',
              '  Fonts and renderer versions can affect pixels; identical environments reproduce bytes.',
              '- The versioned Modern Dark preset is scripts/relationship_graph/modern_dark.json.',
              '  There is no runtime dependency on another repository.',
              '- Refresh after changes to scanned inputs, link targets, resolver configuration,',
              '  parser versions or this toolkit. Use --export /tmp/new-directory for a disposable trial.',
              '  Stop and reconsider the view if its bound fails or the map loses explanatory value.', '',
              'Fixture tests:', '', '```sh',
              'python3 -B -m unittest discover -s scripts/relationship_graph -p "test_*.py"',
              'node --test --experimental-test-isolation=none scripts/relationship_graph/test_code.mjs',
              '```', '',
              'Only this report, two PNGs and snapshot.json are retained. For SVG, DOT, JSONL',
              'with per-occurrence provenance, and diagnostics, export the complete bundle:', '',
              '```sh', 'python3 -B scripts/relationship_graph/refresh.py --export /tmp/distroquest-graph-export',
              '```', '',
              'snapshot.json records input/tool fingerprints and artifact hashes. Generated outputs',
              'and this toolkit can be removed without changing the application.', '',
              'Snapshot fingerprint: `' + digest(canonical(current).encode()) + '`.', '']
    return '\n'.join(lines)


def build(root, scratch):
    names = inventory(root)
    inputs = scratch / 'inventory.json'
    inputs.write_text(canonical(names), encoding='utf-8')
    docs = inspect_docs(root, names)
    write_result(docs, scratch / 'documentation')
    subprocess.run(['node', str(TOOL_DIR / 'inspect_code.mjs'), str(root), str(inputs),
                    str(scratch / 'code')], check=True, capture_output=True, timeout=120)
    code = load(scratch / 'code')
    doc_view, code_view = selections(docs, code)
    current = state(root, names, docs, code)
    return docs, code, doc_view, code_view, current


def render_all(scratch, docs, code, doc_view, code_view, current, artifacts=ARTIFACTS):
    render(scratch / 'documentation', 'overview', dot(docs, *doc_view, 'docs'))
    render(scratch / 'code', 'engine-neighborhood', dot(code, *code_view, 'code'))
    (scratch / 'README.md').write_text(report(docs, code, doc_view, code_view, current), encoding='utf-8')
    manifest = {'state': current, 'fingerprint': digest(canonical(current).encode()),
                'artifacts': {rel: digest((scratch / rel).read_bytes()) for rel in sorted(artifacts)}}
    (scratch / 'snapshot.json').write_text(canonical(manifest), encoding='utf-8')


def publish(scratch, folder, artifacts=ARTIFACTS):
    folder.mkdir(parents=True, exist_ok=True)
    for rel in sorted(artifacts | {'snapshot.json'}):
        target = folder / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        staged = target.with_name(target.name + '.new')
        if staged.exists() or staged.is_symlink():
            raise ValueError('Unexpected staging file: ' + str(staged))
        staged.write_bytes((scratch / rel).read_bytes())
        staged.replace(target)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root', type=Path, default=TOOL_DIR.parents[1])
    mode = ap.add_mutually_exclusive_group(required=True)
    mode.add_argument('--check', action='store_true')
    mode.add_argument('--refresh', action='store_true')
    mode.add_argument('--export', type=Path, metavar='NEW_TMP_DIRECTORY')
    args = ap.parse_args()
    root = args.root.resolve()
    try:
        folder = target_directory(root)
        if args.export:
            folder = args.export.absolute()
            if (folder.exists() or folder.is_symlink()
                    or not folder.resolve().is_relative_to(Path('/tmp'))):
                raise ValueError('Export requires a new directory under /tmp.')
        with tempfile.TemporaryDirectory(prefix='dq-relationship-') as temp:
            scratch = Path(temp)
            docs, code, doc_view, code_view, current = build(root, scratch)
            if args.check:
                reasons = freshness(folder, current)
                print('Relationship maps are current.' if not reasons else 'Stale: ' + '; '.join(reasons))
                return int(bool(reasons))
            artifacts = EXPORT_ARTIFACTS if args.export else ARTIFACTS
            render_all(scratch, docs, code, doc_view, code_view, current, artifacts)
            # Check input and dependency state again before writing retained artifacts.
            with tempfile.TemporaryDirectory(prefix='dq-relationship-verify-') as verify:
                if build(root, Path(verify))[-1] != current:
                    raise ValueError('Inputs changed during generation; rerun before retaining output.')
            if not args.export:
                target_directory(root)
            publish(scratch, folder, artifacts)
            print('Generated relationship maps: ' + str(folder))
            return 0
    except (OSError, ValueError, KeyError, subprocess.SubprocessError) as exc:
        print('Graph error: ' + str(exc))
        return 2


if __name__ == '__main__':
    raise SystemExit(main())
