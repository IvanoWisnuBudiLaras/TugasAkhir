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

@router.get('/{nik}')
def get_user_results(nik: str):
    """Mendapatkan hasil quiz berdasarkan NIK"""
    db = SessionLocal()
    try:
        # Cari warga berdasarkan NIK
        warga = db.query(DataWarga).filter(DataWarga.nik == nik).first()
        if not warga:
            return {'error': 'User not found'}, 404
        
        # Cari hasil quiz berdasarkan NIK
        hasil = db.query(HasilQuiz).filter(HasilQuiz.nik == nik).order_by(HasilQuiz.id.desc()).first()
        if not hasil:
            return {'error': 'No quiz results found'}, 404
        
        return {
            'nik': hasil.nik,
            'kategori': hasil.kategori,
            'saran': hasil.saran,
            'persentase': hasil.persentase,
            'deskripsi': hasil.deskripsi,
            'nama': warga.nama,
            'umur': warga.umur
        }
    finally:
        db.close()