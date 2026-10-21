import importlib.util
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('flowcraft_install', Path(__file__).resolve().parents[1]/'scripts/install.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class InstallTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='flowcraft-install-test-')
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.source = self.root/'source'
        self.source.mkdir()
        (self.source/'SKILL.md').write_text('fixture')
        (self.source/'node_modules').mkdir()
        (self.source/'.git').mkdir()
        (self.source/'.git/private-marker').write_text('excluded')
        (self.source/'examples').mkdir()
        (self.source/'examples/example.svg').write_text('excluded')

    def test_install_preserves_runtime_and_excludes_checkout(self):
        dest=self.root/'flowcraft'
        module.install(self.source,dest)
        self.assertEqual((dest/'SKILL.md').read_text(),'fixture')
        self.assertTrue((dest/'node_modules').is_dir())
        self.assertFalse((dest/'.git').exists())
        self.assertFalse((dest/'examples').exists())

    def test_existing_work_and_symlinks_are_preserved(self):
        dest=self.root/'flowcraft'; dest.mkdir(); (dest/'keep').write_bytes(b'actual user bytes')
        with self.assertRaises(ValueError):module.install(self.source,dest)
        self.assertEqual((dest/'keep').read_bytes(),b'actual user bytes')
        link=self.root/'link';link.symlink_to(self.root/'missing')
        with self.assertRaises(ValueError):module.install(self.source,link)
        self.assertTrue(link.is_symlink())

    def test_source_nesting_and_missing_dependencies_are_rejected(self):
        with self.assertRaises(ValueError):module.install(self.source,self.source/'nested')
        (self.source/'node_modules').rmdir()
        with self.assertRaises(ValueError):module.install(self.source,self.root/'flowcraft')
        self.assertFalse((self.root/'flowcraft').exists())
