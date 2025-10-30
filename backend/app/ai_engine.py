def analisis_quiz(jawaban, umur):
    if 18 <= umur <= 25:
        kategori = 'Digital'
        saran = 'Desain Digital, Konten Kreator, atau jasa komputer'
        base = 68.5
    elif 26 <= umur <= 37:
        kategori = 'Produktif'
        saran = 'Usaha Mikro, Dagang Online, Pelatihan Skill'
        base = 72.3
    else:
        kategori = 'Mandiri'
        saran = 'Konsultan, Mentor, atau Pembuka Lapangan Kerja'
        base = 70.1
    deskripsi = f'Kategori {kategori}: {saran}. Cocok dengan umur {umur}, perlu konsistensi agar hasil maksimal.'
    return {'kategori': kategori, 'saran': saran, 'persentase': base, 'deskripsi': deskripsi}
