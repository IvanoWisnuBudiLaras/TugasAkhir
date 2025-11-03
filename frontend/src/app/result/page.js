'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api';

export default function Result() {
  const router = useRouter();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        // Cek apakah ada NIK untuk melihat hasil sebelumnya
        const viewResultNIK = localStorage.getItem('viewResultNIK');
        const userData = localStorage.getItem('userData');
        
        if (viewResultNIK) {
          // Ambil hasil dari backend berdasarkan NIK
          const response = await apiService.getReport(viewResultNIK);
          if (response && response.data) {
            setResultData(response.data);
          } else {
            setError('No results found for this NIK');
          }
          localStorage.removeItem('viewResultNIK');
        } else if (localStorage.getItem('quizResult')) {
          // Gunakan hasil yang baru saja di-submit
          const quizResult = JSON.parse(localStorage.getItem('quizResult'));
          setResultData(quizResult);
        } else if (userData) {
          // Coba ambil hasil terakhir berdasarkan NIK dari user yang login
          const user = JSON.parse(userData);
          const response = await apiService.getReport(user.nik);
          if (response && response.data) {
            setResultData(response.data);
          } else {
            setError('Please complete the quiz first to see your results.');
          }
        } else {
          setError('No result data found. Please complete the quiz first.');
        }
      } catch (err) {
        console.error('Error fetching result:', err);
        setError(err.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  const handleRetakeQuiz = () => {
    localStorage.removeItem('quizResult');
    router.push('/quiz');
  };

  const handleNewRegistration = () => {
    localStorage.clear();
    router.push('/register');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleViewData = () => {
    router.push('/admin/data');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your career recommendation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-700 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Home
            </button>
            <button
              onClick={handleNewRegistration}
              className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              New Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!resultData || !resultData.career) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-yellow-600 text-xl mb-4">📊</div>
          <p className="text-gray-700 mb-6">No career recommendation data found.</p>
          <button
            onClick={handleRetakeQuiz}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Take Quiz
          </button>
        </div>
      </div>
    );
  }

  const { career, nik, nama, umur, created_at, detail_analisis, confidence_level } = resultData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🎯 Career Recommendation</h1>
          <p className="text-gray-600">Your personalized career path based on your quiz results</p>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600"><span className="font-medium">NIK:</span> {nik}</p>
              <p className="text-gray-600"><span className="font-medium">Name:</span> {nama}</p>
            </div>
            <div>
              <p className="text-gray-600"><span className="font-medium">Age:</span> {umur} years old</p>
              <p className="text-gray-600"><span className="font-medium">Test Date:</span> {new Date(created_at || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Career Recommendation */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-blue-600 mb-2">{career.title}</h2>
            <p className="text-gray-700 text-lg">{career.description}</p>
            {confidence_level && (
              <div className="mt-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  confidence_level >= 80 ? 'bg-green-100 text-green-800' :
                  confidence_level >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Confidence: {confidence_level}%
                </span>
              </div>
            )}
          </div>

          {/* Recommended Jobs */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">💼 Recommended Jobs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {career.jobs.map((job, index) => (
                <div key={index} className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                  <span className="text-blue-800 font-medium">{job}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Required Skills */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">🛠️ Key Skills to Develop</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {career.skills.map((skill, index) => (
                <div key={index} className="bg-green-50 p-3 rounded-lg text-center">
                  <span className="text-green-800 font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Career Tips */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-6">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Career Tips</h4>
            <ul className="text-yellow-700 space-y-1">
              <li>• Focus on developing the key skills listed above</li>
              <li>• Consider taking relevant courses or certifications</li>
              <li>• Build a portfolio that showcases your abilities</li>
              <li>• Network with professionals in this field</li>
            </ul>
          </div>

          {/* Detail Analysis */}
          {detail_analisis && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">📊 Detailed Analysis</h4>
              <p className="text-gray-700">{detail_analisis}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="text-center space-y-3">
            <button
              onClick={handleRetakeQuiz}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🔄 Retake Quiz
            </button>
            <button
              onClick={handleGoHome}
              className="w-full md:w-auto px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium ml-0 md:ml-3"
            >
              🏠 Back to Home
            </button>
            {localStorage.getItem('userData') && (
              <button
                onClick={handleViewData}
                className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium ml-0 md:ml-3"
              >
                📋 View All Data
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}