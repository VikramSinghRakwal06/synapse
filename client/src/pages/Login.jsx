import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Login = () => {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Call Store Action
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/'); // Go to Dashboard
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-void bg-grid-pattern flex items-center justify-center relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-neon-purple rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-neon-blue rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-void-light/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-gaming text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple tracking-widest uppercase">
            Synapse
          </h1>
          <p className="text-starlight-dim mt-2 text-sm">Initialize Neural Connection</p>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-xs text-center font-bold">
            ! ERROR: {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-gaming text-neon-blue mb-2 tracking-wider">CODENAME (EMAIL)</label>
            <input 
              type="email" 
              required
              className="w-full bg-void-lighter/50 border border-white/5 text-white p-3 rounded-lg focus:outline-none focus:border-neon-blue focus:shadow-neon-blue transition-all duration-300 placeholder-white/20"
              placeholder="operator@synapse.net"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-gaming text-neon-purple mb-2 tracking-wider">ACCESS KEY (PASSWORD)</label>
            <input 
              type="password" 
              required
              className="w-full bg-void-lighter/50 border border-white/5 text-white p-3 rounded-lg focus:outline-none focus:border-neon-purple focus:shadow-neon-purple transition-all duration-300 placeholder-white/20"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            disabled={isLoading}
            className="w-full py-3 mt-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg font-bold font-gaming tracking-wide text-white hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "ESTABLISHING LINK..." : "CONNECT TO SERVER"}
          </button>
        </form>

        <p className="text-center text-starlight-dim text-xs mt-6">
          New Operator? <Link to="/register" className="text-neon-blue hover:underline">Establish Link</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;