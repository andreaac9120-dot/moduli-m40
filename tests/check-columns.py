"""Verifica i segni nelle colonne DM e A.G. dei PDF di prova."""
import sys
from pathlib import Path
import fitz

folder = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('/tmp/m40-v3')
for model, dm_x, ag_x in (('dl_ba', 25, 452), ('dl_bm_bca', 60, 375)):
    for role, expected_x, other_x in (('dm', dm_x, ag_x), ('ag', ag_x, dm_x)):
        with fitz.open(folder / f'{model}-{role}.pdf') as pdf:
            marks = [item for drawing in pdf[0].get_drawings()
                     if drawing['width'] is not None and abs(drawing['width'] - 1.2) < .01
                     for item in drawing['items'] if item[0] == 'l']
        assert len(marks) == 1, (model, role, marks)
        x = marks[0][1].x + 1
        assert abs(x - expected_x) < .01 and abs(x - other_x) > 100, (model, role, x)
        print(f'{model} {role}: solo colonna x={x:g}')
