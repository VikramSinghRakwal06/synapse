import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import useAuthStore from '../store/useAuthstore';
const Register = () => {
    const {register, isLoading} = useAuthStore();
    const [formData, setFormData]= useState({userName: '', email:'',password:''});
    const [error, setError]= useState('');

    const navigate = useNavigate();
   const handleSubmit = async(e)=>{
    e.preventDefault();
    setError('');
    const result = await register(formData.userName, formData.email, formData.password);
    if(result.success){
        navigate('/');
    }else{
        setError(result.error);
    }
   }
  return (
  <div className="min-h-screen bg-void bg-grid-pattern flex items-center justify-center relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-neon-green rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-neon-blue rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-pulse"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-void-light/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-gaming text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue tracking-widest uppercase">
            New Operator
          </h1>
          <p className="text-starlight-dim mt-2 text-xs">Create your Synapse Identity</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-gaming text-neon-green mb-1 tracking-wider">ALIAS (userName)</label>
            <input 
              type="text" 
              required
              className="w-full bg-void-lighter/50 border border-white/5 text-white p-3 rounded-lg focus:outline-none focus:border-neon-green transition-all"
              placeholder="Neon_Rider"
              value={formData.userName}
              onChange={(e) => setFormData({...formData, userName: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-gaming text-neon-blue mb-1 tracking-wider">LINK (EMAIL)</label>
            <input 
              type="email" 
              required
              className="w-full bg-void-lighter/50 border border-white/5 text-white p-3 rounded-lg focus:outline-none focus:border-neon-blue transition-all"
              placeholder="user@synapse.net"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-gaming text-neon-purple mb-1 tracking-wider">KEY (PASSWORD)</label>
            <input 
              type="password" 
              required
              className="w-full bg-void-lighter/50 border border-white/5 text-white p-3 rounded-lg focus:outline-none focus:border-neon-purple transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            disabled={isLoading}
            className="w-full py-3 mt-4 bg-gradient-to-r from-neon-green to-neon-blue rounded-lg font-bold font-gaming tracking-wide text-void hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
          >
            {isLoading ? "INITIALIZING..." : "INITIATE SEQUENCE"}
          </button>
        </form>

        <p className="text-center text-starlight-dim text-xs mt-6">
          Already have an ID? <Link to="/login" className="text-neon-blue hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
