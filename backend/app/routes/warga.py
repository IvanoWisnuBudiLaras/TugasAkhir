from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import database, crud, schemas, models
import pandas as pd
from io import BytesIO
from fastapi.responses import StreamingResponse
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

@router.get('/')
def get_all_warga(db: Session = Depends(get_db)):
    """Mendapatkan semua data warga"""
    warga_list = db.query(models.DataWarga).all()
    return warga_list

@router.get('/export')
def export_warga_excel(db: Session = Depends(get_db)):
    try:
        # Get all warga data with quiz results
        warga_list = db.query(models.Warga).all()
        
        # Prepare data for Excel
        data = []
        for warga in warga_list:
            # Get quiz result if exists
            quiz_result = db.query(models.HasilQuiz).filter(models.HasilQuiz.nik == warga.nik).first()
            
            data.append({
                'NIK': warga.nik,
                'Nama': warga.nama,
                'Umur': warga.umur,
                'Alamat': warga.alamat or '',
                'Hasil Quiz': 'Sudah' if quiz_result else 'Belum',
                'Kategori': quiz_result.kategori if quiz_result else '',
                'Persentase': f"{quiz_result.persentase}%" if quiz_result else '',
                'Saran Karir': quiz_result.saran if quiz_result else '',
                'Tanggal Quiz': quiz_result.created_at if quiz_result else ''
            })
        
        # Create DataFrame
        df = pd.DataFrame(data)
        
        # Create Excel file in memory
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Data Warga', index=False)
            
            # Auto-adjust column widths
            worksheet = writer.sheets['Data Warga']
            for column in worksheet.columns:
                max_length = 0
                column_letter = column[0].column_letter
                for cell in column:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                    except:
                        pass
                adjusted_width = min(max_length + 2, 50)
                worksheet.column_dimensions[column_letter].width = adjusted_width
        
        # Prepare response
        output.seek(0)
        
        return StreamingResponse(
            BytesIO(output.getvalue()),
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            headers={
                'Content-Disposition': f'attachment; filename=career-assessment-data-{pd.Timestamp.now().strftime("%Y%m%d")}.xlsx'
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting data: {str(e)}")

@router.post('/register')
def register_warga(warga: schemas.WargaBase, db: Session = Depends(get_db)):
    """Endpoint untuk registrasi warga baru"""
    # Cek apakah NIK sudah ada
    existing_warga = crud.get_warga_by_nik(db, warga.nik)
    if existing_warga:
        return {"message": "NIK already registered", "warga": existing_warga}
    
    # Buat warga baru
    new_warga = crud.create_warga(db, warga)
    return {"message": "Registration successful", "warga": new_warga}

@router.delete('/{nik}')
def delete_warga(nik: str, db: Session = Depends(get_db)):
    """Menghapus data warga berdasarkan NIK"""
    # Cari warga berdasarkan NIK
    warga = db.query(models.Warga).filter(models.Warga.nik == nik).first()
    if not warga:
        raise HTTPException(status_code=404, detail="Warga tidak ditemukan")
    
    # Hapus juga hasil quiz yang terkait
    db.query(models.HasilQuiz).filter(models.HasilQuiz.nik == nik).delete()
    
    # Hapus data warga
    db.delete(warga)
    db.commit()
    
    return {"message": "Data warga berhasil dihapus"}