
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Check for lockout status
  useEffect(() => {
    const storedLockout = localStorage.getItem('login_lockout');
    const storedAttempts = localStorage.getItem('login_attempts');
    
    if (storedLockout) {
      const lockout = parseInt(storedLockout, 10);
      if (lockout > Date.now()) {
        setLockoutTime(lockout);
      } else {
        localStorage.removeItem('login_lockout');
      }
    }
    
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts, 10));
    }
    
    // Clear lockout timer when it expires
    if (lockoutTime) {
      const timer = setTimeout(() => {
        if (Date.now() > lockoutTime) {
          setLockoutTime(null);
          localStorage.removeItem('login_lockout');
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [lockoutTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if account is locked
    if (lockoutTime && lockoutTime > Date.now()) {
      const remainingTime = Math.ceil((lockoutTime - Date.now()) / 1000 / 60);
      toast({
        title: "Account Temporarily Locked",
        description: `Too many failed attempts. Please try again in ${remainingTime} minutes.`,
        variant: "destructive",
      });
      return;
    }
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        // Reset login attempts on successful login
        setLoginAttempts(0);
        localStorage.removeItem('login_attempts');
        localStorage.removeItem('login_lockout');
        
        toast({
          title: "Success",
          description: "Login successful!",
        });
        
        navigate('/dashboard');
      } else {
        // Handle failed login - increment attempt counter
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('login_attempts', newAttempts.toString());
        
        // Lock account after 5 failed attempts
        if (newAttempts >= 5) {
          const lockoutDuration = 15 * 60 * 1000; // 15 minutes
          const lockoutUntil = Date.now() + lockoutDuration;
          
          setLockoutTime(lockoutUntil);
          localStorage.setItem('login_lockout', lockoutUntil.toString());
          
          toast({
            title: "Account Temporarily Locked",
            description: "Too many failed attempts. Please try again in 15 minutes.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Authentication Error",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const remainingAttempts = 5 - loginAttempts;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-medium">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Vidya SMS</h1>
          <h2 className="text-xl font-semibold mt-2">School Management System</h2>
          <p className="text-gray-500 mt-2">Sign in to access your dashboard</p>
        </div>
        
        {lockoutTime && lockoutTime > Date.now() && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="text-red-800 font-medium">Account Temporarily Locked</h3>
            </div>
            <p className="text-sm text-red-700 mt-1">
              Too many failed login attempts. Please try again in {Math.ceil((lockoutTime - Date.now()) / 1000 / 60)} minutes.
            </p>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@school.com"
                className="mt-1"
                autoComplete="email"
                disabled={lockoutTime !== null && lockoutTime > Date.now()}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
                autoComplete="current-password"
                disabled={lockoutTime !== null && lockoutTime > Date.now()}
                required
              />
            </div>
          </div>
          
          <div className="text-right">
            <a
              href="#"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Forgot your password?
            </a>
          </div>
          
          {!lockoutTime && loginAttempts > 0 && loginAttempts < 5 && (
            <div className="text-sm text-amber-600">
              <Shield className="inline-block w-4 h-4 mr-1" />
              {remainingAttempts} login {remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || (lockoutTime !== null && lockoutTime > Date.now())}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Demo credentials:</p>
          <p>Email: admin@school.com</p>
          <p>Password: password</p>
        </div>
      </div>
      
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Vidya School Management System</p>
        <p>Version 1.0.0 | Secure Login</p>
      </div>
    </div>
  );
};

export default LoginPage;
