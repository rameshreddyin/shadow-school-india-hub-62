
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getToken, setToken, removeToken, isTokenValid, setUserData, getUserData } from '@/utils/jwt';
import { toast } from '@/components/ui/use-toast';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status on mount and route change
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      
      try {
        // Check if token exists and is valid
        if (isTokenValid()) {
          // Get user data from storage
          const userData = getUserData();
          if (userData) {
            setUser(userData);
          } else {
            // If no user data but valid token, fetch user data from API
            // For now, we'll just use a mock user
            const mockUser = {
              id: '1',
              name: 'Admin User',
              email: 'admin@school.com',
              role: 'admin'
            };
            setUser(mockUser);
            setUserData(mockUser);
          }
        } else {
          // Token invalid or missing
          setUser(null);
          removeToken();
          
          // Redirect to login if not already there and not at the root path
          if (location.pathname !== '/' && !location.pathname.includes('/login')) {
            navigate('/', { replace: true });
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        removeToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname, navigate]);

  // Mock login function (replace with actual API call)
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful authentication
      if (email === 'admin@school.com' && password === 'password') {
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkFkbWluIFVzZXIiLCJlbWFpbCI6ImFkbWluQHNjaG9vbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjQ3Njc5NjM4MDB9.8MrpH3J8LQ4G5VIq9evsAO_vdho7S5HShDh4RxmcD9Y';
        const mockUser = {
          id: '1',
          name: 'Admin User',
          email: 'admin@school.com',
          role: 'admin'
        };
        
        // Set auth token and user data
        setToken(mockToken);
        setUserData(mockUser);
        setUser(mockUser);
        
        toast({
          title: "Success",
          description: "Login successful"
        });
        
        // Force navigation to dashboard
        navigate('/dashboard', { replace: true });
        return true;
      } else {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    toast({
      title: "Success",
      description: "Logged out successfully"
    });
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      loading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
