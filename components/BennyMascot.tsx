import React from 'react';

interface BennyProps {
  mood?: 'happy' | 'thinking' | 'excited' | 'idle';
  message?: string;
}

export const BennyMascot: React.FC<BennyProps> = ({ mood = 'idle', message }) => {
  // Simple SVG construction for Benny
  const getFace = () => {
    switch (mood) {
      case 'thinking':
        return (
          <g>
            <circle cx="35" cy="45" r="5" fill="#333" />
            <circle cx="65" cy="45" r="5" fill="#333" />
            <path d="M 40 75 Q 50 65 60 75" stroke="#333" strokeWidth="3" fill="none" />
            <path d="M 75 30 Q 85 20 90 30" stroke="#333" strokeWidth="3" fill="none" /> {/* Scratching head hand */}
          </g>
        );
      case 'excited':
        return (
          <g>
            <circle cx="35" cy="45" r="5" fill="#333" />
            <circle cx="65" cy="45" r="5" fill="#333" />
            <path d="M 35 70 Q 50 85 65 70" stroke="#333" strokeWidth="3" fill="none" />
            <path d="M 25 40 Q 35 30 45 40" stroke="#333" strokeWidth="2" fill="none" />
            <path d="M 55 40 Q 65 30 75 40" stroke="#333" strokeWidth="2" fill="none" />
          </g>
        );
      default: // Happy/Idle
        return (
          <g>
            <circle cx="35" cy="45" r="5" fill="#333" />
            <circle cx="65" cy="45" r="5" fill="#333" />
            <path d="M 35 70 Q 50 80 65 70" stroke="#333" strokeWidth="3" fill="none" />
          </g>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 transition-all duration-300">
      <div className={`relative w-24 h-24 mb-3 transition-transform duration-300 ${mood === 'thinking' ? 'animate-pulse' : 'animate-bounce-slow'}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          {/* Body/Head */}
          <circle cx="50" cy="50" r="45" fill="#FCD34D" stroke="#F59E0B" strokeWidth="4" />
          {/* Eyes & Mouth */}
          {getFace()}
          {/* Bow tie */}
          <path d="M 40 90 L 60 90 L 65 95 L 35 95 Z" fill="#EF4444" />
        </svg>
      </div>
      {message && (
        <div className="bg-white px-4 py-2 rounded-2xl shadow-md border border-blue-100 max-w-xs text-center relative bubble-pointer">
           <p className="text-sm font-medium text-slate-700">{message}</p>
        </div>
      )}
    </div>
  );
};
