from sqlalchemy.orm import Session
from . import models, schemas

def create_warga(db: Session, warga: schemas.WargaBase):
    db_warga = models.DataWarga(**warga.dict())
    db.add(db_warga)
    db.commit()
    db.refresh(db_warga)
    return db_warga

def create_hasil(db: Session, hasil: schemas.HasilQuizBase):
    db_hasil = models.HasilQuiz(**hasil.dict())
    db.add(db_hasil)
    db.commit()
    db.refresh(db_hasil)
    return db_hasil
