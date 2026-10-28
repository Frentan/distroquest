"""Retention contracts: inputs, self-exclusion, artifact integrity and safe boundaries."""

from pathlib import Path
import json
import subprocess
import tempfile
import unittest
from unittest.mock import patch

import refresh
from inspect_docs import inspect
from render import selections
from markdown_links import markdown_links


class Retention(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='dq-graph-workflow-')
        self.root = Path(self.tmp.name)
        self.addCleanup(self.tmp.cleanup)

    def write(self, rel, text=''):
        path = self.root / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding='utf-8')
        return path

    def test_inventory_includes_new_files_but_excludes_ignored_and_derived_inputs(self):
        subprocess.run(['git', 'init', '-q', str(self.root)], check=True)
        self.write('.gitignore', '/docs/\n/node_modules/\n')
        self.write('README.md', '# Project\n')
        self.write('src/new.ts', 'export const n=1;')
        self.write('docs/private.md')
        self.write('node_modules/vendor/index.js')
        self.write('reports/relationship-graph/README.md')
        self.write('scripts/relationship_graph/inspect_code.mjs')
        self.assertEqual(refresh.inventory(self.root), ['README.md', 'src/new.ts'])

    def test_report_link_is_diagnostic_without_becoming_a_graph_node(self):
        self.write('README.md', '# Project\n[map](reports/relationship-graph/README.md)\n')
        result = inspect(self.root, ['README.md', 'reports/relationship-graph/README.md'])
        self.assertEqual(result['edges'], [])
        self.assertEqual(result['diagnostics']['counts']['issues'], {'excluded_output_or_tooling': 1})

    def test_symlinks_and_unowned_report_files_are_refused(self):
        (self.root / 'reports').symlink_to(self.root, target_is_directory=True)
        with self.assertRaises(ValueError):
            refresh.target_directory(self.root)
        (self.root / 'reports').unlink()
        extra = self.write('reports/relationship-graph/manual.md')
        with self.assertRaises(ValueError):
            refresh.target_directory(self.root)
        extra.unlink()
        (extra.parent / 'README.md').symlink_to(self.root / 'outside')
        with self.assertRaises(ValueError):
            refresh.target_directory(self.root)

    def test_freshness_detects_theme_input_and_artifact_changes(self):
        for rel in refresh.ARTIFACTS:
            self.write(rel, 'generated')
        saved = {'state': {'theme': 'old'},
                 'fingerprint': refresh.digest(refresh.canonical({'theme': 'old'}).encode()),
                 'artifacts': {rel: refresh.digest((self.root / rel).read_bytes())
                               for rel in refresh.ARTIFACTS}}
        self.write('snapshot.json', refresh.canonical(saved))
        self.assertEqual(refresh.freshness(self.root, saved['state']), [])
        self.assertTrue(refresh.freshness(self.root, {'theme': 'new'}))
        (self.root / 'README.md').write_text('manual edit')
        self.assertIn('missing or modified artifact: README.md', refresh.freshness(self.root, saved['state']))
        (self.root / 'README.md').unlink()
        self.assertIn('missing or modified artifact: README.md', refresh.freshness(self.root, saved['state']))

    def test_retention_and_export_publish_only_their_manifested_files(self):
        def fake_render(folder, name, text):
            for suffix in ('.dot', '.svg', '.png'):
                (folder / (name + suffix)).write_text(text)

        for name, artifacts in (('retained', refresh.ARTIFACTS),
                                ('export', refresh.EXPORT_ARTIFACTS)):
            scratch = self.root / (name + '-scratch')
            scratch.mkdir()
            for folder in ('documentation', 'code'):
                (scratch / folder).mkdir()
                for file in ('nodes.jsonl', 'edges.jsonl', 'diagnostics.json'):
                    (scratch / folder / file).write_text('{}\n')
            with patch.object(refresh, 'render', side_effect=fake_render), \
                    patch.object(refresh, 'dot', return_value='digraph {}'), \
                    patch.object(refresh, 'report', return_value='# Maps\n'):
                refresh.render_all(scratch, {}, {}, (set(), []), (set(), []), {}, artifacts)
            folder = self.root / name
            refresh.publish(scratch, folder, artifacts)
            actual = {p.relative_to(folder).as_posix() for p in folder.rglob('*') if p.is_file()}
            self.assertEqual(actual, artifacts | {'snapshot.json'})
            saved = json.loads((folder / 'snapshot.json').read_text())
            self.assertEqual(set(saved['artifacts']), artifacts)
            self.assertTrue(all(refresh.digest((folder / rel).read_bytes()) == sha
                                for rel, sha in saved['artifacts'].items()))
        self.assertEqual(len(refresh.ARTIFACTS) + 1, 4)
        self.assertEqual(len(refresh.EXPORT_ARTIFACTS) + 1, 14)
        self.assertEqual(refresh.freshness(self.root / 'retained', {}), [])

    def test_generated_report_links_only_to_retained_images(self):
        docs = {'diagnostics': {
            'counts': {'documents': 0, 'nodes': 0, 'edges': 0, 'issues': {}},
            'unreachable_from_readme': [], 'no_incoming_document_links': []}}
        code = {'diagnostics': {
            'counts': {'files': 0, 'literal_occurrences': 0, 'edges': 0, 'nodes': 0},
            'direct_value_users_of_engine': [], 'resolved_static_value_cycles': [],
            'all_reference_cycles': [], 'issues': []}}
        report = refresh.report(docs, code, (set(), []), (set(), []), {})
        links, _ = markdown_links(report)
        self.assertEqual({link['target'] for link in links},
                         {'documentation/overview.png', 'code/engine-neighborhood.png'})
        self.assertIn('--export /tmp/distroquest-graph-export', report)
        self.assertNotIn('Ignored docs/', report)

    def test_bound_refuses_a_growing_documentation_hairball(self):
        docs = {'nodes': [{'id': str(i)} for i in range(26)], 'edges': []}
        code = {'nodes': [{'id': 'file:' + name} for name in (
            'src/recommendations/engine.ts', 'src/pages/quiz.astro',
            'src/components/QuizPage.astro', 'src/components/Quiz.astro', 'src/quiz/client.ts')],
            'edges': [], 'diagnostics': {'direct_value_users_of_engine': []}}
        with self.assertRaisesRegex(ValueError, '25 nodes or 50 edges'):
            selections(docs, code)


if __name__ == '__main__':
    unittest.main()
