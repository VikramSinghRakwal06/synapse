import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaHashtag } from 'react-icons/fa';
import useChatStore from '../../store/useChatStore';
import useAuthStore from '../../store/useAuthStore';

const ChatWindow = ({ socket }) => {
  const [msgInput, setMsgInput] = useState("");
  const { messages, addMessage, setMessages, selectedRoom } = useChatStore();
  const { user } = useAuthStore();
  const bottomRef = useRef(null);

  // 1. Logic to get messages for *specifically* this room
  // If selectedRoom is null, we default to empty array
  const currentRoomMessages = selectedRoom ? (messages[selectedRoom._id] || []) : [];

  // 2. Auto-scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentRoomMessages]);

  // 3. Socket Listeners
  useEffect(() => {
    if (!socket) return;

    // Receive Message
    const handleReceive = (data) => {
        addMessage(data); // Store handles checking if it belongs to this room
    };

    // Receive History (Optional - if your backend emits 'load_history')
    // Ideally, you'd fetch this via API when clicking the room in Sidebar
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
        roomId: selectedRoom._id, // Critical: MongoDB ID
        sender: user.username,
        text: msgInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        id: Date.now().toString() // Temp ID for React Key
    };

    // Optimistic Update (Show it instantly)
    addMessage(msgData); 

    // Send to Server
    await socket.emit("send_message", msgData);
    setMsgInput("");
  };

  if (!selectedRoom) {
      return (
          <div className="flex-1 flex items-center justify-center bg-void text-starlight-dim flex-col">
              <div className="w-16 h-16 rounded-full bg-void-lighter mb-4 flex items-center justify-center">
                  <FaHashtag size={24} />
              </div>
              <p>Select a channel to initialize connection.</p>
          </div>
      );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-void relative min-w-0">
      {/* Header */}
      <div className="h-16 border-b border-white/5 flex items-center px-6 bg-void-light/50 backdrop-blur-md sticky top-0 z-10 shrink-0">
        <FaHashtag className="text-starlight-dim mr-3"/>
        <div>
            <h3 className="text-white font-gaming text-lg tracking-wide">{selectedRoom.name}</h3>
            <p className="text-[10px] text-starlight-dim">{selectedRoom.description || "Welcome to the start of the channel."}</p>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {currentRoomMessages.map((msg, idx) => {
            const isMe = msg.sender === user.username;
            return (
                <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"} group`}>
                    {!isMe && (
                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white mr-3 mt-1 shadow-lg">
                             {msg.sender[0].toUpperCase()}
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
                placeholder={`Message #${selectedRoom.name}`}
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