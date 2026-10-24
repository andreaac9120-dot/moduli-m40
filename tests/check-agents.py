"""Verifica i nominativi nei PDF, comprese entrambe le direzioni del 0229."""
import sys
from pathlib import Path
import fitz
folder = Path(sys.argv[1])
for model in ('m40_normale','m40a','dl_ba','dl_bm_bca','telec_ba','telec_bca','fn_0229_2'):
    with fitz.open(folder / (model+'.pdf')) as doc:
        text = doc[0].get_text()
        assert 'BIANCHI' in text and 'DCO ROSSI' in text, model
for direction, own_x, dm_x in [('invio',152,276),('ricevo',276,152)]:
    with fitz.open(folder / ('fn_0229-v5-'+direction+'.pdf')) as doc:
        page = doc[0]
        for name, x in [('BIANCHI',own_x),('DCO ROSSI',dm_x)]:
            matches = page.search_for(name)
            assert len(matches)==1 and abs(matches[0].x0-x)<1 and 298<matches[0].y0<310, (direction,name,matches)
        assert '98765' not in page.get_text()
print('Cognomi presenti su tutti gli otto modelli PDF e nei ruoli corretti del 0229')
