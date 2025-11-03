from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime

class WargaBase(BaseModel):
    nik: str
    nama: str
    alamat: str
    umur: int

class WargaResponse(WargaBase):
    created_at: datetime
    
    class Config:
        from_attributes = True

class QuizSubmission(BaseModel):
    nik: str
    nama: str
    umur: int
    jawaban: Dict[str, Any]  # Menyimpan semua jawaban quiz
    quiz_type: str = "comprehensive"  # comprehensive, personality, economic

class HasilQuizBase(BaseModel):
    nik: str
    kategori: str
    saran: str
    persentase: float
    deskripsi: str
    detail_analisis: Optional[Dict[str, Any]] = None
    confidence_level: str = "Medium"

class HasilQuizResponse(HasilQuizBase):
    id: int
    created_at: datetime
    warga: Optional[WargaResponse] = None
    
    class Config:
        from_attributes = True

class CareerRecommendation(BaseModel):
    title: str
    description: str
    jobs: list[str]
    skills: list[str]
    personality_match: float
    economic_match: float
    confidence_level: str

class QuizResult(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    career: Optional[CareerRecommendation] = None
    analysis_details: Optional[Dict[str, Any]] = None