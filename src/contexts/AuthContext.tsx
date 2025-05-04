
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  user: null,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem('vidya_user');
      const userSession = localStorage.getItem('vidya_session');
      
      if (userStr && userSession) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to parse user data', error);
          localStorage.removeItem('vidya_user');
          localStorage.removeItem('vidya_session');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Auto refresh auth state every 15 minutes to prevent session expiry issues
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(() => {
      const sessionExpiry = localStorage.getItem('vidya_session_expiry');
      
      if (sessionExpiry) {
        const expiryTime = parseInt(sessionExpiry, 10);
        const now = Date.now();
        
        if (now > expiryTime) {
          // Session expired - log user out
          logout();
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          });
        }
      }
    }, 15 * 60 * 1000); // Check every 15 minutes
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call - in production this would be a real API call
    // with proper encryption and authentication
    try {
      // Demo login for testing purposes
      if (email === 'admin@school.com' && password === 'password') {
        const userData: User = {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@school.com',
          role: 'admin',
        };
        
        const sessionExpiry = Date.now() + 8 * 60 * 60 * 1000; // 8 hours
        
        localStorage.setItem('vidya_user', JSON.stringify(userData));
        localStorage.setItem('vidya_session', '1');
        localStorage.setItem('vidya_session_expiry', sessionExpiry.toString());
        
        setUser(userData);
        setIsAuthenticated(true);
        setLoading(false);
        
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login failed', error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('vidya_user');
    localStorage.removeItem('vidya_session');
    localStorage.removeItem('vidya_session_expiry');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
