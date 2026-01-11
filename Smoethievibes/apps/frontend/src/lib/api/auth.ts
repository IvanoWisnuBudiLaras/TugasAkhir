const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const authAPI = {
  // Helper untuk mengambil token dan membuat header Authorization
  getAuthHeaders: (): Record<string, string> => {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  // LOGIN
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return response.json();
  },

  // REGISTER
  register: async (email: string, password: string, name: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  },

  // LOGOUT (Tahan terhadap error 401 atau network error)
  logout: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authAPI.getAuthHeaders(),
        },
      });

      // Tetap kembalikan sukses meski status tidak OK agar frontend bisa bersih-bersih
      if (response.ok) {
        return await response.json();
      }
      console.warn("Server-side logout returned non-OK status");
      return { success: true };
    } catch (error) {
      console.error("Logout API network error:", error);
      return { success: true };
    }
  },

  // GET ME (Ambil data user yang sedang login)
  getMe: async () => {
    const headers = authAPI.getAuthHeaders();
    
    // Jika tidak ada token, tidak perlu panggil API
    if (!headers.Authorization) {
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });

      if (response.status === 401) {
        return null;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      return response.json();
    } catch (error) {
      console.error("Error in getMe:", error);
      return null;
    }
  },

  // VERIFY OTP
  verifyOtp: async (email: string, otp: string) => {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "OTP verification failed");
    }

    return response.json();
  },

  // RESEND OTP
  resendOtp: async (email: string, action: 'LOGIN' | 'REGISTER') => {
    const response = await fetch(`${API_URL}/auth/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, action }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to resend OTP");
    }

    return response.json();
  },

  // UPDATE PROFILE (Tambahan jika dibutuhkan di halaman profile)
  updateProfile: async (data: { name?: string; phone?: string; address?: string; avatar?: string }) => {
    const response = await fetch(`${API_URL}/auth/update-profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authAPI.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update profile");
    }

    return response.json();
  }
};