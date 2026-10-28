#!/usr/bin/env python3
"""Render the two bounded DistroQuest relationship views."""

import argparse
from html import escape
import json
from pathlib import Path
import subprocess
import textwrap


THEME_PATH = Path(__file__).with_name('modern_dark.json')


def attributes(values):
    return ', '.join(key + '=' + json.dumps(value, ensure_ascii=False) for key, value in values.items())


def heading(title, explanations, theme):
    spacing = theme['heading']
    label = ('<TABLE BORDER="0" CELLBORDER="0" CELLPADDING="' + str(spacing['cellpadding'])
             + '" CELLSPACING="' + str(spacing['cellspacing']) + '">'
             + '<TR><TD><B>' + escape(title) + '</B></TD></TR>')
    style = theme['legend']
    if explanations:
        label += ('<TR><TD><FONT POINT-SIZE="' + escape(str(style['fontsize']), quote=True)
                  + '" COLOR="' + escape(style['fontcolor'], quote=True)
                  + '"><I>' + '<BR/>'.join(escape(line) for line in explanations)
                  + '</I></FONT></TD></TR>')
    return '<' + label + '</TABLE>>'


def load(folder):
    return {'nodes': [json.loads(line) for line in (folder / 'nodes.jsonl').read_text().splitlines()],
            'edges': [json.loads(line) for line in (folder / 'edges.jsonl').read_text().splitlines()],
            'diagnostics': json.loads((folder / 'diagnostics.json').read_text())}


def selections(docs, code):
    document_nodes = {n['id'] for n in docs['nodes']}
    document_edges = [e for e in docs['edges'] if e['source'] != e['target']]
    engine = 'file:src/recommendations/engine.ts'
    value = lambda edge: not edge['type'].endswith('_type') and edge['type'] != 'imports_dynamic'
    selected = {engine} | set(code['diagnostics']['direct_value_users_of_engine'])
    selected |= {'file:' + name for name in ('src/pages/quiz.astro', 'src/components/QuizPage.astro',
                                           'src/components/Quiz.astro', 'src/quiz/client.ts')}
    selected |= {e['target'] for e in code['edges'] if e['source'] == engine and value(e) and e['target'].startswith('file:')}
    missing = selected - {node['id'] for node in code['nodes']}
    if missing:
        raise ValueError('View inputs moved or disappeared: ' + ', '.join(sorted(missing)))
    code_edges = [e for e in code['edges'] if e['source'] in selected and e['target'] in selected]
    for nodes, edges in ((document_nodes, document_edges), (selected, code_edges)):
        if len(nodes) > 25 or len(edges) > 50:
            raise ValueError('Bounded view exceeds 25 nodes or 50 edges; do not truncate silently.')
    return (document_nodes, document_edges), (selected, code_edges)


def dot(data, nodes, edges, mode, legend=None):
    q = lambda value: json.dumps(value, ensure_ascii=False)
    theme = json.loads(THEME_PATH.read_text())
    legend_text = ('Arrows: Markdown links. Purple: separate art references.'
                   if mode == 'docs' else 'Solid cyan: values. Dashed gray: types.')
    title = 'DistroQuest documentation navigation' if mode == 'docs' else 'DistroQuest recommendation-engine neighborhood'
    show_legend = theme['legend_enabled'] if legend is None else legend
    explanations = (['Arrows are recorded references; layout proximity has no meaning.', legend_text]
                    if show_legend else [])
    lines = ['digraph trial {',
             'graph [rankdir=LR, pad=0.3, nodesep=0.3, ranksep=0.7, labelloc=t, '
             + attributes(theme['graph']) + ', label=' + heading(title, explanations, theme) + '];',
             'node [' + attributes({**theme['node'], **theme['categories']['neutral']}) + '];',
             'edge [' + attributes(theme['edge']) + '];']
    unreachable = set(data['diagnostics'].get('unreachable_from_readme', []))
    for node in data['nodes']:
        if node['id'] not in nodes:
            continue
        if mode == 'docs':
            label = '\n'.join(textwrap.wrap(node['label'], 30, break_long_words=False))
            if node['kind'] != 'document':
                label = node['path']
            category = 'tooling' if node['id'] in unreachable else 'application' if node['path'] == 'README.md' else 'neutral'
            if node['kind'] == 'module':
                category = 'application' if node['path'].startswith('src/') else 'tooling'
        else:
            parent = str(Path(node['path']).parent)
            label = node['layer'].upper() + '\n' + parent + '/\n' + Path(node['path']).name
            category = node['layer']
        lines.append(q(node['id']) + ' [' + attributes({'label': label, **theme['categories'][category]}) + '];')
    for edge in edges:
        typed = edge['type'].endswith('_type')
        tooltip = edge['type'] + ': ' + '; '.join(f"{e['path']}:{e['line']}:{e['column']}" for e in edge['evidence'])
        edge_style = theme['references']['type' if typed else 'value']
        lines.append(q(edge['source']) + ' -> ' + q(edge['target']) + ' [' + attributes({**edge_style, 'tooltip': tooltip}) + '];')
    return '\n'.join(lines + ['}', ''])


def render(folder, name, text):
    (folder / (name + '.dot')).write_text(text)
    for fmt in ('svg', 'png'):
        command = ['dot', '-T' + fmt]
        if fmt == 'png':
            command.append('-Gdpi=110')
        subprocess.run(command + [str(folder / (name + '.dot')), '-o', str(folder / (name + '.' + fmt))], check=True, capture_output=True, timeout=60)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root', type=Path, required=True)
    ap.add_argument('--docs', type=Path, required=True)
    ap.add_argument('--code', type=Path, required=True)
    args = ap.parse_args()
    if not all(p.resolve().is_relative_to(Path('/tmp')) for p in (args.docs, args.code)):
        raise ValueError('All trial artifacts must stay under /tmp.')
    docs, code = load(args.docs), load(args.code)
    doc_view, code_view = selections(docs, code)
    render(args.docs, 'overview', dot(docs, *doc_view, 'docs'))
    render(args.code, 'engine-neighborhood', dot(code, *code_view, 'code'))
    print(json.dumps({'documentation_view': [len(doc_view[0]), len(doc_view[1])], 'code_view': [len(code_view[0]), len(code_view[1])]}))


if __name__ == '__main__':
    main()
