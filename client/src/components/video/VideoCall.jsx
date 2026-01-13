import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { 
  FaPhoneSlash, 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaVideo, 
  FaVideoSlash,
  FaExpand 
} from 'react-icons/fa';
import useAuthStore from '../../store/useAuthStore';
import useChatStore from '../../store/useChatStore';

const VideoCall = ({ socket, room, onClose }) => {
  const { user } = useAuthStore();
  const { selectedRoom } = useChatStore();

  // --- STATE ---
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);
  const [callerName, setCallerName] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [callerId, setCallerId] = useState("");
  
  // Controls State
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  // --- REFS ---
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    // 1. Initialize Media (Camera/Mic)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch(err => console.error("Failed to get media:", err));

    // 2. Listen for Incoming Calls
    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCallerId(data.from);
      setCallerName(data.name);
      setCallerSignal(data.signal);
    });

    return () => {
      socket.off("callUser");
    };
  }, [socket]);


  const callRoom = () => {
   
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
     
      socket.emit("callUser", {
        userToCall: selectedRoom._id, 
        signalData: data,
        from: socket.id,
        name: user.username,
      });
    });

    peer.on("stream", (currentStream) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  // B. Answer Call
  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: callerId });
    });

    peer.on("stream", (currentStream) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  // C. End Call
  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) connectionRef.current.destroy();
    
    // Stop webcam light
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  // D. Toggles
  const toggleMic = () => {
    if(stream) {
        stream.getAudioTracks()[0].enabled = !micOn;
        setMicOn(!micOn);
    }
  }

  const toggleCam = () => {
    if(stream) {
        stream.getVideoTracks()[0].enabled = !camOn;
        setCamOn(!camOn);
    }
  }

  return (
    <div className="fixed inset-0 bg-void/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      
      {/* HEADER */}
      <div className="absolute top-6 left-6 flex items-center space-x-2">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-white font-gaming tracking-widest text-sm">LIVE FEED // {room?.name || "CHANNEL"}</span>
      </div>

      {/* VIDEO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl h-[60vh]">
        
        {/* 1. My Video */}
        <div className="relative bg-void-black rounded-2xl overflow-hidden border-2 border-neon-blue shadow-[0_0_15px_rgba(0,240,255,0.3)] group">
          <video playsInline muted ref={myVideo} autoPlay className="w-full h-full object-cover transform scale-x-[-1]" />
          
          <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-lg backdrop-blur-md">
            <span className="text-neon-blue font-bold text-sm">YOU {micOn ? '' : '(MUTED)'}</span>
          </div>
          
          {/* Overlay when cam is off */}
          {!camOn && (
            <div className="absolute inset-0 bg-void-light flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-void-lighter flex items-center justify-center border border-white/10">
                    <span className="text-2xl font-bold text-starlight">YOU</span>
                </div>
            </div>
          )}
        </div>

        {/* 2. Remote Video */}
        <div className="relative bg-void-black rounded-2xl overflow-hidden border-2 border-neon-purple shadow-[0_0_15px_rgba(188,19,254,0.3)]">
          {callAccepted && !callEnded ? (
            <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-starlight-dim space-y-4">
               {receivingCall ? (
                   <div className="text-center animate-bounce">
                       <div className="w-24 h-24 rounded-full bg-neon-green/20 flex items-center justify-center mb-4 mx-auto border border-neon-green">
                            <FaVideo size={30} className="text-neon-green"/>
                       </div>
                       <h3 className="text-xl text-white font-bold">{callerName} is calling...</h3>
                   </div>
               ) : (
                   <div className="text-center">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 mx-auto"></div>
                        <p>Waiting for connection...</p>
                   </div>
               )}
            </div>
          )}

          {callAccepted && !callEnded && (
              <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-lg backdrop-blur-md">
                <span className="text-neon-purple font-bold text-sm">{callerName || "REMOTE USER"}</span>
              </div>
          )}
        </div>
      </div>

      {/* CONTROLS BAR */}
      <div className="mt-8 flex items-center space-x-6 bg-void-light px-8 py-4 rounded-full border border-white/10 shadow-2xl">
        
        {/* Toggle Mic */}
        <button 
            onClick={toggleMic} 
            className={`p-4 rounded-full transition-all duration-300 ${micOn ? 'bg-void-lighter hover:bg-neon-blue/20 text-white' : 'bg-red-500/20 text-red-500 border border-red-500'}`}
        >
            {micOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
        </button>

        {/* Toggle Cam */}
        <button 
            onClick={toggleCam} 
            className={`p-4 rounded-full transition-all duration-300 ${camOn ? 'bg-void-lighter hover:bg-neon-blue/20 text-white' : 'bg-red-500/20 text-red-500 border border-red-500'}`}
        >
            {camOn ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
        </button>

        {/* Answer / End Actions */}
        {receivingCall && !callAccepted ? (
            <button 
                onClick={answerCall} 
                className="bg-neon-green hover:bg-green-400 text-black px-8 py-3 rounded-full font-bold font-gaming transition-all shadow-[0_0_15px_rgba(10,255,96,0.4)]"
            >
                ANSWER LINK
            </button>
        ) : (
             // Only show Call button if not already in a call
            !callAccepted && (
                <button 
                    onClick={callRoom} 
                    className="bg-neon-blue hover:bg-blue-400 text-black px-8 py-3 rounded-full font-bold font-gaming transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                >
                    INITIATE CALL
                </button>
            )
        )}

        {/* End Call (Always visible) */}
        <button 
            onClick={leaveCall} 
            className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transition-all shadow-lg"
        >
            <FaPhoneSlash size={20} />
        </button>

      </div>
    </div>
  );
};

export default VideoCall;