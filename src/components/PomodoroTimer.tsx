import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;
const LONG_BREAK_MINUTES = 15;

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(WORK_MINUTES);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSeconds(prev => {
          if (prev === 0) {
            setMinutes(m => {
              if (m === 0) {
                // Timer finished
                handleTimerEnd();
                return 0;
              }
              return m - 1;
            });
            return 59;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleTimerEnd = () => {
    setIsRunning(false);
    if (mode === 'work') {
      const newSessions = sessions + 1;
      setSessions(newSessions);
      const isLongBreak = newSessions % 4 === 0;
      setMode('break');
      setMinutes(isLongBreak ? LONG_BREAK_MINUTES : BREAK_MINUTES);
      setSeconds(0);
    } else {
      setMode('work');
      setMinutes(WORK_MINUTES);
      setSeconds(0);
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setMode('work');
    setMinutes(WORK_MINUTES);
    setSeconds(0);
  };

  const totalSeconds = mode === 'work' ? WORK_MINUTES * 60 : (sessions % 4 === 0 ? LONG_BREAK_MINUTES * 60 : BREAK_MINUTES * 60);
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  return (
    <div className="bg-aurora-surface border border-aurora-border rounded-xl p-4 aurora-border-glow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-aurora-accent pulse-dot' : 'bg-aurora-muted'}`} />
          <span className="text-[11px] font-semibold text-aurora-muted uppercase tracking-wider">
            {mode === 'work' ? '🍅 專注時間' : '☕ 休息時間'}
          </span>
        </div>
        <span className="text-[10px] text-aurora-muted">
          已完成 {sessions} 輪
        </span>
      </div>

      {/* Timer Display */}
      <div className="relative flex items-center justify-center mb-4">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#2d3348" strokeWidth="4" />
          <circle
            cx="50" cy="50" r="42" fill="none"
            stroke={mode === 'work' ? '#00d4ff' : '#2ed573'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 42}`}
            strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute text-center">
          <div className="text-2xl font-mono font-bold text-aurora-text">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={resetTimer}
          className="p-2 rounded-lg bg-aurora-card text-aurora-muted hover:text-aurora-text transition-colors"
          title="重置"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={toggleTimer}
          className={`px-6 py-2 rounded-lg text-xs font-medium transition-all ${
            isRunning
              ? 'bg-aurora-warning/20 text-aurora-warning hover:bg-aurora-warning/30'
              : 'bg-aurora-accent/20 text-aurora-accent hover:bg-aurora-accent/30'
          }`}
        >
          {isRunning ? (
            <span className="flex items-center gap-1.5"><Pause className="w-3.5 h-3.5" />暫停</span>
          ) : (
            <span className="flex items-center gap-1.5"><Play className="w-3.5 h-3.5" />開始</span>
          )}
        </button>
        <button
          onClick={() => { setMode(mode === 'work' ? 'break' : 'work'); setMinutes(mode === 'work' ? BREAK_MINUTES : WORK_MINUTES); setSeconds(0); setIsRunning(false); }}
          className="p-2 rounded-lg bg-aurora-card text-aurora-muted hover:text-aurora-text transition-colors"
          title="切換模式"
        >
          <Coffee className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
