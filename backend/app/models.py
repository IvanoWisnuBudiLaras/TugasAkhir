from sqlalchemy import Column, String, Integer, Float, Text, ForeignKey
from .database import Base

class DataWarga(Base):
    __tablename__ = 'data_warga'
    nik = Column(String, primary_key=True, index=True)
    nama = Column(String)
    alamat = Column(String)
    umur = Column(Integer)

class HasilQuiz(Base):
    __tablename__ = 'hasil_quiz'
    id = Column(Integer, primary_key=True, index=True)
    nik = Column(String, ForeignKey('data_warga.nik'))
    kategori = Column(String)
    saran = Column(String)
    persentase = Column(Float)
    deskripsi = Column(Text)
