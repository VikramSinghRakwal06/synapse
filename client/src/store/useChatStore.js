import { create } from 'zustand';
import api from '../api/axios';

const useChatStore = create((set, get) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    selectedRoom: null,
    isCurrentRoomJoined: false, 
    
    availableRooms: [],
    messages: {}, 
    isLoadingRooms: false,
    isUsersLoading: false,

    // Fetch Rooms
    fetchRooms: async () => {
        set({ isLoadingRooms: true });
        try {
            const res = await api.get('/api/rooms');
            set({ availableRooms: res.data, isLoadingRooms: false });
            // NOTE: Auto-select removed to prevent forced joining
        } catch (error) {
            console.error("Failed to fetch rooms", error);
            set({ isLoadingRooms: false });
        }
    },

    // Create Room
    createRoom: async (name, description = "") => {
        set({ isUsersLoading: true });
        try {
            const res = await api.post('/api/rooms', { name, description });
            
            if (res.data && res.data._id) {
                set((state) => ({
                    availableRooms: [...state.availableRooms, res.data],
                    isUsersLoading: false
                }));
                return { success: true };
            } else {
                throw new Error("Invalid server response");
            }
        } catch (error) {
            set({ isUsersLoading: false });
            const errorMessage = error.response?.data?.message || error.message || "Failed to create room";
            return { success: false, error: errorMessage };
        }
    },

    // ✅ Selection Logic (Resets 'Joined' status)
    setSelectedRoom: (room) => { 
        set({ 
            selectedRoom: room, 
            isCurrentRoomJoined: false // Always start in "Preview Mode"
        }); 
    },

    // ✅ Join Action (Updates UI to show chat)
    confirmJoinRoom: () => {
        set({ isCurrentRoomJoined: true });
    },

    // Message Logic
    addMessage: (newItem) => {
        const { messages } = get();
        if (!newItem || !newItem.roomId) return; 

        const roomId = newItem.roomId;
        const roomMessages = messages[roomId] || [];

        const exists = roomMessages.some((msg) => msg.id === newItem.id || msg._id === newItem._id);
        if (exists) return;

        set({
            messages: {
                ...messages,
                [roomId]: [...roomMessages, newItem]
            }
        });
    },

    setMessages: (roomId, history) => {
        set((state) => ({
            messages: {
                ...state.messages,
                [roomId]: history
            }
        }));
    }
}));

export default useChatStore;