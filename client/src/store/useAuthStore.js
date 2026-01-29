import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            // Note: Ensure your backend login route expects 'email' and 'password'
            const res = await api.post('/api/auth/login', { email, password });
            
            // Safety Check: Backend usually returns { user: {...}, token: "..." }
            // If res.data IS the user object (no nested .user), adjust accordingly.
            const userData = res.data.user || res.data;
            const token = res.data.token;

            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);
            set({ user: userData, token: token, isAuthenticated: true, isLoading: false });
            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.response?.data?.message || "Login failed" };
        }
    },

    loginAsGuest: () => {
        const guestUser = {
            _id: `guest_${Date.now()}`,
            // We use 'username' here too for consistency with your new Schema
            username: `Guest_${Math.floor(Math.random() * 1000)}`,
            email: 'guest@synapse.net',
            isGuest: true
        };
        const guestToken = `GUEST_TOKEN_${Date.now()}`;
        
        localStorage.setItem('user', JSON.stringify(guestUser));
        localStorage.setItem('token', guestToken);
        set({ user: guestUser, token: guestToken, isAuthenticated: true });
    },

    // ✅ FIX IS HERE
    register: async (username, email, password) => {
        set({ isLoading: true });
        try {
            // The argument is 'username' (from Register.js), 
            // but we must ensure the KEY sent to server is also 'username'
            await api.post('/api/auth/signup', { 
                username: username, // <--- Correct Key
                email, 
                password 
            });
            
            set({ isLoading: false });
            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error?.response?.data?.message || "Registration failed" };
        }
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    }
}));

export default useAuthStore;