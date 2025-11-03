'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '../../services/api';

export default function AdminData() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Fetch all users
      const users = await apiService.getAllUsers();
      
      // Fetch all quiz results
      const apiUrl = localStorage.getItem('apiUrl') || 'http://localhost:8000';
      const hasilResponse = await fetch(`${apiUrl}/report/export`);
      const hasilData = await hasilResponse.json();
      
      // Combine data
      const combinedData = users.map(warga => {
        const hasil = hasilData.find(h => h.nik === warga.nik);
        return {
          ...warga,
          hasil_quiz: hasil || null
        };
      });
      
      setData(combinedData);
    } catch (error) {
      setMessage('Error: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (nik) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        await apiService.deleteUser(nik);
        
        // Refresh data
        fetchAllData();
        setMessage('Data berhasil dihapus!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error: ' + error.message);
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const exportToExcel = async () => {
    try {
      const blob = await apiService.exportToExcel();
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
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getStatusColor = (persentase) => {
    if (persentase >= 80) return 'bg-green-100 text-green-800';
    if (persentase >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const viewDetailAnalisis = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedUser(null);
    setShowDetailModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Data Semua Pengguna</h1>
              <p className="text-gray-600">Total: {data.length} pengguna terdaftar</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchAllData}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🔄 Refresh
              </button>
              <button
                onClick={exportToExcel}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                📊 Download Excel
              </button>
              <button
                onClick={() => router.push('/admin')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ← Admin Panel
              </button>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data...</p>
          </div>
        )}

        {/* Data Table */}
        {!isLoading && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NIK
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Umur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alamat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hasil Quiz
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Persentase
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((user, index) => (
                    <tr key={user.nik} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.nik}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.nama}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.umur} tahun
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate" title={user.alamat}>
                          {user.alamat}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.hasil_quiz ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Sudah
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Belum
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.hasil_quiz ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {user.hasil_quiz.kategori}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.hasil_quiz ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.hasil_quiz.persentase)}`}>
                            {user.hasil_quiz.persentase}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {user.hasil_quiz && (
                            <button
                              onClick={() => viewDetailAnalisis(user)}
                              className="text-purple-600 hover:text-purple-900"
                            >
                              🔍 Analisis
                            </button>
                          )}
                          <button
                            onClick={() => router.push(`/admin/detail/${user.nik}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            👁️ Detail
                          </button>
                          <button
                            onClick={() => deleteUser(user.nik)}
                            className="text-red-600 hover:text-red-900"
                          >
                            🗑️ Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {data.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Belum ada data pengguna yang terdaftar.</p>
              </div>
            )}
          </div>
        )}

        {/* Detail Analisis Modal */}
        {showDetailModal && selectedUser && selectedUser.hasil_quiz && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    🔍 Detail Analisis - {selectedUser.nama}
                  </h2>
                  <button
                    onClick={closeDetailModal}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informasi Dasar */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Informasi Pengguna</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">NIK:</span> {selectedUser.nik}</p>
                      <p><span className="font-medium">Nama:</span> {selectedUser.nama}</p>
                      <p><span className="font-medium">Umur:</span> {selectedUser.umur} tahun</p>
                      <p><span className="font-medium">Alamat:</span> {selectedUser.alamat}</p>
                    </div>
                  </div>

                  {/* Hasil Quiz */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Hasil Quiz</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Kategori:</span> {selectedUser.hasil_quiz.kategori}</p>
                      <p><span className="font-medium">Persentase:</span> 
                        <span className={`ml-1 px-2 py-1 rounded text-sm ${getStatusColor(selectedUser.hasil_quiz.persentase)}`}>
                          {selectedUser.hasil_quiz.persentase}%
                        </span>
                      </p>
                      <p><span className="font-medium">Confidence Level:</span> 
                        <span className={`ml-1 px-2 py-1 rounded text-sm ${
                          selectedUser.hasil_quiz.confidence_level === 'High' ? 'bg-green-100 text-green-800' :
                          selectedUser.hasil_quiz.confidence_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedUser.hasil_quiz.confidence_level}
                        </span>
                      </p>
                      <p><span className="font-medium">Quiz Type:</span> {selectedUser.hasil_quiz.quiz_type || 'comprehensive'}</p>
                    </div>
                  </div>
                </div>

                {/* Detail Analisis */}
                {selectedUser.hasil_quiz.detail_analisis && (
                  <div className="mt-6 bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🔬 Detail Analisis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedUser.hasil_quiz.detail_analisis.personality_match && (
                        <div className="bg-white rounded-lg p-3">
                          <h4 className="font-medium text-gray-700 mb-2">Kepribadian</h4>
                          <p className="text-sm text-gray-600">{selectedUser.hasil_quiz.detail_analisis.personality_match}</p>
                        </div>
                      )}
                      {selectedUser.hasil_quiz.detail_analisis.economic_preference && (
                        <div className="bg-white rounded-lg p-3">
                          <h4 className="font-medium text-gray-700 mb-2">Ekonomi</h4>
                          <p className="text-sm text-gray-600">{selectedUser.hasil_quiz.detail_analisis.economic_preference}</p>
                        </div>
                      )}
                      {selectedUser.hasil_quiz.detail_analisis.age_factor && (
                        <div className="bg-white rounded-lg p-3">
                          <h4 className="font-medium text-gray-700 mb-2">Faktor Usia</h4>
                          <p className="text-sm text-gray-600">{selectedUser.hasil_quiz.detail_analisis.age_factor}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Rekomendasi Pekerjaan */}
                {selectedUser.hasil_quiz.rekomendasi && (
                  <div className="mt-6 bg-green-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">💼 Rekomendasi Pekerjaan</h3>
                    <div className="space-y-3">
                      {selectedUser.hasil_quiz.rekomendasi.map((pekerjaan, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 border">
                          <h4 className="font-medium text-gray-800">{pekerjaan.nama}</h4>
                          <p className="text-sm text-gray-600 mt-1">{pekerjaan.deskripsi}</p>
                          {pekerjaan.gaji && (
                            <p className="text-sm text-green-600 mt-1">
                              <span className="font-medium">Estimasi Gaji:</span> Rp {pekerjaan.gaji.toLocaleString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills yang Dibutuhkan */}
                {selectedUser.hasil_quiz.skills_dibutuhkan && selectedUser.hasil_quiz.skills_dibutuhkan.length > 0 && (
                  <div className="mt-6 bg-yellow-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🛠️ Skills yang Dibutuhkan</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.hasil_quiz.skills_dibutuhkan.map((skill, index) => (
                        <span key={index} className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tombol Aksi */}
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={closeDetailModal}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}