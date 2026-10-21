"""Verifica fronte singolo, retro separato, cognome AdC e firma."""
import sys
from pathlib import Path
import fitz

folder = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('/tmp/m40-v4')
for model in ('dl_ba', 'dl_bm_bca', 'telec_ba', 'telec_bca'):
    with fitz.open(folder / f'{model}.pdf') as front, fitz.open(folder / f'{model}-retro.pdf') as back:
        assert len(back) == 1 and len(front) >= 1, model
        assert all(page.get_text().startswith('SEGUITO') for page in list(front)[1:]), model
        assert 'BIANCHI' in front[0].get_text(), model
        if model in ('dl_ba', 'dl_bm_bca'):
            surname = front[0].search_for('BIANCHI')
            left, right = (255, 370) if model == 'dl_ba' else (235, 315)
            assert len(surname) == 1 and left <= surname[0].x0 < surname[0].x1 <= right, (model, surname)
for model in ('m40_normale', 'm40a'):
    with fitz.open(folder / f'{model}-firma.pdf') as pdf:
        assert len(pdf) == 1, model
        assert 'Mario Bianchi' in pdf[0].get_text(), model
        assert '98765' in pdf[0].get_text(), model
print('Fronte singolo, retro separato, cognome AdC e firme OK')
