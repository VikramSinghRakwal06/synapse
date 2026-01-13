import React from 'react';

const Loader = ({ text = "INITIALIZING..." }) => {
  return (
    /* FULL SCREEN WRAPPER: 
       - fixed inset-0: Covers the whole screen
       - z-[9999]: Stays above everything else
       - bg-void/90: 90% opacity of your custom void color
       - backdrop-blur-sm: Subtle blur for that premium UI feel
    */
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-void/90 backdrop-blur-sm">
      
      {/* The Animation Container */}
      <div className="relative w-20 h-20 mb-6">
        
        {/* Outer Ring (Neon Blue - Fast Spin) */}
        <div className="absolute inset-0 rounded-full border-4 border-t-neon-blue border-r-transparent border-b-neon-blue border-l-transparent animate-spin"></div>
        
        {/* Inner Ring (Neon Purple - Slow Spin Reverse) */}
        <div 
          className="absolute inset-3 rounded-full border-2 border-t-neon-purple border-r-transparent border-b-neon-purple border-l-transparent animate-spin opacity-70" 
          style={{ 
            animationDirection: 'reverse', 
            animationDuration: '2s' 
          }}
        ></div>
        
        {/* Core (Neon Green - Pulse) */}
        {/* Note: I'm using the hex code for green since it wasn't in your original config */}
        <div className="absolute inset-0 m-auto w-4 h-4 bg-[#0AFF60] rounded-full shadow-[0_0_15px_#0AFF60] animate-pulse"></div>
        
        {/* Decorative Radar Sweep (Optional) */}
        <div className="absolute inset-0 rounded-full border border-starlight/5"></div>
      </div>

      {/* The Text Section */}
      <div className="flex flex-col items-center space-y-2">
        <div className="text-neon-blue font-gaming text-sm tracking-[0.3em] animate-pulse">
          {text}
        </div>
        
        {/* Scanning Line Animation */}
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-neon-blue w-1/2 animate-shimmer translate-x-[-100%]"></div>
        </div>
      </div>

      {/* Subtle Bottom Status (Optional) */}
      <div className="absolute bottom-10 font-body text-[10px] text-starlight-dim tracking-widest uppercase opacity-40">
        Synapse Protocol v4.0.0 // Connection Secure
      </div>

    </div>
  );
};

export default Loader;