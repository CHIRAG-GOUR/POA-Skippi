import React from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Camera, 
  Award,
  Users,
  Coins,
  Smile,
  BarChart3
} from 'lucide-react';
import { CameraViewMode, GameStats } from '../../types/game';

interface TopHUDProps {
  stats: GameStats;
  currentObjective: string;
  cameraMode: CameraViewMode;
  onCameraModeChange: (mode: CameraViewMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenPitchSummary?: () => void;
  onOpenBusinessHub?: () => void;
}

export const TopHUD: React.FC<TopHUDProps> = ({
  stats,
  currentObjective,
  cameraMode,
  onCameraModeChange,
  soundEnabled,
  onToggleSound,
  isFullscreen,
  onToggleFullscreen,
  onOpenBusinessHub
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none p-2 sm:p-3 flex flex-col gap-1.5">
      {/* Upper Row: Brand Bar & Status Chips */}
      <div className="flex items-center justify-between gap-2">
        {/* Skippi Brand Badge */}
        <div className="pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-md border-2 border-amber-300">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 via-amber-400 to-sky-400 flex items-center justify-center text-base shadow-xs animate-wiggle">
            🍧
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-display font-black text-rose-600 tracking-wide text-base leading-none">
                SKIPPI
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-full border border-rose-200 font-display">
                Shark Tank
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 leading-tight font-body">
              Garden Simulator
            </p>
          </div>
        </div>

        {/* Live Counters & Strategy Hub */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {/* Revenue */}
          <div className="pointer-events-auto flex items-center gap-1 bg-emerald-500 text-white px-2.5 py-1 rounded-xl shadow-xs font-display font-black text-xs">
            <Coins className="w-3.5 h-3.5 text-amber-200" />
            <span>₹{stats.revenue}</span>
          </div>

          {/* Customers Served */}
          <div className="pointer-events-auto flex items-center gap-1 bg-sky-500 text-white px-2.5 py-1 rounded-xl shadow-xs font-display font-black text-xs">
            <Users className="w-3.5 h-3.5 text-sky-200" />
            <span>{stats.customersServed}/5</span>
          </div>

          {/* Satisfaction Meter */}
          <div className="pointer-events-auto flex items-center gap-1 bg-amber-500 text-white px-2.5 py-1 rounded-xl shadow-xs font-display font-black text-xs">
            <Smile className="w-3.5 h-3.5 text-amber-100" />
            <span>{Math.round(stats.satisfactionScore)}%</span>
          </div>

          {/* XP */}
          <div className="pointer-events-auto hidden sm:flex items-center gap-1 bg-purple-500 text-white px-2.5 py-1 rounded-xl shadow-xs font-display font-black text-xs">
            <Award className="w-3.5 h-3.5 text-purple-200" />
            <span>{stats.xp} XP</span>
          </div>

          {/* Strategy Hub Action */}
          {onOpenBusinessHub && (
            <button
              onClick={onOpenBusinessHub}
              className="pointer-events-auto flex items-center gap-1 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white px-2.5 py-1 rounded-xl shadow-xs font-display font-black text-xs active:scale-95 transition cursor-pointer"
              title="Open Skippi Strategy & Shark Tank Hub"
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-200" />
              <span className="hidden md:inline">Strategy Hub</span>
            </button>
          )}
        </div>

        {/* Controls: Camera Mode, Audio, Fullscreen */}
        <div className="pointer-events-auto flex items-center gap-1">
          {/* Camera View Switcher */}
          <button
            onClick={() => onCameraModeChange(cameraMode === 'stall_counter' ? 'isometric' : 'stall_counter')}
            className={`px-2 py-1 rounded-xl text-xs font-display font-black transition flex items-center gap-1 cursor-pointer border ${
              cameraMode === 'stall_counter'
                ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                : 'bg-white/90 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Toggle Camera View"
          >
            <Camera className="w-3 h-3" />
            <span className="hidden lg:inline">
              {cameraMode === 'stall_counter' ? 'Stall' : 'Garden'}
            </span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={onToggleSound}
            className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition cursor-pointer"
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={onToggleFullscreen}
            className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-slate-700" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-slate-700" />
            )}
          </button>
        </div>
      </div>

      {/* Lower Row: Mission / Objective Banner */}
      <div className="self-center max-w-md w-full">
        <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl shadow-lg border border-slate-700/50 flex items-center gap-1.5 text-[11px] font-body">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 animate-pulse" />
          <span className="font-extrabold text-amber-400 font-display shrink-0">Mission:</span>
          <span className="font-bold text-slate-200 truncate">{currentObjective}</span>
        </div>
      </div>
    </header>
  );
};
