import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { parseFirebaseError } from '../utils/errorUtils';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/');
    } catch (error) {
      setError(parseFirebaseError(error));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      setError(parseFirebaseError(error));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header title="Sign up" showBackButton />
      
      <div className="px-4 py-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          
          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
          />
          
          <Input
            id="confirm-password"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
          
          <Button
            type="submit"
            fullWidth
            disabled={loading}
          >
            Sign up
          </Button>
        </form>
        
        <div className="my-4 flex items-center">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
          <div className="px-3 text-sm text-gray-500 dark:text-gray-400">or</div>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        
        <Button
          variant="outline"
          fullWidth
          onClick={handleGoogleSignup}
          disabled={loading}
          className="flex items-center justify-center"
        >
          <FaGoogle className="mr-2" />
          Sign up with Google
        </Button>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
          <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;