'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizComponent({ quizType = 'comprehensive', onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({ nik: '', nama: '', umur: '' });
  const router = useRouter();

  // Load questions berdasarkan quiz type
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Coba ambil dari backend dulu
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quiz/questions/${quizType}`);
        
        if (response.ok) {
          const data = await response.json();
          setQuestions(data.questions);
        } else {
          // Fallback ke local function jika backend tidak tersedia
          let loadedQuestions = [];
          
          if (quizType === 'personality') {
            loadedQuestions = getPersonalityQuestions();
          } else if (quizType === 'economic') {
            loadedQuestions = getEconomicQuestions();
          } else {
            // Comprehensive - gabungan dari semua jenis quiz
            loadedQuestions = getComprehensiveQuestions();
          }
          
          setQuestions(loadedQuestions);
        }
      } catch (error) {
        console.error('Error loading questions from backend:', error);
        // Fallback ke local function
        let loadedQuestions = [];
        
        if (quizType === 'personality') {
          loadedQuestions = getPersonalityQuestions();
        } else if (quizType === 'economic') {
          loadedQuestions = getEconomicQuestions();
        } else {
          // Comprehensive - gabungan dari semua jenis quiz
          loadedQuestions = getComprehensiveQuestions();
        }
        
        setQuestions(loadedQuestions);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [quizType]);

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Fungsi fallback untuk mendapatkan pertanyaan secara lokal
  const getPersonalityQuestions = () => {
    return [
      {
        id: 1,
        question: "Apakah Anda lebih suka bekerja sendiri atau dalam tim?",
        type: "multiple_choice",
        options: [
          { value: "A", text: "Saya lebih suka bekerja sendiri", category: "Analyst" },
          { value: "B", text: "Saya lebih suka bekerja dalam tim", category: "Social" },
          { value: "C", text: "Tergantung situasinya", category: "Management" },
          { value: "D", text: "Saya suka keduanya", category: "Creative" }
        ]
      },
      {
        id: 2,
        question: "Apa yang paling memotivasi Anda dalam bekerja?",
        type: "multiple_choice",
        options: [
          { value: "A", text: "Menganalisis data dan menemukan insight", category: "Analyst" },
          { value: "B", text: "Membantu orang lain", category: "Social" },
          { value: "C", text: "Mendapatkan hasil yang konkrit", category: "Marketing" },
          { value: "D", text: "Menciptakan sesuatu yang baru", category: "Creative" }
        ]
      },
      {
        id: 3,
        question: "Bagaimana Anda menghadapi masalah yang kompleks?",
        type: "multiple_choice",
        options: [
          { value: "A", text: "Menganalisis secara sistematis", category: "Analyst" },
          { value: "B", text: "Diskusi dengan orang lain", category: "Social" },
          { value: "C", text: "Mencari solusi praktis", category: "Marketing" },
          { value: "D", text: "Berpikir out-of-the-box", category: "Creative" }
        ]
      }
    ];
  };

  const getEconomicQuestions = () => {
    return [
      {
        id: 1,
        question: "Apa prioritas utama Anda dalam memilih pekerjaan?",
        type: "multiple_choice",
        options: [
          { value: "A", text: "Gaji yang tinggi", category: "Analyst" },
          { value: "B", text: "Stabilitas kerja", category: "Management" },
          { value: "C", text: "Potensi pertumbuhan karir", category: "Marketing" },
          { value: "D", text: "Work-life balance", category: "Creative" }
        ]
      },
      {
        id: 2,
        question: "Bagaimana Anda melihat risiko dalam berinvestasi?",
        type: "multiple_choice",
        options: [
          { value: "A", text: "Saya menghindari risiko", category: "Management" },
          { value: "B", text: "Saya mengambil risiko yang dihitung", category: "Analyst" },
          { value: "C", text: "Saya suka risiko tinggi dengan imbalan tinggi", category: "Marketing" },
          { value: "D", text: "Saya mengikuti intuisi", category: "Creative" }
        ]
      },
      {
        id: 3,
        question: "Apa tujuan keuangan jangka panjang Anda?",
        type: "multiple_choice",
        options: [
          { value: "A", text: "Membangun kekayaan secara stabil", category: "Analyst" },
          { value: "B", text: "Mencapai kebebasan finansial", category: "Marketing" },
          { value: "C", text: "Menabung untuk masa depan", category: "Management" },
          { value: "D", text: "Mengikuti passion tanpa khawatir uang", category: "Social" }
        ]
      }
    ];
  };

  const getComprehensiveQuestions = () => {
    const personalityQs = getPersonalityQuestions();
    const economicQs = getEconomicQuestions();
    
    // Gabungkan dan tambahkan pertanyaan tambahan
    return [
      ...personalityQs,
      ...economicQs,
      {
        id: 7,
        question: "Apa yang membuat Anda merasa paling puas dalam pekerjaan?",
        type: "multiple_choice",
        options: [
          { value: "A", text: "Menyelesaikan proyek yang kompleks", category: "Analyst" },
          { value: "B", text: "Melihat dampak positif pada orang lain", category: "Social" },
          { value: "C", text: "Mencapai target penjualan", category: "Marketing" },
          { value: "D", text: "Melihat karya saya diapresiasi", category: "Creative" }
        ]
      }
    ];
  };

  const handleSubmit = async () => {
    if (!userInfo.nik || !userInfo.nama || !userInfo.umur) {
      alert('Mohon lengkapi informasi data diri terlebih dahulu');
      return;
    }

    if (Object.keys(answers).length < questions.length) {
      alert('Mohon jawab semua pertanyaan terlebih dahulu');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quiz/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nik: userInfo.nik,
          nama: userInfo.nama,
          umur: parseInt(userInfo.umur),
          jawaban: answers,
          quiz_type: quizType
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal mengirim quiz');
      }

      const result = await response.json();
      
      if (onComplete) {
        onComplete(result);
      } else {
        // Simpan ke localStorage untuk ditampilkan di halaman result
        localStorage.setItem('quizResult', JSON.stringify(result));
        router.push('/result');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Terjadi kesalahan saat mengirim quiz. Silakan coba lagi.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading questions...</div>;
  }

  if (currentQuestion >= questions.length) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Konfirmasi Data</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">NIK</label>
            <input
              type="text"
              value={userInfo.nik}
              onChange={(e) => setUserInfo(prev => ({ ...prev, nik: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan NIK Anda"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
            <input
              type="text"
              value={userInfo.nama}
              onChange={(e) => setUserInfo(prev => ({ ...prev, nama: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan nama lengkap Anda"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Umur</label>
            <input
              type="number"
              value={userInfo.umur}
              onChange={(e) => setUserInfo(prev => ({ ...prev, umur: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan umur Anda"
              min="1"
              max="100"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentQuestion(questions.length - 1)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Kembali
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Kirim Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-500">
            Pertanyaan {currentQuestion + 1} dari {questions.length}
          </span>
          <span className="text-sm font-medium text-blue-600 capitalize">
            {quizType.replace('_', ' ')} Quiz
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">{currentQ.question}</h3>
        
        {currentQ.type === 'multiple_choice' && (
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <label key={index} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name={currentQ.id}
                  value={option.value}
                  checked={answers[currentQ.id] === option.value}
                  onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                  className="mr-3"
                />
                <span>{option.text}</span>
              </label>
            ))}
          </div>
        )}

        {currentQ.type === 'scale' && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{currentQ.scaleLabels?.min || 'Sangat Tidak Setuju'}</span>
              <span>{currentQ.scaleLabels?.max || 'Sangat Setuju'}</span>
            </div>
            <div className="flex justify-center">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className="mx-2 text-center">
                  <input
                    type="radio"
                    name={currentQ.id}
                    value={value}
                    checked={answers[currentQ.id] === value}
                    onChange={(e) => handleAnswer(currentQ.id, parseInt(e.target.value))}
                    className="mb-2"
                  />
                  <div className="text-sm">{value}</div>
                </label>
              ))}
            </div>
          </div>
        )}

        {currentQ.type === 'text' && (
          <textarea
            value={answers[currentQ.id] || ''}
            onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Jawaban Anda..."
          />
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Sebelumnya
        </button>
        <button
          onClick={nextQuestion}
          disabled={!answers[currentQ.id]}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {currentQuestion === questions.length - 1 ? 'Lanjut ke Data Diri' : 'Selanjutnya'}
        </button>
      </div>
    </div>
  );
}

// Fungsi untuk mendapatkan pertanyaan berdasarkan tipe
function getPersonalityQuestions() {
  return [
    {
      id: 'personality_1',
      question: 'Saya lebih suka bekerja secara mandiri daripada dalam tim',
      type: 'scale',
      category: 'personality'
    },
    {
      id: 'personality_2',
      question: 'Saya merasa nyaman berbicara di depan banyak orang',
      type: 'scale',
      category: 'personality'
    },
    {
      id: 'personality_3',
      question: 'Saya lebih suka pekerjaan yang memiliki struktur yang jelas',
      type: 'scale',
      category: 'personality'
    },
    {
      id: 'personality_4',
      question: 'Saya senang mengambil risiko dalam pekerjaan',
      type: 'scale',
      category: 'personality'
    },
    {
      id: 'personality_5',
      question: 'Saya lebih suka bekerja dengan angka dan data daripada dengan orang',
      type: 'scale',
      category: 'personality'
    }
  ];
}

function getEconomicQuestions() {
  return [
    {
      id: 'economic_1',
      question: 'Berapa pendapatan bulanan yang Anda harapkan dari pekerjaan impian Anda?',
      type: 'multiple_choice',
      options: [
        { value: 'low', text: 'Rp 3-5 juta (Stabil dan cukup)' },
        { value: 'medium', text: 'Rp 5-10 juta (Menengah)' },
        { value: 'high', text: 'Rp 10-20 juta (Tinggi)' },
        { value: 'very_high', text: 'Di atas Rp 20 juta (Sangat tinggi)' }
      ],
      category: 'economic'
    },
    {
      id: 'economic_2',
      question: 'Seberapa penting stabilitas pekerjaan bagi Anda?',
      type: 'scale',
      category: 'economic'
    },
    {
      id: 'economic_3',
      question: 'Apakah Anda tertarik memulai bisnis sendiri?',
      type: 'multiple_choice',
      options: [
        { value: 'no', text: 'Tidak tertarik sama sekali' },
        { value: 'maybe', text: 'Mungkin suatu saat nanti' },
        { value: 'yes', text: 'Ya, saya tertarik' },
        { value: 'definitely', text: 'Sangat tertarik, itu tujuan saya' }
      ],
      category: 'economic'
    },
    {
      id: 'economic_4',
      question: 'Seberapa penting potensi pertumbuhan karir dalam memilih pekerjaan?',
      type: 'scale',
      category: 'economic'
    }
  ];
}

function getComprehensiveQuestions() {
  return [
    // Pertanyaan kepribadian
    {
      id: 'comp_1',
      question: 'Dalam bekerja, saya lebih suka:',
      type: 'multiple_choice',
      options: [
        { value: 'analytical', text: 'Menganalisis data dan membuat laporan' },
        { value: 'creative', text: 'Menciptakan ide-ide baru dan inovatif' },
        { value: 'social', text: 'Berkomunikasi dan bekerja dengan orang lain' },
        { value: 'management', text: 'Memimpin tim dan mengambil keputusan' }
      ],
      category: 'personality'
    },
    {
      id: 'comp_2',
      question: 'Saya merasa paling nyaman ketika:',
      type: 'multiple_choice',
      options: [
        { value: 'structured', text: 'Ada aturan dan prosedur yang jelas' },
        { value: 'flexible', text: 'Bebas mengeksplorasi ide-ide baru' },
        { value: 'collaborative', text: 'Bekerja dalam tim yang solid' },
        { value: 'independent', text: 'Bekerja secara mandiri dengan tanggung jawab penuh' }
      ],
      category: 'personality'
    },
    // Pertanyaan ekonomi
    {
      id: 'comp_3',
      question: 'Apa yang paling penting dalam pekerjaan untuk Anda?',
      type: 'multiple_choice',
      options: [
        { value: 'stability', text: 'Kestabilan dan jaminan masa depan' },
        { value: 'growth', text: 'Potensi pertumbuhan karir' },
        { value: 'income', text: 'Pendapatan yang kompetitif' },
        { value: 'freedom', text: 'Kebebasan dan fleksibilitas' }
      ],
      category: 'economic'
    },
    {
      id: 'comp_4',
      question: 'Seberapa besar risiko yang bersedia Anda ambil dalam karir?',
      type: 'scale',
      category: 'economic'
    }
  ];
}