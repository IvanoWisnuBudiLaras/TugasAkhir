from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import database, crud, schemas
router = APIRouter(prefix='/warga', tags=['Warga'])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post('/')
def tambah_warga(warga: schemas.WargaBase, db: Session = Depends(get_db)):
    return crud.create_warga(db, warga)
