"""Run the complete regression suite from any working directory."""
from pathlib import Path
import subprocess
import tempfile

root = Path(__file__).resolve().parents[1]

def run(*args):
    subprocess.run(args, cwd=root, check=True)

for script in sorted((root / 'tests').glob('*.test.cjs')):
    run('node', str(script))
with tempfile.TemporaryDirectory(prefix='m40-pdf-tests-') as output:
    run('node', 'tests/pdf-fixtures.cjs', output)
    for script in sorted((root / 'tests').glob('check-*.py')):
        import sys
        run(sys.executable, str(script), output)
print('All M.40 regression checks passed.')
