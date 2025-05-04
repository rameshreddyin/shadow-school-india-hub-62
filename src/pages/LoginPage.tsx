
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate login - in a real app, this would be an API call
    setTimeout(() => {
      // Demo credentials for easy testing
      if (email === 'admin@school.com' && password === 'password') {
        toast({
          title: "Success",
          description: "Login successful!",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Authentication Error",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-medium">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Vidya SMS</h1>
          <h2 className="text-xl font-semibold mt-2">School Management System</h2>
          <p className="text-gray-500 mt-2">Sign in to access your dashboard</p>
        </div>
        
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
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
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
    </div>
  );
};

export default LoginPage;
