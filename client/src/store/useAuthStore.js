import {create} from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set)=>({
    user : JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token')|| null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    login: async(email, password)=>{
        set({isLoading: true});
        try {
            const res= await api.post('/auth/login',{email,password});
            localStorage.setItem('user',JSON.stringify(res.data));
            localStorage.setItem('token',res.data.token);
            set({user:res.data, token:res.data.token, isAuthenticated:true, isLoading:false});
            return {success:true};
        } catch (error) {
            set({isLoading: false});
            return {success:false, error: error.response?.data?.message || "Login failed"};
        }
    },
    register:async(userName, email, password)=>{
        set({isLoading: true});
        try {
            const res = await api.post('/auth/signup',{userName, email,password});
            localStorage.setItem('token',res.data.token);
            localStorage.setItem('user',JSON.stringify(res.data));
            set({user:res.data, token:res.data.token, isLoading: false, isAuthenticated:true});
            return {success:true};
        } catch (error) {
            set({isLoading:false});
            return {success:false, error:error?.response?.data?.message || "Registration failed"};
        }
    },

    logout:()=>{
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        set({user:null, token:null, isAuthenticated:false});
    }
}))
export default useAuthStore;