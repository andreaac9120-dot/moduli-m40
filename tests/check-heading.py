"""Verifica i campi treno e prescrizioni sulle intestazioni RFI."""
import sys
from pathlib import Path
import fitz

folder = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('/tmp/m40-v6')
expected = {
    'dl_ba': ((170, 101), (20, 110)),
    'dl_bm_bca': ((165, 103), (55, 110)),
    'telec_ba': ((170, 123), (280, 132)),
    'telec_bca': ((175, 148), (284, 158)),
}
for model, ((train_x, train_y), (numbers_x, numbers_y)) in expected.items():
    with fitz.open(folder / f'{model}-intestazione.pdf') as pdf:
        page = pdf[0]
        train = page.search_for('54321')
        numbers = page.search_for('2, 7, 10')
        assert len(train) == len(numbers) == 1, (model, train, numbers)
        for match, x, y in ((train[0], train_x, train_y), (numbers[0], numbers_x, numbers_y)):
            assert x <= match.x0 < x + 12 and y - 10 <= match.y0 < y + 2, (model, match, x, y)
    print(f'{model}: treno e prescrizioni 2, 7, 10 nei rispettivi campi')
