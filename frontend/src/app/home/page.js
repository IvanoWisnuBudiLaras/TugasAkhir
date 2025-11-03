'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [nikInput, setNikInput] = useState('');
  const [error, setError] = useState('');
  const [showQuizOptions, setShowQuizOptions] = useState(false);

  const handleStartQuiz = () => {
    setShowQuizOptions(true);
  };

  const handleQuizTypeSelect = (type) => {
    router.push(`/register?quiz_type=${type}`);
  };

  const handleViewResult = () => {
    if (!nikInput.trim()) {
      setError('Please enter your NIK to view results');
      return;
    }
    
    // Simpan NIK di localStorage untuk digunakan di halaman result
    localStorage.setItem('viewResultNIK', nikInput.trim());
    router.push('/result');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">🎯 CareerPath</h1>
          <p className="text-xl text-gray-600 mb-2">Discover Your Perfect Career Direction</p>
          <p className="text-gray-500">Take our comprehensive quiz to find the career path that matches your skills and interests</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get Started</h2>
            <p className="text-gray-600">Choose one of the options below to begin your career discovery journey</p>
          </div>

          <div className="space-y-6">
            {/* Quiz Options */}
            {!showQuizOptions ? (
              <div className="border-2 border-blue-200 rounded-lg p-6 hover:border-blue-400 transition-colors">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">🚀</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Pilih Tipe Assessment</h3>
                    <p className="text-gray-600">Pilih quiz yang sesuai dengan kebutuhan Anda</p>
                  </div>
                </div>
                <button
                  onClick={handleStartQuiz}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  🚀 Lihat Pilihan Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Comprehensive Quiz */}
                <div className="border-2 border-blue-200 rounded-lg p-6 hover:border-blue-400 transition-colors">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-4">🎯</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Quiz Komprehensif</h3>
                      <p className="text-gray-600">Assessment lengkap menggabungkan kepribadian, preferensi ekonomi, dan minat</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleQuizTypeSelect('comprehensive')}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    🎯 Mulai Quiz Komprehensif
                  </button>
                </div>

                {/* Personality Quiz */}
                <div className="border-2 border-purple-200 rounded-lg p-6 hover:border-purple-400 transition-colors">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-4">🧠</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Quiz Kepribadian</h3>
                      <p className="text-gray-600">Temukan karir yang sesuai dengan tipe kepribadian Anda</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleQuizTypeSelect('personality')}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    🧠 Mulai Quiz Kepribadian
                  </button>
                </div>

                {/* Economic Quiz */}
                <div className="border-2 border-green-200 rounded-lg p-6 hover:border-green-400 transition-colors">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-4">💰</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Quiz Ekonomi</h3>
                      <p className="text-gray-600">Temukan karir berdasarkan preferensi dan tujuan ekonomi Anda</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleQuizTypeSelect('economic')}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    💰 Mulai Quiz Ekonomi
                  </button>
                </div>

                <button
                  onClick={() => setShowQuizOptions(false)}
                  className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  ← Kembali
                </button>
              </div>
            )}

            {/* Admin Buttons */}
            <div className="border-2 border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Admin Access</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/admin')}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  ⚙️ Admin Panel
                </button>
                <button
                  onClick={() => router.push('/admin/data')}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  📊 Lihat Data
                </button>
              </div>
            </div>
            </div>

            {/* View Previous Results */}
            <div className="border-2 border-green-200 rounded-lg p-6 hover:border-green-400 transition-colors">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">📊</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">View Previous Results</h3>
                  <p className="text-gray-600">Check your previous career recommendations using your NIK</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter your NIK (Nomor Induk Kependudukan)"
                  value={nikInput}
                  onChange={(e) => {
                    setNikInput(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
                <button
                  onClick={handleViewResult}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  View My Results
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Why Choose CareerPath?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🧠</div>
              <h4 className="font-medium text-gray-800 mb-2">AI-Powered Analysis</h4>
              <p className="text-gray-600 text-sm">Advanced algorithms analyze your responses to provide personalized career recommendations</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💼</div>
              <h4 className="font-medium text-gray-800 mb-2">Comprehensive Database</h4>
              <p className="text-gray-600 text-sm">Access to hundreds of career paths with detailed job descriptions and skill requirements</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📈</div>
              <h4 className="font-medium text-gray-800 mb-2">Growth-Oriented</h4>
              <p className="text-gray-600 text-sm">Get actionable insights on skills to develop and career advancement opportunities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}