'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '../services/api';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nik: '',
    nama: '',
    alamat: '',
    umur: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quizType, setQuizType] = useState('comprehensive');

  useEffect(() => {
    // Cek parameter quiz type dari URL
    const params = new URLSearchParams(window.location.search);
    const type = params.get('quiz_type');
    if (type && ['comprehensive', 'personality', 'economic'].includes(type)) {
      setQuizType(type);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validasi form
    if (!formData.nik || !formData.nama || !formData.alamat || !formData.umur) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.nik.length < 10) {
      setError('NIK must be at least 10 characters');
      return;
    }

    if (parseInt(formData.umur) < 17 || parseInt(formData.umur) > 100) {
      setError('Age must be between 17 and 100 years');
      return;
    }

    setLoading(true);

    try {
      // Kirim data ke backend
      const response = await apiService.registerUser(formData);
      
      if (response && response.success) {
        // Simpan data user di localStorage
        localStorage.setItem('userData', JSON.stringify(formData));
        
        // Redirect ke halaman quiz dengan quiz type
        router.push(`/quiz?type=${quizType}`);
        
        // Alternatif: redirect ke home jika ingin user melihat dashboard dulu
        // router.push('/home');
      } else {
        setError(response?.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎯</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">CareerPath Registration</h1>
          <p className="text-gray-600">Register to discover your ideal career path</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NIK (Nomor Induk Kependudukan)
            </label>
            <input
              type="text"
              name="nik"
              value={formData.nik}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your NIK"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your complete address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              name="umur"
              value={formData.umur}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your age"
              min="17"
              max="100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Processing...' : 'Start Career Assessment'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            By registering, you'll get access to our comprehensive career assessment quiz that will help identify your ideal career path based on your skills, interests, and personality.
          </p>
        </div>
      </div>
    </div>
  );
}