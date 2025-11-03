from sqlalchemy import Column, String, Integer, Float, Text, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func
from .database import Base

class DataWarga(Base):
    __tablename__ = 'data_warga'
    nik = Column(String, primary_key=True, index=True)
    nama = Column(String)
    alamat = Column(String)
    umur = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class HasilQuiz(Base):
    __tablename__ = 'hasil_quiz'
    id = Column(Integer, primary_key=True, index=True)
    nik = Column(String, ForeignKey('data_warga.nik'))
    kategori = Column(String)
    saran = Column(String)
    persentase = Column(Float)
    deskripsi = Column(Text)
    detail_analisis = Column(JSON, default={})
    confidence_level = Column(String, default="Medium")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Informasi tambahan untuk analisis
    personality_score = Column(JSON, default={})
    economic_score = Column(JSON, default={})
    age_factor = Column(Float, default=0.0)
    quiz_type = Column(String, default="comprehensive")  # comprehensive, personality, economic