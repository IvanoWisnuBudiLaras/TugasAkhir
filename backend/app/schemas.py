from pydantic import BaseModel
class WargaBase(BaseModel):
    nik: str
    nama: str
    alamat: str
    umur: int
class HasilQuizBase(BaseModel):
    nik: str
    kategori: str
    saran: str
    persentase: float
    deskripsi: str
