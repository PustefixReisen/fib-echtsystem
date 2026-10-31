"""Synthetic PDF transport containing documented real excerpts; never original PDF bytes."""
from reportlab.pdfgen import canvas
from pathlib import Path
import os
root=Path(os.environ['RUNNER_TEMP'])
texts={'75785':Path('tests/u4/fixtures/ris-1031-minutes-excerpts.txt').read_text(),
       '75714':'Synthetischer Vorschlagstext zu TOP 2. Keine Beschlussbehauptung.',
       '75790':'Synthetischer Vorschlagstext zu TOP 3. Keine Beschlussbehauptung.',
       '99001':'SYNTHETISCHER TEST: Die Niederschrift vom 15.10.2026 wird genehmigt.',
       'changed':'Synthetisch geänderte Vorlage. Keine Beschlussbehauptung.'}
for extra in ['74647','75243','75379']:
 texts[extra]='Synthetischer Transporttext einer weiteren Vorlage; kein Beschluss.'
for name,text in texts.items():
 c=canvas.Canvas(str(root/(name+'.pdf')),pagesize=(1000,1400),invariant=1)
 y=1360
 for line in text.splitlines():
  if y<40:c.showPage();y=1360
  c.setFont('Helvetica',10);c.drawString(30,y,line);y-=15
 c.save()
