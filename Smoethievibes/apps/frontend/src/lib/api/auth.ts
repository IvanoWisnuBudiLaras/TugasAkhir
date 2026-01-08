export const authAPI = {
  // 1. Tambahkan return type Record<string, string> di sini
  getAuthHeaders: (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  login: async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
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

  register: async (email: string, password: string, name: string) => {
    const response = await fetch("/api/auth/register", {
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

  logout: async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authAPI.getAuthHeaders(), // Sekarang TypeScript akan mengenali ini dengan benar
      },
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    return response.json();
  },

  getMe: async () => {
    const headers = authAPI.getAuthHeaders();
    
    // Jika tidak ada header Authorization, jangan tembak API untuk menghemat traffic
    if (!headers.Authorization) {
       return null; 
    }

    const response = await fetch("/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    if (response.status === 401) {
      return null; // Kembalikan null daripada Error jika hanya masalah auth
    }

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    return response.json();
  },

  verifyOtp: async (email: string, otp: string) => {
    const response = await fetch("/api/auth/verify-otp", {
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

  resendOtp: async (email: string, action: 'LOGIN' | 'REGISTER') => {
    const response = await fetch("/api/auth/resend-otp", {
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
};