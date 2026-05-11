import React, { useState, useContext, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { AlertContainer } from '../components/AlertContainer';
import { AlertData, AlertType } from '../types';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [alert, setAlert] = useState<AlertData | null>(null);
  
  const addAlert = (title: string, message: string, type: AlertType) => {
    setAlert({ id: Date.now(), title, message, type });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
        addAlert('Invalid Input', 'Please enter both username and password.', 'error');
        return;
    }
    try {
      await login(username, password);
      navigate('/');
    } catch (error: any) {
      const errorMsg = error.response?.data?.errors?.[0]?.msg || 'Login failed. Please check your credentials.';
      addAlert('Login Failed', errorMsg, 'error');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <AlertContainer alert={alert} setAlert={setAlert} />
      <GlassCard className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="p-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-white">Login</h1>
          <div className="mb-4">
            <label className="block text-white/80 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-white/20 rounded-lg bg-black/20 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white/80 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-white/20 rounded-lg bg-black/20 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-500/80 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
          >
            Login
          </button>
          <p className="text-center mt-4 text-white/70">
            Don't have an account? <Link to="/register" className="text-cyan-400 hover:underline">Register here</Link>
          </p>
        </form>
      </GlassCard>
    </div>
  );
};

export default LoginPage;
