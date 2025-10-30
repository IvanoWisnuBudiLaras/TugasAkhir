from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import database, crud, schemas, ai_engine
router = APIRouter(prefix='/quiz', tags=['Quiz'])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post('/run')
def jalankan_quiz(warga: schemas.WargaBase, db: Session = Depends(get_db)):
    hasil = ai_engine.analisis_quiz({}, warga.umur)
    hasil_data = schemas.HasilQuizBase(nik=warga.nik, **hasil)
    crud.create_hasil(db, hasil_data)
    return {**hasil, 'nama': warga.nama}
