import { create } from 'zustand';
import api from '../api/axios';

const useChatStore = create((set, get) => ({
    selectedRoom: null,
    messages: {}, // Structure: { roomId: [msg1, msg2] }
    availableRooms: [],
    isLoadingRooms: false,

    fetchRooms: async () => {
        set({ isLoadingRooms: true });
        try {
            const res = await api.get('/api/rooms');
            set({ availableRooms: res.data, isLoadingRooms: false });

            // Auto-select first room if none selected
            if (res.data.length > 0 && !get().selectedRoom) {
                set({ selectedRoom: res.data[0] });
            }
        } catch (error) {
            console.error("Failed to fetch rooms", error);
            set({ isLoadingRooms: false });
        }
    },

    createRoom: async (name, description = "") => {
        set({ isLoadingRooms: true });
        try {
            const res = await api.post('/api/rooms', { name, description });
            
            // Check if response is valid JSON
            if (res.data && res.data._id) {
                set((state) => ({
                    availableRooms: [...state.availableRooms, res.data],
                    isLoadingRooms: false
                }));
                return { success: true };
            } else {
                throw new Error("Invalid server response");
            }
        } catch (error) {
            set({ isLoadingRooms: false });
            // ✅ FIX: Safely extract error message to prevent "undefined" alert
            const errorMessage = error.response?.data?.message || error.message || "Failed to create room";
            return { success: false, error: errorMessage };
        }
    },

    setSelectedRoom: (room) => { set({ selectedRoom: room }); },

    addMessage: (newItem) => {
        const { messages } = get();
        // Safety check: ensure newItem has a roomId
        if (!newItem || !newItem.roomId) return; 

        const roomId = newItem.roomId;
        const roomMessages = messages[roomId] || [];

        // Check for duplicates
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