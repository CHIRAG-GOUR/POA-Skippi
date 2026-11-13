import React, { useState, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';

export const ControlsGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // Auto-minimize after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-3 left-3 z-40 bg-white/95 backdrop-blur-md text-slate-700 w-8 h-8 rounded-full shadow-md border-2 border-amber-300 flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer"
        title="View Camera Controls"
      >
        <HelpCircle className="w-4 h-4 text-amber-500" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-3 left-3 z-40 max-w-[220px] bg-white/95 backdrop-blur-md border-2 border-amber-300 rounded-2xl p-2.5 shadow-xl text-slate-800 animate-pop-in flex flex-col gap-1.5">
      <div className="flex items-center justify-between border-b border-amber-100 pb-1">
        <div className="flex items-center gap-1 font-display font-extrabold text-[11px] text-rose-600">
          <span>🎮 Camera Tips</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-1 text-[10px] font-bold text-slate-600 font-body">
        <div className="flex items-center gap-1.5">
          <span>👆 <strong>Drag</strong></span>
          <span className="text-slate-500">to look around</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>🔍 <strong>Scroll</strong></span>
          <span className="text-slate-500">to zoom in</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>🍧 <strong>Tap Stall</strong></span>
          <span className="text-slate-500">to focus counter</span>
        </div>
      </div>
    </div>
  );
};
