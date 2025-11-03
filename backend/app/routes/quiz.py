from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import database, crud, schemas, ai_engine
from typing import Dict, Any

router = APIRouter(prefix='/quiz', tags=['Quiz'])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post('/run')
def jalankan_quiz(quiz_data: schemas.QuizSubmission, db: Session = Depends(get_db)):
    try:
        # Validasi input data
        if not quiz_data.nik or len(quiz_data.nik) < 10:
            raise HTTPException(status_code=400, detail="NIK harus diisi dan minimal 10 karakter")
        
        if not quiz_data.nama or len(quiz_data.nama.strip()) == 0:
            raise HTTPException(status_code=400, detail="Nama harus diisi")
        
        if not quiz_data.jawaban or len(quiz_data.jawaban) == 0:
            raise HTTPException(status_code=400, detail="Jawaban quiz tidak boleh kosong")
        
        if quiz_data.umur < 15 or quiz_data.umur > 65:
            raise HTTPException(status_code=400, detail="Umur harus antara 15-65 tahun")
        
        # Validasi format NIK (hanya angka)
        if not quiz_data.nik.isdigit():
            raise HTTPException(status_code=400, detail="NIK harus berupa angka")
        
        # Validasi panjang jawaban
        if len(quiz_data.jawaban) < 5:
            raise HTTPException(status_code=400, detail="Minimal 5 jawaban untuk analisis yang akurat")
        
        # Analisis jawaban quiz untuk mendapatkan rekomendasi karir
        hasil = ai_engine.analisis_quiz(quiz_data.jawaban, quiz_data.umur, quiz_data.quiz_type)
        
        # Simpan atau update data warga
        warga_data = schemas.WargaBase(
            nik=quiz_data.nik,
            nama=quiz_data.nama,
            alamat="",  # Bisa diupdate nanti jika diperlukan
            umur=quiz_data.umur
        )
        crud.create_warga(db, warga_data)
        
        # Simpan hasil ke database dengan data analisis yang lebih detail
        hasil_data = schemas.HasilQuizBase(
            nik=quiz_data.nik,
            kategori=hasil['kategori'],
            saran=hasil['saran'],
            persentase=hasil['persentase'],
            deskripsi=hasil['deskripsi'],
            detail_analisis=hasil.get('analysis_details', {}),
            confidence_level=hasil.get('confidence_level', 'Medium')
        )
        crud.create_hasil(db, hasil_data)
        
        # Kembalikan hasil lengkap termasuk data karir
        return schemas.QuizResult(
            success=True,
            message="Analisis quiz berhasil dilakukan",
            data={
                'nik': quiz_data.nik,
                'nama': quiz_data.nama,
                'umur': quiz_data.umur,
                'quiz_type': quiz_data.quiz_type,
                **hasil
            },
            career=hasil.get('career'),
            analysis_details=hasil.get('analysis_details')
        )
        
    except ValueError as ve:
        # Tangani error validasi dari AI engine
        raise HTTPException(status_code=400, detail=str(ve))
    except HTTPException:
        # Tangani error HTTP yang sudah terdefinisi
        raise
    except Exception as e:
        # Tangani error umum
        import traceback
        error_detail = f"Error dalam pemrosesan quiz: {str(e)}"
        print(f"Error traceback: {traceback.format_exc()}")  # Log untuk debugging
        raise HTTPException(status_code=500, detail=error_detail)

@router.get('/result/{nik}')
def get_quiz_result(nik: str, db: Session = Depends(get_db)):
    """Mendapatkan hasil quiz berdasarkan NIK"""
    hasil = crud.get_hasil_by_nik(db, nik)
    if not hasil:
        raise HTTPException(status_code=404, detail="Hasil quiz tidak ditemukan")
    
    return schemas.HasilQuizResponse.from_orm(hasil)

@router.get('/all-results')
def get_all_quiz_results(db: Session = Depends(get_db)):
    """Mendapatkan semua hasil quiz dengan data warga"""
    results = crud.get_all_hasil_with_warga(db)
    return [schemas.HasilQuizResponse.from_orm(result) for result in results]

@router.get('/questions/{quiz_type}')
def get_quiz_questions(quiz_type: str):
    """Mendapatkan pertanyaan quiz berdasarkan tipe"""
    valid_types = ['personality', 'economic', 'comprehensive']
    if quiz_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Tipe quiz harus salah satu dari: {', '.join(valid_types)}")
    
    # Import questions dari AI engine
    from ..ai_engine import get_personality_questions, get_economic_questions, get_comprehensive_questions
    
    if quiz_type == 'personality':
        questions = get_personality_questions()
    elif quiz_type == 'economic':
        questions = get_economic_questions()
    else:  # comprehensive
        questions = get_comprehensive_questions()
    
    return {
        "quiz_type": quiz_type,
        "questions": questions,
        "total_questions": len(questions)
    }