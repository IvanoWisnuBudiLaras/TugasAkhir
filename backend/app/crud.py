from sqlalchemy.orm import Session
from . import models, schemas
from sqlalchemy import desc

def create_warga(db: Session, warga: schemas.WargaBase):
    """Membuat atau update data warga"""
    existing_warga = get_warga_by_nik(db, warga.nik)
    if existing_warga:
        # Update data yang ada
        for key, value in warga.dict().items():
            setattr(existing_warga, key, value)
        db.commit()
        db.refresh(existing_warga)
        return existing_warga
    
    # Buat data baru
    db_warga = models.DataWarga(**warga.dict())
    db.add(db_warga)
    db.commit()
    db.refresh(db_warga)
    return db_warga

def create_hasil(db: Session, hasil: schemas.HasilQuizBase):
    """Membuat hasil quiz baru"""
    db_hasil = models.HasilQuiz(**hasil.dict())
    db.add(db_hasil)
    db.commit()
    db.refresh(db_hasil)
    return db_hasil

def get_warga_by_nik(db: Session, nik: str):
    """Mendapatkan data warga berdasarkan NIK"""
    return db.query(models.DataWarga).filter(models.DataWarga.nik == nik).first()

def get_hasil_by_nik(db: Session, nik: str):
    """Mendapatkan hasil quiz berdasarkan NIK"""
    return db.query(models.HasilQuiz).filter(models.HasilQuiz.nik == nik).order_by(desc(models.HasilQuiz.created_at)).first()

def get_all_warga(db: Session, skip: int = 0, limit: int = 100):
    """Mendapatkan semua data warga dengan pagination"""
    return db.query(models.DataWarga).offset(skip).limit(limit).all()

def get_all_hasil_with_warga(db: Session, skip: int = 0, limit: int = 100):
    """Mendapatkan semua hasil quiz dengan data warga"""
    return db.query(models.HasilQuiz).join(models.DataWarga).offset(skip).limit(limit).all()

def delete_warga(db: Session, nik: str):
    """Menghapus data warga berdasarkan NIK"""
    warga = get_warga_by_nik(db, nik)
    if warga:
        # Hapus juga hasil quiz yang terkait
        db.query(models.HasilQuiz).filter(models.HasilQuiz.nik == nik).delete()
        db.delete(warga)
        db.commit()
        return True
    return False

def get_warga_with_hasil(db: Session, nik: str):
    """Mendapatkan data warga lengkap dengan hasil quiz"""
    warga = get_warga_by_nik(db, nik)
    if warga:
        hasil = get_hasil_by_nik(db, nik)
        return {
            'warga': warga,
            'hasil_quiz': hasil
        }
    return None

def update_hasil_analisis(db: Session, nik: str, analysis_data: dict):
    """Update hasil analisis quiz"""
    hasil = get_hasil_by_nik(db, nik)
    if hasil:
        hasil.detail_analisis = analysis_data.get('detail_analisis', {})
        hasil.confidence_level = analysis_data.get('confidence_level', 'Medium')
        hasil.personality_score = analysis_data.get('personality_score', {})
        hasil.economic_score = analysis_data.get('economic_score', {})
        hasil.age_factor = analysis_data.get('age_factor', 0.0)
        db.commit()
        db.refresh(hasil)
        return hasil
    return None