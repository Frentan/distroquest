#!/usr/bin/env python3
"""DistroQuest documentation relationships; no source writes."""

import argparse
from bisect import bisect_right
from collections import Counter, defaultdict
import hashlib
import json
from pathlib import Path
import posixpath
import re
from urllib.parse import unquote, urlsplit


import markdown_links as parser

PARSER_PATH = Path(__file__).with_name('markdown_links.py')

def digest(data):
    return hashlib.sha256(data).hexdigest()


def safe_relative(root, rel):
    if rel.startswith('/') or '..' in Path(rel).parts:
        raise ValueError('Unsafe input path: ' + rel)
    return not any((root / Path(*Path(rel).parts[:i])).is_symlink()
                   for i in range(1, len(Path(rel).parts) + 1))


def inspect(root, inventory):
    root = Path(root).resolve()
    docs = []
    issues = []
    inputs = []
    for rel in sorted(set(inventory)):
        if not rel.endswith('.md'):
            continue
        if not safe_relative(root, rel):
            issues.append({'kind': 'excluded_symlink', 'path': rel})
        elif rel != 'AGENTS.md' and not rel.startswith(('reports/relationship-graph/', 'scripts/relationship_graph/')):
            docs.append(rel)
    nodes = {}
    edges = defaultdict(list)
    external = Counter()

    def node(rel, title=None):
        key = 'file:' + rel
        if key not in nodes:
            kind = 'document' if rel in docs else 'module' if Path(rel).suffix in {'.ts', '.mjs', '.astro'} else 'file'
            nodes[key] = {'id': key, 'path': rel, 'kind': kind, 'label': title or Path(rel).name,
                          'scanned': rel in docs}
        return key

    for rel in docs:
        data = (root / rel).read_bytes()
        inputs.append({'path': rel, 'sha256': digest(data)})
        title = next((line[2:].strip() for line in data.decode().splitlines() if line.startswith('# ')), Path(rel).name)
        node(rel, title)
    for rel in docs:
        text = (root / rel).read_text()
        starts = [0] + [m.end() for m in re.finditer('\n', text)]

        def evidence(offset, raw=None):
            line = bisect_right(starts, offset)
            result = {'path': rel, 'line': line, 'column': offset - starts[line - 1] + 1,
                      'rule': 'markdown_link', 'parser': 'bounded Markdown parser'}
            if raw is not None:
                result['literal'] = raw
            return result

        links, limitations = parser.markdown_links(text)
        issues.extend({'kind': kind, **evidence(offset)} for offset, kind in limitations)
        for link in links:
            ev = evidence(link['offset'], link['target'])
            if link['definition'] is not None:
                ev['definition'] = evidence(link['definition'])
            try:
                url = urlsplit(parser.UNESCAPE.sub(r'\1', link['target']))
                if url.scheme or url.netloc:
                    external[url.scheme or 'network_path'] += 1
                    continue
                if url.query or re.search(r'%(?![a-fA-F0-9]{2})', url.path):
                    raise ValueError('Unsupported query or encoding')
                decoded = unquote(url.path, errors='strict')
                if '\x00' in decoded or '\\' in decoded:
                    raise ValueError('Unsupported path')
                target = posixpath.normpath(posixpath.join(posixpath.dirname(rel), decoded)) if decoded else rel
                if decoded.startswith(('/', '~')) or target == '..' or target.startswith('../'):
                    issues.append({'kind': 'outside_repository', **ev})
                    continue
                if target.startswith(('reports/relationship-graph/', 'scripts/relationship_graph/')):
                    issues.append({'kind': 'excluded_output_or_tooling', **ev, 'target': target})
                    continue
                if not safe_relative(root, target):
                    issues.append({'kind': 'symlink_target', **ev, 'target': target})
                    continue
            except (ValueError, UnicodeError):
                issues.append({'kind': 'unsupported_destination', **ev})
                continue
            if not (root / target).is_file():
                issues.append({'kind': 'missing_target', **ev, 'target': target})
                continue
            if url.fragment:
                ev['fragment'] = url.fragment
                issues.append({'kind': 'unchecked_anchor', **ev, 'target': target})
            if link['resource']:
                issues.append({'kind': 'checked_resource', **ev, 'target': target})
                continue
            edges[node(rel), node(target)].append(ev)
    rows = [{'source': a, 'type': 'doc_links', 'target': b,
             'evidence': sorted(ev, key=lambda v: (v['path'], v['line'], v['column'], v['literal']))}
            for (a, b), ev in sorted(edges.items())]
    adjacency = defaultdict(set)
    incoming = defaultdict(set)
    for edge in rows:
        a, b = edge['source'], edge['target']
        if a != b and b.removeprefix('file:') in docs:
            adjacency[a].add(b)
            incoming[b].add(a)
    reachable = {'file:README.md'} if 'README.md' in docs else set()
    while True:
        expanded = reachable | {b for a in reachable for b in adjacency[a]}
        if expanded == reachable:
            break
        reachable = expanded
    diagnostics = {
        'scope': 'Tracked Markdown except AGENTS and symlinks; explicit file links only. Prose code paths are not edges.',
        'parser_dependency': {'path': 'scripts/relationship_graph/markdown_links.py', 'sha256': digest(PARSER_PATH.read_bytes())},
        'inputs': inputs,
        'counts': {'documents': len(docs), 'nodes': len(nodes), 'edges': len(rows),
                   'external_occurrences': dict(sorted(external.items())),
                   'issues': dict(sorted(Counter(i['kind'] for i in issues).items()))},
        'unreachable_from_readme': sorted('file:' + p for p in docs if 'file:' + p not in reachable),
        'no_incoming_document_links': sorted('file:' + p for p in docs if not incoming['file:' + p]),
        'interpretation': 'Root-unreachable art references are intentional for this project, not repair requests.',
        'issues': sorted(issues, key=lambda v: json.dumps(v, sort_keys=True)),
    }
    return {'nodes': sorted(nodes.values(), key=lambda n: n['id']), 'edges': rows, 'diagnostics': diagnostics}


def write_result(result, out):
    out = Path(out)
    if not out.resolve().is_relative_to(Path('/tmp')):
        raise ValueError('Trial output must stay under /tmp.')
    out.mkdir(mode=0o700, exist_ok=False)
    for name in ('nodes', 'edges'):
        (out / (name + '.jsonl')).write_text(''.join(json.dumps(row, sort_keys=True, ensure_ascii=False) + '\n' for row in result[name]))
    (out / 'diagnostics.json').write_text(json.dumps(result['diagnostics'], sort_keys=True, ensure_ascii=False, indent=2) + '\n')


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root', type=Path, required=True)
    ap.add_argument('--inventory', type=Path, required=True)
    ap.add_argument('--out', type=Path, required=True)
    args = ap.parse_args()
    result = inspect(args.root, json.loads(args.inventory.read_text()))
    write_result(result, args.out)
    print(json.dumps(result['diagnostics']['counts'], sort_keys=True))


if __name__ == '__main__':
    main()
