import React, { useEffect, useState } from 'react';
import { FaHashtag, FaVideo, FaSignOutAlt, FaPlus, FaTimes, FaSearch } from 'react-icons/fa';
import useChatStore from '../../store/useChatStore';
import useAuthStore from '../../store/useAuthStore';
import { useSocket } from '../../context/SocketContext';

const Sidebar = ({ onStartVideo }) => {
  const { availableRooms, selectedRoom, fetchRooms, setSelectedRoom, createRoom } = useChatStore();
  const { logout, user } = useAuthStore();
  const socket = useSocket();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // ✅ NEW: Search State

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Real-time room updates
  useEffect(() => {
    if (!socket) return;
    const handleNewRoom = () => fetchRooms();
    socket.on('room_created', handleNewRoom);
    return () => socket.off('room_created', handleNewRoom);
  }, [socket, fetchRooms]);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    
    const result = await createRoom(newRoomName);
    if (result.success) {
      setShowCreateModal(false);
      setNewRoomName("");
    } else {
      alert(result.error || "Failed to create room");
    }
  };

  // ✅ NEW: Filter Logic
  const filteredRooms = availableRooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-64 bg-gray-900 border-r border-white/5 flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-wider mb-6">
            SYNAPSE
        </h1>

        {/* ✅ NEW: Search Input */}
        <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-500 text-xs" />
            <input 
                type="text"
                placeholder="Find channel..."
                className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* Room List */}
      <div className="flex-1 px-3 space-y-1 overflow-y-auto">
        <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Channels</p>
            <button onClick={() => setShowCreateModal(true)} className="text-blue-400 hover:text-white transition-colors">
                <FaPlus size={10} />
            </button>
        </div>

        {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
                <button 
                    key={room._id} 
                    onClick={() => setSelectedRoom(room)}
                    className={`w-full flex items-center px-3 py-2 rounded-md transition-all group ${selectedRoom?._id === room._id ? "bg-blue-500/10 text-blue-400" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                >
                    <FaHashtag className={`mr-3 text-xs ${selectedRoom?._id === room._id ? "opacity-100" : "opacity-50 group-hover:opacity-100"}`} />
                    <span className="font-medium truncate">{room.name}</span>
                </button>
            ))
        ) : (
            <p className="text-center text-gray-600 text-xs mt-4 italic">No channels found</p>
        )}
      </div>

      {/* User Footer */}
      <div className="p-4 bg-black/20 border-t border-white/5">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 shrink-0"></div>
                <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{user?.username || user?.userName || "Operator"}</p>
                    <p className="text-[10px] text-green-500">Online</p>
                </div>
            </div>
            <button onClick={logout} className="text-gray-500 hover:text-red-500 transition-colors ml-2">
                <FaSignOutAlt />
            </button>
        </div>
        
        <button 
            onClick={onStartVideo}
            className="w-full py-2 bg-purple-500/20 border border-purple-500/50 text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center font-bold text-sm"
        >
            <FaVideo className="mr-2" /> Start Call
        </button>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-white/10 p-6 rounded-xl w-full max-w-sm shadow-2xl relative">
                <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><FaTimes /></button>
                <h3 className="text-lg font-bold text-white mb-4">Create Channel</h3>
                <form onSubmit={handleCreateRoom}>
                    <input 
                        autoFocus
                        type="text" 
                        placeholder="e.g. gaming-lounge" 
                        className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-blue-500 focus:outline-none mb-4"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-500 transition-colors">
                        Create
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;