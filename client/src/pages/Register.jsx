import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Register = () => {
    // 1. Grab login action too for auto-login
    const { register, login, isLoading } = useAuthStore();
    const navigate = useNavigate();

    // ✅ FIX 1: Change 'userName' to 'username' (lowercase) to match Backend
    const [formData, setFormData] = useState({
        username: '', 
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // ✅ FIX 1: Pass 'username' correctly
        const result = await register(formData.username, formData.email, formData.password);
        
        if (result.success) {
            // Auto-login after success
            await login(formData.email, formData.password);
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 bg-grid-pattern flex items-center justify-center relative overflow-hidden">
            
            {/* Background Ambience (Standard Colors) */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-green-500 rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-pulse"></div>

            <div className="relative z-10 w-full max-w-md p-8 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 tracking-widest uppercase">
                        New Operator
                    </h1>
                    <p className="text-gray-400 mt-2 text-xs">Create your Synapse Identity</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-xs text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-green-400 mb-1 tracking-wider">ALIAS (USERNAME)</label>
                        <input 
                            type="text" 
                            required
                            className="w-full bg-gray-800/50 border border-white/5 text-white p-3 rounded-lg focus:outline-none focus:border-green-400 transition-all"
                            placeholder="Neon_Rider"
                            value={formData.username}
                            // ✅ FIX 1: Update 'username'
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-blue-400 mb-1 tracking-wider">LINK (EMAIL)</label>
                        <input 
                            type="email" 
                            required
                            className="w-full bg-gray-800/50 border border-white/5 text-white p-3 rounded-lg focus:outline-none focus:border-blue-400 transition-all"
                            placeholder="user@synapse.net"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-purple-400 mb-1 tracking-wider">KEY (PASSWORD)</label>
                        <input 
                            type="password" 
                            required
                            className="w-full bg-gray-800/50 border border-white/5 text-white p-3 rounded-lg focus:outline-none focus:border-purple-400 transition-all"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    {/* ✅ FIX 2: Replaced custom colors with standard Tailwind colors (green-400, blue-600) so it is VISIBLE */}
                    <button 
                        disabled={isLoading}
                        className="w-full py-3 mt-4 bg-gradient-to-r from-green-400 to-blue-600 rounded-lg font-bold tracking-wide text-white hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
                    >
                        {isLoading ? "INITIALIZING..." : "INITIATE SEQUENCE"}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-xs mt-6">
                    Already have an ID? <Link to="/login" className="text-blue-400 hover:underline">Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;