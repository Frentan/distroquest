import hashlib
from pathlib import Path
import tempfile
import unittest

from inspect_docs import inspect, write_result


class Documentation(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='dq-doc-fixture-')
        self.root = Path(self.tmp.name) / 'repo'
        self.root.mkdir()
        self.inventory = []
        self.addCleanup(self.tmp.cleanup)

    def write(self, name, text):
        p = self.root / name
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text)
        self.inventory.append(name)

    def run_inspect(self):
        return inspect(self.root, self.inventory)

    def test_closed_component_is_not_an_incoming_link_orphan(self):
        self.write('README.md', '# Project\n')
        self.write('art/a.md', '# A\n\n[b](b.md)\n')
        self.write('art/b.md', '# B\n\n[a](a.md)\n')
        result = self.run_inspect()
        self.assertEqual(result['diagnostics']['unreachable_from_readme'], ['file:art/a.md', 'file:art/b.md'])
        self.assertEqual(result['diagnostics']['no_incoming_document_links'], ['file:README.md'])

    def test_relative_references_anchors_duplicates_and_code_paths(self):
        self.write('README.md', '# Project\n\n[a](docs/a%20b.md#part)\n[again][x]\n\n[x]: <docs/a b.md>\n\n`docs/not-a-link.md`\n```md\n[example](absent.md)\n```\n')
        self.write('docs/a b.md', '# Evidence\n')
        result = self.run_inspect()
        self.assertEqual(len(result['edges']), 1)
        self.assertEqual(len(result['edges'][0]['evidence']), 2)
        self.assertEqual(result['edges'][0]['evidence'][0]['line'], 3)
        self.assertEqual(result['diagnostics']['counts']['issues'], {'unchecked_anchor': 1})

    def test_guidance_symlink_and_boundary_are_not_duplicate_documents(self):
        self.write('AGENTS.md', '# Guidance\n')
        (self.root / 'CLAUDE.md').symlink_to('AGENTS.md')
        self.inventory.append('CLAUDE.md')
        self.write('README.md', '# Project\n\n[outside](../private.md)\n[missing](missing.md)\n')
        result = self.run_inspect()
        self.assertEqual(result['diagnostics']['counts']['documents'], 1)
        self.assertEqual(result['edges'], [])
        self.assertEqual(set(result['diagnostics']['counts']['issues']), {'excluded_symlink', 'outside_repository', 'missing_target'})

    def test_explicit_code_link_is_a_terminal_target(self):
        self.write('README.md', '# Project\n\n[code](src/a.ts)\n')
        self.write('src/a.ts', "throw new Error('Do not run');")
        result = self.run_inspect()
        node = next(n for n in result['nodes'] if n['path'] == 'src/a.ts')
        self.assertEqual(node['kind'], 'module')
        self.assertFalse(node['scanned'])

    def test_export_is_deterministic_and_does_not_mutate_input(self):
        self.write('README.md', '# Project\n')
        original = hashlib.sha256((self.root / 'README.md').read_bytes()).hexdigest()
        a, b = Path(self.tmp.name) / 'a', Path(self.tmp.name) / 'b'
        write_result(self.run_inspect(), a)
        write_result(self.run_inspect(), b)
        self.assertTrue(all(p.read_bytes() == (b / p.name).read_bytes() for p in a.iterdir()))
        self.assertEqual(hashlib.sha256((self.root / 'README.md').read_bytes()).hexdigest(), original)
        with self.assertRaises(FileExistsError):
            write_result(self.run_inspect(), a)


if __name__ == '__main__':
    unittest.main()
