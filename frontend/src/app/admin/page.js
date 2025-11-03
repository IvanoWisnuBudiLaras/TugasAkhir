'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
  const [apiUrl, setApiUrl] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', '', ''],
    category: 'Analyst'
  });
  const [activeTab, setActiveTab] = useState('comprehensive');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const categories = ['Analyst', 'Marketing', 'Creative', 'Social', 'Management'];

  useEffect(() => {
    // Load API URL dari localStorage
    const savedApiUrl = localStorage.getItem('apiUrl') || 'http://localhost:8000';
    setApiUrl(savedApiUrl);

    // Load questions berdasarkan activeTab
    loadQuestionsByType(activeTab);
  }, [activeTab]);

  const loadQuestionsByType = (quizType) => {
    const storageKey = `careerQuestions_${quizType}`;
    const savedQuestions = localStorage.getItem(storageKey);
    
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    } else {
      // Default questions berdasarkan tipe quiz
      let defaultQuestions = [];
      
      switch (quizType) {
        case 'personality':
          defaultQuestions = [
            {
              id: 1,
              question: "Dalam situasi sosial, Anda lebih suka:",
              options: [
                "Berkumpul dengan banyak orang",
                "Bertemu dengan beberapa teman dekat",
                "Menghabiskan waktu sendiri",
                "Bergantung pada mood Anda",
                "Tidak ada preferensi khusus"
              ],
              category: "personality"
            },
            {
              id: 2,
              question: "Ketika menghadapi masalah, Anda:",
              options: [
                "Langsung mencari solusi praktis",
                "Menganalisis semua kemungkinan",
                "Mencari bantuan dari orang lain",
                "Mengikuti intuisi Anda",
                "Menunggu sampai masalah itu hilang"
              ],
              category: "personality"
            }
          ];
          break;
        case 'economic':
          defaultQuestions = [
            {
              id: 1,
              question: "Preferensi gaji Anda:",
              options: [
                "Gaji tinggi dengan risiko tinggi",
                "Gaji stabil dengan pertumbuhan lambat",
                "Gaji menengah dengan bonus performa",
                "Gaji kecil tapi potensi besar di masa depan",
                "Tidak terlalu penting asal menyenangkan"
              ],
              category: "economic"
            },
            {
              id: 2,
              question: "Tentang investasi karir:",
              options: [
                "Saya ingin hasil cepat",
                "Saya bersedia menunggu untuk hasil yang lebih baik",
                "Saya ingin keseimbangan antara hasil dan waktu",
                "Saya mengikuti tren pasar",
                "Saya tidak terlalu memikirkannya"
              ],
              category: "economic"
            }
          ];
          break;
        default: // comprehensive
          defaultQuestions = [
            {
              id: 1,
              question: "Apa yang paling Anda sukai?",
              options: [
                "Menganalisis data dan membuat laporan",
                "Bertemu dan berinteraksi dengan banyak orang",
                "Menciptakan karya seni atau desain",
                "Membantu orang menyelesaikan masalah",
                "Memimpin tim dan mengambil keputusan"
              ],
              category: "Analyst"
            },
            {
              id: 2,
              question: "Bagaimana Anda bekerja yang terbaik?",
              options: [
                "Dengan data dan fakta yang jelas",
                "Dalam tim yang aktif dan dinamis",
                "Dengan kebebasan untuk berkreasi",
                "Dalam lingkungan yang mendukung",
                "Dengan target dan tenggat waktu yang jelas"
              ],
              category: "Analyst"
            }
          ];
      }
      
      setQuestions(defaultQuestions);
    }
  };

  const saveApiUrl = () => {
    localStorage.setItem('apiUrl', apiUrl);
    setMessage('API URL berhasil disimpan!');
    setTimeout(() => setMessage(''), 3000);
  };

  const saveQuestions = () => {
    const storageKey = `careerQuestions_${activeTab}`;
    localStorage.setItem(storageKey, JSON.stringify(questions));
    setMessage(`Pertanyaan ${activeTab} berhasil disimpan!`);
    setTimeout(() => setMessage(''), 3000);
  };

  const addQuestion = () => {
    if (newQuestion.question.trim() && newQuestion.options.every(opt => opt.trim())) {
      const question = {
        id: Date.now(),
        ...newQuestion,
        category: activeTab === 'comprehensive' ? newQuestion.category : activeTab
      };
      setQuestions([...questions, question]);
      setNewQuestion({
        question: '',
        options: ['', '', '', '', ''],
        category: 'Analyst'
      });
      setMessage('Pertanyaan baru ditambahkan!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
    setMessage('Pertanyaan dihapus!');
    setTimeout(() => setMessage(''), 3000);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? value : opt) }
        : q
    ));
  };

  const exportToExcel = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/report/export`);
      if (!response.ok) throw new Error('Gagal download Excel');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `career-assessment-data-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setMessage('Excel berhasil di-download!');
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const viewAllData = () => {
    router.push('/admin/data');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">🎯 Admin Panel - CareerPath</h1>
              <p className="text-gray-600">Kelola API endpoint dan pertanyaan assessment</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ← Kembali
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        {/* API Configuration */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">⚙️ Konfigurasi API</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:8000"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={saveApiUrl}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Simpan API
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🚀 Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={exportToExcel}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? '⏳' : '📊'} Download Excel
            </button>
            <button
              onClick={viewAllData}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              👁️ Lihat Semua Data
            </button>
            <button
              onClick={saveQuestions}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              💾 Simpan Pertanyaan
            </button>
          </div>
        </div>

        {/* Quiz Type Tabs */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📝 Kelola Pertanyaan Quiz</h2>
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('comprehensive')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'comprehensive'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🎯 Komprehensif
            </button>
            <button
              onClick={() => setActiveTab('personality')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'personality'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🧠 Kepribadian
            </button>
            <button
              onClick={() => setActiveTab('economic')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'economic'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              💰 Ekonomi
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {activeTab === 'comprehensive' && 'Menggabungkan aspek kepribadian dan ekonomi untuk rekomendasi karier yang holistik.'}
            {activeTab === 'personality' && 'Fokus pada preferensi kepribadian dan gaya kerja untuk menemukan karier yang sesuai.'}
            {activeTab === 'economic' && 'Berdasarkan preferensi gaji, stabilitas, dan tujuan finansial untuk rekomendasi karier.'}
          </p>
        </div>

        {/* Add New Question */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">➕ Tambah Pertanyaan Baru - {activeTab}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pertanyaan</label>
              <textarea
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                placeholder="Masukkan pertanyaan..."
              />
            </div>
            
            {activeTab === 'comprehensive' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <select
                  value={newQuestion.category}
                  onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Opsi Jawaban (5 opsi)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {newQuestion.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newQuestion.options];
                      newOptions[index] = e.target.value;
                      setNewQuestion({...newQuestion, options: newOptions});
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Opsi ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={addQuestion}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Tambah Pertanyaan
            </button>
          </div>
        </div>

        {/* Existing Questions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📝 Daftar Pertanyaan {activeTab} ({questions.length})</h2>
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                        #{index + 1}
                      </span>
                      {activeTab === 'comprehensive' && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium">
                          {question.category}
                        </span>
                      )}
                    </div>
                    <textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="2"
                    />
                  </div>
                  <button
                    onClick={() => deleteQuestion(question.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors ml-4"
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {question.options.map((option, optIndex) => (
                    <input
                      key={optIndex}
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Opsi ${optIndex + 1}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}