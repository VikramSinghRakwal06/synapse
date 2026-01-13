import {create} from 'zustand';
import api from '../api/axios';
const useChatStore = create((set,get)=>({
    selectedRoom : null,
    messages:{},
    availableRooms:[],
    isLoadingRooms:false,

    fetchRooms:async()=>{
        set({isLoadingRooms:true});
        try {
            const res = await api.get('/api/rooms');
            set({availableRooms:res.data, isLoadingRooms:false});

            if(res.data.length>0 && !get().selectedRoom){
                set({selectedRoom:res.data[0]});
            }
        } catch (error) {
            console.error("Failed to fetch rooms",error);
            set({isLoadingRooms:false});
        }}
        ,
 createRoom: async(name,description="")=>{
    set({isLoading:true});
            try {
                const res=await api.post('/api/rooms',{name, description});
                set((state)=>({availableRooms:[...state.availableRooms,res.data], isLoading:false}));
               
                return {success:true};

            } catch (error) {
                set({isLoading:false});
                return {success:false, error:error.response?.data?.message};
            }
        
    },
    setSelectedRoom: (room)=>{set({selectedRoom: room});},
    
    addMessages:(newItem)=>{
        const {messages}= get();
        const roomId = newItem.roomId;
        const roomMessages = messages[roomId] || [];

        const exists = messages.some((msg)=>msg.id===newItem.id);
        if(exists)return;
        set(
            {
                messages:{
            ...messages,
            [roomId]:[...roomMessages,newItem]
        }});
    },

    setMessages:(roomId,history)=>{
        set((state)=>({
            messages:{
                ...state.messages,
            [roomId]:history
            }
        }));
    }
    
}));

export default useChatStore;