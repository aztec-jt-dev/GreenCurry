
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { User } from '../types';

interface AdminLoginPageProps {
  onLogin: (u: User) => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await api.login({ username, password });
      onLogin(user);
      navigate('/admin');
    } catch (err) {
      setError('Invalid credentials.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-3xl shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black mb-2"><span className="text-gc-green">ADMIN</span> PANEL</h1>
          <p className="opacity-40 text-sm">Restricted staff access only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold mb-2 opacity-60 uppercase">Username</label>
            <input 
              required
              type="text" 
              className="w-full bg-white/5 border border-white/20 rounded-xl p-4 outline-none focus:border-gc-green"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-2 opacity-60 uppercase">Password</label>
            <input 
              required
              type="password" 
              className="w-full bg-white/5 border border-white/20 rounded-xl p-4 outline-none focus:border-gc-green"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-gc-red text-xs font-bold text-center">{error}</p>}
          <button className="w-full bg-gc-green text-gc-dark py-4 rounded-xl font-bold hover:scale-[1.02] transition">
            LOGIN TO SYSTEM
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
