import React, { useEffect, useState } from 'react';

export const OpeningAnimation: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [startBlast, setStartBlast] = useState(false);

  useEffect(() => {
    // Start blast sequence after 1.8 seconds (giving time to read text)
    const blastTimer = setTimeout(() => {
      setStartBlast(true);
    }, 1800);

    // Remove component completely after animation finishes
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2600); // 1800 + 800ms for blast

    return () => {
      clearTimeout(blastTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-20 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDuration: `${Math.random() * 3 + 1.5}s`,
              animationDelay: `${Math.random() * 1}s`
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className={`relative z-10 flex flex-col items-center justify-center transition-all duration-300 ${startBlast ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
        
        {/* Glowing Text */}
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-widest text-center animate-fade-in-up drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          AHMED
          <br />
          <span className="text-2xl md:text-3xl font-light text-slate-300 mt-2 block tracking-[0.3em]">
            BUSINESS ADVISOR
          </span>
        </h1>

        {/* Futuristic Line Decoration */}
        <div className="mt-8 flex items-center space-x-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
           <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white"></div>
           <div className="h-1 w-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
           <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white"></div>
        </div>
      </div>

      {/* Blast Effect Overlay */}
      {startBlast && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Central Energy Ball Expanding */}
          <div className="w-1 h-1 bg-white rounded-full animate-energy-blast box-shadow-[0_0_50px_20px_white]"></div>
          
          {/* Full Screen Flash */}
          <div className="absolute inset-0 bg-white animate-flash-fade mix-blend-overlay"></div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); filter: blur(10px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes energy-blast {
          0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.8); }
          50% { opacity: 1; }
          100% { transform: scale(300); opacity: 0; box-shadow: 0 0 100px 50px rgba(255, 255, 255, 0); }
        }
        .animate-energy-blast {
          animation: energy-blast 0.8s cubic-bezier(0.1, 0, 0, 1) forwards;
        }

        @keyframes flash-fade {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-flash-fade {
          animation: flash-fade 0.9s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
