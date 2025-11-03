'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api';
import QuizComponent from '../../components/QuizComponent';

export default function Quiz() {
  const router = useRouter();
  const [quizType, setQuizType] = useState('comprehensive');

  useEffect(() => {
    // Cek apakah user sudah register
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      router.push('/register');
      return;
    }

    // Cek parameter quiz type dari URL
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    if (type && ['comprehensive', 'personality', 'economic'].includes(type)) {
      setQuizType(type);
    }
  }, [router]);

  const handleQuizComplete = (result) => {
    // Simpan hasil ke localStorage untuk ditampilkan di halaman result
    localStorage.setItem('quizResult', JSON.stringify(result));
    router.push('/result');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {quizType === 'personality' ? 'Quiz Kepribadian' : 
               quizType === 'economic' ? 'Quiz Ekonomi' : 'Career Path Quiz'}
            </h1>
            <div className="text-sm text-gray-600 capitalize">
              {quizType.replace('_', ' ')} Quiz
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {quizType === 'personality' ? 'Temukan karir yang sesuai dengan kepribadian Anda' :
             quizType === 'economic' ? 'Temukan karir berdasarkan preferensi ekonomi Anda' :
             'Temukan jalur karir yang paling sesuai dengan Anda'}
          </div>
        </div>

        {/* Quiz Component */}
        <QuizComponent quizType={quizType} onComplete={handleQuizComplete} />
      </div>
    </div>
  );
}