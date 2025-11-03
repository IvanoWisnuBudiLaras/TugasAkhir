'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiService } from '@/services/api';

export default function UserDetail() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { nik } = useParams();

  useEffect(() => {
    if (nik) {
      fetchUserDetail();
    }
  }, [nik]);

  const fetchUserDetail = async () => {
    setIsLoading(true);
    try {
      const apiUrl = localStorage.getItem('apiUrl') || 'http://localhost:8000';
      
      // Fetch user data
      const response = await fetch(`${apiUrl}/report/${nik}`);
      if (!response.ok) throw new Error('User not found');
      
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      setMessage('Error: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        await apiService.deleteUser(nik);
        
        setMessage('Data berhasil dihapus!');
        setTimeout(() => {
          router.push('/admin/data');
        }, 2000);
      } catch (error) {
        setMessage('Error: ' + error.message);
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">User Not Found</h1>
            <button
              onClick={() => router.push('/admin/data')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              ← Kembali ke Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">👤 Detail Pengguna</h1>
              <p className="text-gray-600">Informasi lengkap dan hasil assessment</p>
            </div>
            <button
              onClick={() => router.push('/admin/data')}
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

        {/* User Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 Informasi Pribadi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">NIK</label>
              <p className="text-lg font-semibold text-gray-900">{user.nik}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <p className="text-lg font-semibold text-gray-900">{user.nama}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Umur</label>
              <p className="text-lg font-semibold text-gray-900">{user.umur} tahun</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Alamat</label>
              <p className="text-lg font-semibold text-gray-900">{user.alamat}</p>
            </div>
          </div>
        </div>

        {/* Quiz Results */}
        {user.hasil_quiz && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🎯 Hasil Assessment Karir</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Karir</label>
                <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-semibold">
                  {user.hasil_quiz.kategori}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Persentase Kecocokan</label>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
                  {user.hasil_quiz.persentase}%
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
              <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                {user.hasil_quiz.deskripsi}
              </p>
            </div>

            {user.hasil_quiz.career && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">💼 Rekomendasi Karir</h3>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-blue-800 mb-2">{user.hasil_quiz.career.title}</h4>
                  <p className="text-blue-700">{user.hasil_quiz.career.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">🎯 Pekerjaan yang Cocok</h4>
                    <ul className="space-y-1">
                      {user.hasil_quiz.career.jobs?.map((job, index) => (
                        <li key={index} className="text-gray-700 flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {job}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">🛠️ Skill yang Dibutuhkan</h4>
                    <ul className="space-y-1">
                      {user.hasil_quiz.career.skills?.map((skill, index) => (
                        <li key={index} className="text-gray-700 flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex gap-4">
            <button
              onClick={deleteUser}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              🗑️ Hapus Data
            </button>
            <button
              onClick={() => router.push('/admin/data')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              ← Kembali ke Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}