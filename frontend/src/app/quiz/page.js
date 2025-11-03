'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
    const categoryCount = {
      "Analyst": 0,
      "Marketing": 0, 
      "Creative": 0,
      "Social": 0,
      "Management": 0
    };

    answers.forEach(answer => {
      if (answer && answer.category) {
        categoryCount[answer.category]++;
      }
    });

    // Temukan kategori dengan skor tertinggi
    let maxCategory = "Analyst";
    let maxScore = 0;
    
    Object.entries(categoryCount).forEach(([category, score]) => {
      if (score > maxScore) {
        maxScore = score;
        maxCategory = category;
      }
    });

    // Definisikan karir berdasarkan kategori
    const careerRecommendations = {
      "Analyst": {
        title: "Data Analyst / Data Scientist",
        description: "Anda memiliki kemampuan analitis yang kuat. Cocok untuk bekerja dengan data, statistik, dan pemecahan masalah kompleks.",
        jobs: ["Data Analyst", "Business Analyst", "Financial Analyst", "Researcher", "Quality Assurance"],
        skills: ["Excel", "SQL", "Python/R", "Statistics", "Critical Thinking"]
      },
      "Marketing": {
        title: "Marketing / Sales Professional",
        description: "Anda memiliki keahlian dalam komunikasi dan strategi pemasaran. Cocok untuk dunia penjualan dan promosi.",
        jobs: ["Marketing Manager", "Sales Executive", "Brand Manager", "Digital Marketer", "PR Specialist"],
        skills: ["Communication", "Negotiation", "Market Research", "Social Media", "Presentation"]
      },
      "Creative": {
        title: "Creative / Design Professional",
        description: "Anda memiliki bakat kreatif dan artistic. Cocok untuk menciptakan konten dan desain yang inovatif.",
        jobs: ["Graphic Designer", "Content Creator", "UI/UX Designer", "Copywriter", "Video Editor"],
        skills: ["Design Software", "Creativity", "Visual Thinking", "Storytelling", "Aesthetic Sense"]
      },
      "Social": {
        title: "Social / Education Professional", 
        description: "Anda peduli pada orang lain dan ingin membuat dampak positif. Cocok untuk pekerjaan sosial dan pendidikan.",
        jobs: ["Teacher", "Social Worker", "Counselor", "HR Specialist", "Customer Service"],
        skills: ["Empathy", "Communication", "Patience", "Problem Solving", "Interpersonal"]
      },
      "Management": {
        title: "Management / Leadership",
        description: "Anda memiliki kemampuan kepemimpinan dan organisasi. Cocok untuk memimpin tim dan mengelola proyek.",
        jobs: ["Project Manager", "Operations Manager", "Team Leader", "Business Development", "Consultant"],
        skills: ["Leadership", "Planning", "Decision Making", "Team Building", "Strategic Thinking"]
      }
    };

    return careerRecommendations[maxCategory];
  };

  const handleSubmit = async () => {
    if (answers.length < careerQuestions.length) {
      setError('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const careerResult = calculateCareer();
      const quizData = {
        nik: userData.nik,
        nama: userData.nama,
        umur: userData.umur
      };

      const result = await apiService.submitQuiz(quizData);
      
      // Simpan hasil di localStorage untuk ditampilkan di halaman hasil
      localStorage.setItem('quizResult', JSON.stringify({
        ...result,
        career: careerResult,
        totalQuestions: careerQuestions.length,
        answeredQuestions: answers.length
      }));
      
      // Redirect ke halaman hasil
      router.push('/result');
    } catch (err) {
      setError(err.message || 'Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const progress = ((currentQuestion + 1) / careerQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Career Path Quiz</h1>
            <div className="text-sm text-gray-600">
              Welcome, {userData.nama}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Question {currentQuestion + 1} of {careerQuestions.length}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {careerQuestions[currentQuestion].question}
          </h2>
          
          <div className="space-y-3">
            {careerQuestions[currentQuestion].options.map((option, index) => (
              <label
                key={index}
                className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  answers[currentQuestion]?.option === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={index}
                  checked={answers[currentQuestion]?.option === index}
                  onChange={() => handleAnswer(index, careerQuestions[currentQuestion].categories[index])}
                  className="sr-only"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          {currentQuestion === careerQuestions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || answers[currentQuestion] === undefined}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Analyzing...' : 'Get Career Recommendation'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={answers[currentQuestion] === undefined}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}