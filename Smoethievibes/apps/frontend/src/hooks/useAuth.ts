import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Cek token di localStorage
        const token = localStorage.getItem("access_token") || localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        
        console.log("useAuth checkAuth - token:", !!token, "userData:", !!userData);
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log("User authenticated:", parsedUser.name);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          console.log("User not authenticated");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    
    // Listen untuk perubahan auth status
    window.addEventListener("storage", checkAuth);
    
    // Custom event untuk auth changes
    window.addEventListener("auth-change", checkAuth);
    
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  return { isAuthenticated, isLoading, user };
}