// Get API URL from localStorage or use default
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('apiUrl') || 'http://localhost:8000';
  }
  return 'http://localhost:8000';
};

export const apiService = {
  // Register user
  async registerUser(userData) {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/warga/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Submit quiz
  async submitQuiz(quizData) {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/quiz/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });
      
      if (!response.ok) {
        throw new Error('Quiz submission failed');
      }
      
      const result = await response.json();
      
      // Pastikan struktur data sesuai dengan yang diharapkan frontend
      return {
        ...result,
        career: result.career || {
          title: result.kategori || 'Career Recommendation',
          description: result.saran || '',
          jobs: [],
          skills: []
        }
      };
    } catch (error) {
      console.error('Quiz submission error:', error);
      throw error;
    }
  },

  // Get quiz results
  async getQuizResults(nik) {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/report/${nik}`);
      
      if (!response.ok) {
        throw new Error('Failed to get results');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get results error:', error);
      throw error;
    }
  },

  // Admin functions
  async getAllUsers() {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/warga/`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },

  async deleteUser(nik) {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/warga/${nik}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  },

  async exportToExcel() {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/warga/export`);
      
      if (!response.ok) {
        throw new Error('Gagal download Excel');
      }
      
      return response.blob();
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }
};