import random
import numpy as np
from typing import Dict, List, Any

def analyze_personality_traits(jawaban: Dict[str, Any]) -> Dict[str, float]:
    """
    Analisis kepribadian berdasarkan jawaban quiz sifat
    """
    # Definisikan mapping pertanyaan ke trait
    trait_questions = {
        'q1': {'Analyst': 1, 'Creative': 0.8, 'Management': 0.6},
        'q2': {'Social': 1, 'Marketing': 0.7, 'Management': 0.5},
        'q3': {'Creative': 1, 'Marketing': 0.8, 'Analyst': 0.4},
        'q4': {'Management': 1, 'Analyst': 0.7, 'Social': 0.6},
        'q5': {'Marketing': 1, 'Social': 0.8, 'Creative': 0.7},
        'q6': {'Analyst': 1, 'Management': 0.6, 'Creative': 0.5},
        'q7': {'Social': 1, 'Marketing': 0.9, 'Management': 0.7},
        'q8': {'Creative': 1, 'Analyst': 0.5, 'Marketing': 0.8}
    }
    
    # Hitung skor untuk setiap kategori
    category_scores = {
        'Analyst': 0, 'Marketing': 0, 'Creative': 0, 
        'Social': 0, 'Management': 0
    }
    
    # Proses setiap jawaban
    for question_id, answer in jawaban.items():
        if question_id in trait_questions:
            # Convert jawaban (1-5) ke bobot
            weight = (answer - 1) / 4  # Normalisasi ke 0-1
            
            # Tambahkan skor ke kategori yang sesuai
            for category, base_score in trait_questions[question_id].items():
                category_scores[category] += base_score * weight
    
    # Normalisasi skor
    max_score = max(category_scores.values()) or 1
    for category in category_scores:
        category_scores[category] = (category_scores[category] / max_score) * 100
    
    return category_scores

def analyze_economic_preferences(jawaban: Dict[str, Any]) -> Dict[str, float]:
    """
    Analisis preferensi ekonomi berdasarkan jawaban quiz ekonomi
    """
    economic_factors = {
        'risk_tolerance': 0,
        'investment_preference': 0,
        'income_stability': 0,
        'growth_potential': 0
    }
    
    # Mapping pertanyaan ekonomi
    economic_questions = {
        'e1': 'risk_tolerance',      # Risk tolerance
        'e2': 'investment_preference',  # Investment preference  
        'e3': 'income_stability',    # Income stability preference
        'e4': 'growth_potential',    # Growth potential preference
    }
    
    # Proses jawaban ekonomi
    for question_id, factor in economic_questions.items():
        if question_id in jawaban:
            economic_factors[factor] = jawaban[question_id]
    
    # Mapping preferensi ekonomi ke kategori karir
    economic_mapping = {
        'Analyst': {'risk': 0.3, 'investment': 0.8, 'stability': 0.9, 'growth': 0.7},
        'Marketing': {'risk': 0.7, 'investment': 0.6, 'stability': 0.5, 'growth': 0.8},
        'Creative': {'risk': 0.8, 'investment': 0.4, 'stability': 0.3, 'growth': 0.9},
        'Social': {'risk': 0.2, 'investment': 0.3, 'stability': 0.9, 'growth': 0.5},
        'Management': {'risk': 0.6, 'investment': 0.7, 'stability': 0.7, 'growth': 0.8}
    }
    
    # Hitung skor ekonomi untuk setiap kategori
    economic_scores = {}
    for category in economic_mapping:
        mapping = economic_mapping[category]
        score = (
            (5 - economic_factors['risk_tolerance']) * mapping['risk'] +  # Low risk preference
            economic_factors['investment_preference'] * mapping['investment'] +
            economic_factors['income_stability'] * mapping['stability'] +
            economic_factors['growth_potential'] * mapping['growth']
        ) / 4
        economic_scores[category] = score
    
    return economic_scores

def calculate_final_scores(personality_scores: Dict[str, float], 
                          economic_scores: Dict[str, float], 
                          umur: int) -> Dict[str, float]:
    """
    Gabungkan semua faktor untuk menghitung skor akhir dengan algoritma yang lebih sophisticated
    """
    final_scores = {}
    
    # Bobot untuk setiap komponen
    personality_weight = 0.5   # Kepribadian 50%
    economic_weight = 0.3      # Ekonomi 30%
    age_weight = 0.2           # Umur 20%
    
    # Faktor umur untuk setiap kategori
    age_factors = {
        'Analyst': min(1.0, max(0.3, (umur - 17) / 30)),     # Meningkat dengan umur
        'Marketing': min(1.0, max(0.4, (umur - 20) / 25)),   # Optimal di usia produktif
        'Creative': min(1.0, max(0.5, (45 - umur) / 25)),    # Muda lebih kreatif
        'Social': min(1.0, max(0.4, (umur - 15) / 35)),      # Stabil across umur
        'Management': min(1.0, max(0.3, (umur - 25) / 20))    # Butuh pengalaman
    }
    
    # Normalisasi skor untuk mencegah bias
    max_personality = max(personality_scores.values()) if personality_scores else 1
    max_economic = max(economic_scores.values()) if economic_scores else 1
    
    # Hitung skor akhir untuk setiap kategori
    for category in personality_scores:
        # Skor personality - dengan normalisasi
        personality_component = (personality_scores[category] / max_personality) * 100 * personality_weight
        
        # Skor economic - dengan normalisasi
        economic_component = 0
        if economic_scores and max_economic > 0:
            economic_component = (economic_scores.get(category, 3) / max_economic) * 100 * economic_weight
        
        # Skor usia
        age_component = age_factors[category] * age_weight * 100
        
        # Tambahkan bonus untuk kategori yang memiliki kedua skor personality dan economic tinggi
        bonus_score = 0
        if personality_scores[category] > 70 and economic_scores.get(category, 0) > 3.5:
            bonus_score = 5  # Bonus 5% untuk strong match di kedua aspek
        
        # Total skor dengan bonus
        total_score = personality_component + economic_component + age_component + bonus_score
        
        # Pastikan skor dalam rentang 0-100
        final_scores[category] = max(0, min(100, total_score))
    
    return final_scores

def analisis_quiz(jawaban, umur, quiz_type: str = 'comprehensive'):
    """
    Analisis quiz yang ditingkatkan dengan machine learning approach
    """
    # Validasi input
    if not jawaban or len(jawaban) == 0:
        raise ValueError("Jawaban quiz tidak boleh kosong")
    
    if umur < 15 or umur > 65:
        raise ValueError("Umur harus antara 15-65 tahun")
    
    # Validasi tipe quiz
    valid_quiz_types = ['personality', 'economic', 'comprehensive']
    if quiz_type not in valid_quiz_types:
        raise ValueError(f"Tipe quiz harus salah satu dari: {', '.join(valid_quiz_types)}")
    
    # Kategori karir yang tersedia dengan data yang diperkaya
    career_categories = {
        'Analyst': {
            'title': 'Data Analyst / Data Scientist',
            'description': 'Anda memiliki kemampuan analitis yang sangat kuat dan menyukai pemecahan masalah berbasis data. Cocok untuk bekerja dengan big data, machine learning, dan business intelligence.',
            'jobs': ['Data Analyst', 'Business Analyst', 'Financial Analyst', 'Research Scientist', 'BI Developer', 'Quantitative Analyst'],
            'skills': ['Python/R', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization', 'Tableau/PowerBI'],
            'base_percentage': 78,
            'personality_traits': ['logical', 'detail-oriented', 'systematic'],
            'economic_profile': 'Moderate risk, high analytical reward'
        },
        'Marketing': {
            'title': 'Marketing / Sales Professional',
            'description': 'Anda memiliki keahlian luar biasa dalam komunikasi dan strategi pemasaran modern. Cocok untuk digital marketing, brand management, dan customer acquisition.',
            'jobs': ['Digital Marketing Manager', 'Sales Director', 'Brand Strategist', 'Growth Hacker', 'Social Media Manager', 'CRM Specialist'],
            'skills': ['Digital Marketing', 'SEO/SEM', 'Content Strategy', 'Analytics', 'Customer Psychology', 'Marketing Automation'],
            'base_percentage': 75,
            'personality_traits': ['persuasive', 'creative', 'people-oriented'],
            'economic_profile': 'Moderate-high risk, performance-based reward'
        },
        'Creative': {
            'title': 'Creative / Design Professional',
            'description': 'Anda memiliki bakat kreatif yang luar biasa dan visi artistic yang kuat. Cocok untuk menciptakan konten visual dan experiential yang inovatif.',
            'jobs': ['Creative Director', 'UX/UI Designer', 'Content Creator', 'Video Producer', 'Brand Designer', 'Art Director'],
            'skills': ['Adobe Creative Suite', 'Figma/Sketch', 'Video Editing', 'Typography', 'Color Theory', 'User Research'],
            'base_percentage': 73,
            'personality_traits': ['creative', 'visionary', 'aesthetic-focused'],
            'economic_profile': 'High risk, high creative reward'
        },
        'Social': {
            'title': 'Social / Education Professional',
            'description': 'Anda memiliki empati yang tinggi dan keinginan kuat untuk membuat dampak sosial. Cocok untuk pendidikan, konseling, dan community development.',
            'jobs': ['Educational Consultant', 'HR Business Partner', 'Corporate Trainer', 'Career Counselor', 'Social Impact Manager', 'Organizational Psychologist'],
            'skills': ['Educational Psychology', 'Training Design', 'Conflict Resolution', 'Coaching', 'Assessment Tools', 'Program Development'],
            'base_percentage': 71,
            'personality_traits': ['empathetic', 'supportive', 'development-focused'],
            'economic_profile': 'Low risk, stable income'
        },
        'Management': {
            'title': 'Management / Leadership',
            'description': 'Anda memiliki kemampuan kepemimpinan alami dan strategic thinking yang superior. Cocok untuk executive leadership dan organizational transformation.',
            'jobs': ['Chief Operations Officer', 'Strategy Consultant', 'Program Director', 'Business Unit Head', 'Management Consultant', 'Executive Coach'],
            'skills': ['Strategic Planning', 'Financial Management', 'Leadership Development', 'Change Management', 'Stakeholder Management', 'OKR/KPI Management'],
            'base_percentage': 80,
            'personality_traits': ['strategic', 'decisive', 'influential'],
            'economic_profile': 'Moderate risk, high leadership reward'
        }
    }
    
    # Analisis komponen-komponen berdasarkan tipe quiz
    if quiz_type == 'personality':
        personality_scores = analyze_personality_traits(jawaban)
        economic_scores = {}
    elif quiz_type == 'economic':
        personality_scores = {}
        economic_scores = analyze_economic_preferences(jawaban)
    else:  # comprehensive
        personality_scores = analyze_personality_traits(jawaban)
        economic_scores = analyze_economic_preferences(jawaban)
    
    # Hitung skor akhir dengan validasi
    final_scores = calculate_final_scores(personality_scores, economic_scores, umur)
    
    # Validasi hasil analisis
    if not final_scores or all(score <= 0 for score in final_scores.values()):
        raise ValueError("Analisis gagal menghasilkan skor yang valid")
    
    # Pilih kategori dengan skor tertinggi
    best_category = max(final_scores, key=final_scores.get)
    career_data = career_categories[best_category]
    
    # Hitung confidence score dengan faktor tambahan
    confidence_score = final_scores[best_category]
    
    # Tambahkan variasi intelligent berdasarkan konsistensi jawaban
    consistency_bonus = calculate_consistency_bonus(jawaban)
    final_percentage = min(98, max(68, confidence_score + consistency_bonus))
    
    # Generate rekomendasi yang dipersonalisasi
    personalized_description = generate_personalized_description(
        career_data, personality_scores[best_category], economic_scores.get(best_category, 3)
    )
    
    # Tambahkan rekomendasi tambahan berdasarkan confidence level
    additional_recommendations = []
    if final_percentage < 70:
        additional_recommendations.append("Pertimbangkan beberapa kategori karir untuk eksplorasi lebih lanjut")
    if final_percentage < 60:
        additional_recommendations.append("Pertimbangkan untuk mengambil quiz yang lebih lengkap untuk hasil yang lebih akurat")
    
    # Format hasil untuk frontend
    return {
        'kategori': best_category,
        'saran': personalized_description,
        'persentase': round(final_percentage, 1),
        'deskripsi': f"Kategori {career_data['title']}: {personalized_description}",
        'career': {
            'title': career_data['title'],
            'description': personalized_description,
            'jobs': career_data['jobs'],
            'skills': career_data['skills'],
            'personality_match': personality_scores[best_category],
            'economic_match': economic_scores.get(best_category, 3),
            'confidence_level': calculate_confidence_level(final_percentage, final_scores)
        },
        'analysis_details': {
            'personality_scores': personality_scores,
            'economic_scores': economic_scores,
            'final_scores': final_scores,
            'best_match': best_category,
            'secondary_matches': sorted(final_scores.items(), key=lambda x: x[1], reverse=True)[1:3],
            'quiz_type': quiz_type,
            'total_questions': len(jawaban),
            'additional_recommendations': additional_recommendations
        }
    }

def calculate_consistency_bonus(jawaban: Dict[str, Any]) -> float:
    """
    Hitung bonus untuk konsistensi jawaban
    """
    # Logika untuk mendeteksi konsistensi
    # Ini bisa dikembangkan lebih lanjut dengan analisis statistik
    values = list(jawaban.values())
    if len(values) < 2:
        return 0
    
    # Hitung variance (semakin rendah variance, semakin konsisten)
    variance = np.var(values) if values else 0
    consistency_bonus = max(0, 5 - variance)  # Max 5 poin bonus
    
    return consistency_bonus

def calculate_confidence_level(best_score: float, all_scores: dict) -> str:
    """
    Menghitung confidence level berdasarkan skor tertinggi dan distribusi skor
    dengan algoritma yang lebih sophisticated
    """
    if not all_scores or len(all_scores) == 0:
        return "Low"
    
    # Urutkan skor dari tertinggi ke terendah
    sorted_scores = sorted(all_scores.values(), reverse=True)
    
    # Hitung gap antara skor tertinggi dan kedua tertinggi
    score_gap = sorted_scores[0] - (sorted_scores[1] if len(sorted_scores) > 1 else 0)
    
    # Hitung standar deviasi untuk melihat sebaran skor
    mean_score = sum(all_scores.values()) / len(all_scores)
    variance = sum((score - mean_score) ** 2 for score in all_scores.values()) / len(all_scores)
    std_deviation = variance ** 0.5
    
    # Faktor-faktor untuk confidence level
    score_factor = best_score  # Skor tertinggi
    gap_factor = score_gap * 2  # Gap dengan pesaing terdekat (dikalikan 2 untuk bobot)
    consistency_factor = 100 - std_deviation  # Konsistensi skor (semakin kecil std dev, semakin tinggi)
    
    # Hitung confidence score (0-100)
    confidence_score = (score_factor * 0.6) + (gap_factor * 0.25) + (consistency_factor * 0.15)
    confidence_score = max(0, min(100, confidence_score))  # Batasi 0-100
    
    # Konversi ke level
    if confidence_score >= 80:
        return "High"
    elif confidence_score >= 60:
        return "Medium"
    else:
        return "Low"

def get_personality_questions():
    """Mendapatkan pertanyaan untuk quiz kepribadian"""
    return [
        {
            "id": 1,
            "question": "Apakah Anda lebih suka bekerja sendiri atau dalam tim?",
            "options": [
                {"value": "A", "text": "Saya lebih suka bekerja sendiri", "category": "Analyst"},
                {"value": "B", "text": "Saya lebih suka bekerja dalam tim", "category": "Social"},
                {"value": "C", "text": "Tergantung situasinya", "category": "Management"},
                {"value": "D", "text": "Saya suka keduanya", "category": "Creative"}
            ]
        },
        {
            "id": 2,
            "question": "Apa yang paling memotivasi Anda dalam bekerja?",
            "options": [
                {"value": "A", "text": "Menganalisis data dan menemukan insight", "category": "Analyst"},
                {"value": "B", "text": "Membantu orang lain", "category": "Social"},
                {"value": "C", "text": "Mendapatkan hasil yang konkrit", "category": "Marketing"},
                {"value": "D", "text": "Menciptakan sesuatu yang baru", "category": "Creative"}
            ]
        },
        {
            "id": 3,
            "question": "Bagaimana Anda menghadapi masalah yang kompleks?",
            "options": [
                {"value": "A", "text": "Menganalisis secara sistematis", "category": "Analyst"},
                {"value": "B", "text": "Diskusi dengan orang lain", "category": "Social"},
                {"value": "C", "text": "Mencari solusi praktis", "category": "Marketing"},
                {"value": "D", "text": "Berpikir out-of-the-box", "category": "Creative"}
            ]
        }
    ]

def get_economic_questions():
    """Mendapatkan pertanyaan untuk quiz ekonomi"""
    return [
        {
            "id": 1,
            "question": "Apa prioritas utama Anda dalam memilih pekerjaan?",
            "options": [
                {"value": "A", "text": "Gaji yang tinggi", "category": "Analyst"},
                {"value": "B", "text": "Stabilitas kerja", "category": "Management"},
                {"value": "C", "text": "Potensi pertumbuhan karir", "category": "Marketing"},
                {"value": "D", "text": "Work-life balance", "category": "Creative"}
            ]
        },
        {
            "id": 2,
            "question": "Bagaimana Anda melihat risiko dalam berinvestasi?",
            "options": [
                {"value": "A", "text": "Saya menghindari risiko", "category": "Management"},
                {"value": "B", "text": "Saya mengambil risiko yang dihitung", "category": "Analyst"},
                {"value": "C", "text": "Saya suka risiko tinggi dengan imbalan tinggi", "category": "Marketing"},
                {"value": "D", "text": "Saya mengikuti intuisi", "category": "Creative"}
            ]
        },
        {
            "id": 3,
            "question": "Apa tujuan keuangan jangka panjang Anda?",
            "options": [
                {"value": "A", "text": "Membangun kekayaan secara stabil", "category": "Analyst"},
                {"value": "B", "text": "Mencapai kebebasan finansial", "category": "Marketing"},
                {"value": "C", "text": "Menabung untuk masa depan", "category": "Management"},
                {"value": "D", "text": "Mengikuti passion tanpa khawatir uang", "category": "Social"}
            ]
        }
    ]

def get_comprehensive_questions():
    """Mendapatkan pertanyaan untuk quiz komprehensif (gabungan)"""
    personality_qs = get_personality_questions()
    economic_qs = get_economic_questions()
    
    # Gabungkan dan tambahkan pertanyaan tambahan
    comprehensive_qs = personality_qs + economic_qs + [
        {
            "id": 7,
            "question": "Apa yang membuat Anda merasa paling puas dalam pekerjaan?",
            "options": [
                {"value": "A", "text": "Menyelesaikan proyek yang kompleks", "category": "Analyst"},
                {"value": "B", "text": "Melihat dampak positif pada orang lain", "category": "Social"},
                {"value": "C", "text": "Mencapai target penjualan", "category": "Marketing"},
                {"value": "D", "text": "Melihat karya saya diapresiasi", "category": "Creative"}
            ]
        }
    ]
    
    return comprehensive_qs

def generate_personalized_description(career_data: Dict, personality_match: float, economic_match: float) -> str:
    """
    Generate deskripsi yang dipersonalisasi berdasarkan match score
    """
    base_desc = career_data['description']
    
    # Tambahkan personalisasi berdasarkan personality match
    if personality_match > 85:
        personality_add = " Kecocokan kepribadian Anda sangat tinggi dengan bidang ini."
    elif personality_match > 70:
        personality_add = " Kepribadian Anda cukup cocok dengan bidang karir ini."
    else:
        personality_add = " Anda memiliki potensi yang bisa dikembangkan di bidang ini."
    
    # Tambahkan personalisasi berdasarkan economic match
    if economic_match > 4:
        economic_add = " Preferensi ekonomi Anda juga sangat sesuai."
    elif economic_match > 3:
        economic_add = " Preferensi ekonomi Anda cukup sesuai."
    else:
        economic_add = " Namun, Anda mungkin perlu menyesuaikan preferensi ekonomi Anda."
    
    return base_desc + personality_add + economic_add