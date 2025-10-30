from fastapi import APIRouter
import pandas as pd, os
from ..database import SessionLocal
from ..models import DataWarga, HasilQuiz
router = APIRouter(prefix='/report', tags=['Report'])

@router.get('/export')
def export_data():
    db = SessionLocal()
    warga = pd.read_sql(db.query(DataWarga).statement, db.bind)
    hasil = pd.read_sql(db.query(HasilQuiz).statement, db.bind)
    os.makedirs('exports', exist_ok=True)
    with pd.ExcelWriter('exports/ecoquiz_data.xlsx') as writer:
        warga.to_excel(writer, sheet_name='Warga', index=False)
        hasil.to_excel(writer, sheet_name='Hasil Quiz', index=False)
    return {'status': 'success', 'file': 'exports/ecoquiz_data.xlsx'}
