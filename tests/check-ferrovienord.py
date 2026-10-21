"""Controlla i due numeri del 0229, i moduli precedenti e il 0229/2."""
import sys
from pathlib import Path

import fitz


folder = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('/tmp/m40-fn-check')

for filename, transmitting, receiver_x, dm_x in (
    ('fn_0229-ricevo.pdf', '5/02', 7, 150),
    ('fn_0229-invio.pdf', '7/01', 5, 270),
):
    with fitz.open(folder / filename) as document:
        assert len(document) == 1
        page = document[0]
        assert page.rect.width == 518 and page.rect.height == 370
        text = page.get_text()
        assert 'Mario Bianchi' not in text and '98765' not in text
        assert 'BIANCHI' not in text
        assert 'TORINO' in text and '12345' in text
        assert any(275 < r.x0 < 285 and 55 < r.y0 < 65 for r in page.search_for(transmitting))
        assert any(83 < x < 90 and 324 < y < 333 and t == str(receiver_x)
                   for x, y, _, _, t, *_ in page.get_text('words'))
        assert any(dm_x < r.x0 < dm_x + 10 and 298 < r.y0 < 310
                   for r in page.search_for('DCO ROSSI'))

with fitz.open(folder / 'fn_0229-v3.pdf') as document:
    assert 'AGENTE NERI' in document[0].get_text()  # I vecchi moduli mantengono i ruoli salvati.

with fitz.open(folder / 'fn_0229-vecchio.pdf') as document:
    assert 'BIANCHI' not in document[0].get_text()  # Vecchio valore precompilato dal profilo.

with fitz.open(folder / 'fn_0229_2.pdf') as front, fitz.open(folder / 'fn_0229_2-retro.pdf') as back:
    assert front[0].rect.width == 505.5 and front[0].rect.height == 728
    assert len(back) == 1 and 'Guida per la notifica delle prescrizioni' in back[0].get_text().replace('\u00a0', ' ')
    assert all(page.get_text().startswith('SEGUITO') for page in list(front)[1:])
    text = front[0].get_text()
    for value in ('45678', 'PARTENZA', 'TORINO', 'P1F0', 'P2F0', 'P18F0', 'BIANCHI'):
        assert value in text, value
    assert 'P2F1' not in text  # L'alternativa «verso» è depennata.
    assert '1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18' in text
    marks = [item for drawing in front[0].get_drawings()
             if drawing['width'] is not None and abs(drawing['width'] - 1.2) < .01
             for item in drawing['items'] if item[0] == 'l']
    assert len(marks) == 21, len(marks)
    assert all(abs(item[1].x - 32) < .01 for item in marks)

print('Moduli FERROVIENORD, due numeri, versioni precedenti e retro OK')
