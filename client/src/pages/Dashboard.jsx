import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import VideoCall from '../components/video/VideoCall';
import { useSocket } from '../context/SocketContext';
import useChatStore from '../store/useChatStore';

const Dashboard = () => {
  const socket = useSocket();
  const { selectedRoom } = useChatStore();
  const [showVideo, setShowVideo] = useState(false);

  // Join Room logic
  useEffect(() => {
    if (socket && selectedRoom) {
      // 1. Join the new room
      socket.emit("join_room", selectedRoom._id);
      
      // 2. Optional: Ask for history (if backend supports it)
      // socket.emit("fetch_history", selectedRoom._id);
    }
  }, [socket, selectedRoom]);

  if (!socket) return (
    <div className="h-screen w-screen bg-void flex items-center justify-center flex-col">
        <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-neon-blue font-gaming animate-pulse">Initializing Synapse Protocol...</div>
    </div>
  );

  return (
    <div className="h-screen w-screen bg-void flex overflow-hidden">
      <Sidebar onStartVideo={() => setShowVideo(true)} />
      
      <ChatWindow socket={socket} />

      {showVideo && (
        <VideoCall 
            socket={socket} 
            room={selectedRoom} 
            onClose={() => setShowVideo(false)} 
        />
      )}
    </div>
  );
};

export default Dashboard;