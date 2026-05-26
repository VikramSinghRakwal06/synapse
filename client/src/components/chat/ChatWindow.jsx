import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaHashtag } from 'react-icons/fa';
import useChatStore from '../../store/useChatStore';
import useAuthStore from '../../store/useAuthStore';
import { useSocket } from '../../context/SocketContext';

const ChatWindow = () => {
  const [msgInput, setMsgInput] = useState("");
  
  // ✅ Get 'isCurrentRoomJoined' and 'confirmJoinRoom' from store
  const { messages, addMessage, setMessages, selectedRoom, isCurrentRoomJoined, confirmJoinRoom } = useChatStore();
  const { user } = useAuthStore();
  const socket = useSocket(); // ✅ Use Hook instead of prop
  const bottomRef = useRef(null);

  // 1. Logic to get messages for *specifically* this room
  const currentRoomMessages = selectedRoom ? (messages[selectedRoom._id] || []) : [];

  // 2. Auto-scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentRoomMessages, isCurrentRoomJoined]); // Scroll when joining too

  // 3. Socket Listeners
  useEffect(() => {
    if (!socket) return;

    // Receive Message
    const handleReceive = (data) => {
        addMessage(data); 
    };

    // Receive History
    const handleHistory = (data) => {
        if(data.roomId) {
            setMessages(data.roomId, data.messages);
        }
    };

    socket.on("receive_message", handleReceive);
    socket.on("room_history", handleHistory);

    return () => {
        socket.off("receive_message", handleReceive);
        socket.off("room_history", handleHistory);
    }
  }, [socket, addMessage, setMessages]);

  // 4. Send Logic
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!msgInput.trim() || !socket || !selectedRoom) return;

    const msgData = {
        roomId: selectedRoom._id, 
        sender: user.username || user.userName, // Handle both casing
        text: msgInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        id: Date.now().toString()
    };

    addMessage(msgData); // Optimistic Update
    await socket.emit("send_message", msgData);
    setMsgInput("");
  };

  // ✅ 5. Join Handler (The "Preview" Logic)
  const handleJoinChannel = () => {
      if (!selectedRoom || !socket) return;
      
      // Emit event to Server
      socket.emit('join_room', selectedRoom._id);
      
      // Update Local Store (Unlocks the UI)
      confirmJoinRoom();
  };

  // -- RENDER STATES --

  // State A: No Room Selected
  if (!selectedRoom) {
      return (
          <div className="flex-1 flex items-center justify-center bg-void text-starlight-dim flex-col">
              <div className="w-16 h-16 rounded-full bg-void-lighter mb-4 flex items-center justify-center border border-white/5">
                  <FaHashtag size={24} className="opacity-50" />
              </div>
              <p className="font-gaming tracking-wide">Select a frequency to initialize connection.</p>
          </div>
      );
  }

  // State B: Preview Mode (Room Selected but Not Joined)
  if (!isCurrentRoomJoined) {
      return (
          <div className="flex-1 flex flex-col items-center justify-center bg-void relative overflow-hidden">
              {/* Background FX */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-blue rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-pulse"></div>

              <div className="z-10 text-center p-8 bg-void-light/30 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl max-w-md w-full">
                  <h2 className="text-3xl font-gaming text-white tracking-widest mb-2">#{selectedRoom.name}</h2>
                  <p className="text-starlight-dim text-sm mb-8">{selectedRoom.description || "Secure encrypted channel."}</p>
                  
                  <div className="text-xs text-neon-blue mb-6 font-mono border border-neon-blue/30 bg-neon-blue/5 p-2 rounded">
                      STATUS: STANDBY // WAITING FOR UPLINK
                  </div>

                  <button 
                      onClick={handleJoinChannel}
                      className="w-full py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-bold font-gaming tracking-wider hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                  >
                      ESTABLISH CONNECTION
                  </button>
              </div>
          </div>
      );
  }

  // State C: Active Chat Interface
  return (
    <div className="flex-1 flex flex-col h-full bg-void relative min-w-0">
      {/* Header */}
      <div className="h-16 border-b border-white/5 flex items-center px-6 bg-void-light/50 backdrop-blur-md sticky top-0 z-10 shrink-0">
        <FaHashtag className="text-neon-blue mr-3"/>
        <div>
            <h3 className="text-white font-gaming text-lg tracking-wide">{selectedRoom.name}</h3>
            <p className="text-[10px] text-green-500 font-mono">● ENCRYPTED CONNECTION ESTABLISHED</p>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {currentRoomMessages.map((msg, idx) => {
            const isMe = msg.sender === (user.username || user.userName);
            return (
                <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    {!isMe && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white mr-3 mt-1 shadow-lg shrink-0">
                              {msg.sender?.[0]?.toUpperCase() || "?"}
                          </div>
                    )}
                    
                    <div className={`max-w-[75%] md:max-w-[60%] rounded-2xl p-4 shadow-md transition-all ${isMe ? "bg-neon-blue/10 border border-neon-blue/30 text-starlight rounded-tr-none" : "bg-void-lighter border border-white/5 text-starlight rounded-tl-none"}`}>
                        <div className="flex items-baseline space-x-2 mb-1">
                            {!isMe && <span className="text-xs font-bold text-neon-purple">{msg.sender}</span>}
                            <span className="text-[10px] opacity-40">{msg.time}</span>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                </div>
            );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-void-light/30 border-t border-white/5 shrink-0">
        <form onSubmit={sendMessage} className="flex items-center bg-void-black/50 rounded-xl border border-white/10 focus-within:border-neon-blue/50 focus-within:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all px-4 py-3">
            <input 
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                placeholder={`Message #${selectedRoom.name}...`}
                className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-starlight-dim/50 font-body"
            />
            <button type="submit" disabled={!msgInput.trim()} className="ml-3 text-neon-blue hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors transform hover:scale-110">
                <FaPaperPlane size={18} />
            </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;