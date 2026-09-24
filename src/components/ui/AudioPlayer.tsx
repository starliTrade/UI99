/**
 * UI99 — AudioPlayer Component
 * Velvet waveform audio player with timecode, scrubbable progress, volume, and playback controls.
 */

import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw, Music } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AudioPlayerProps {
  title?: string;
  artist?: string;
  durationSec?: number;
  className?: string;
}

export function AudioPlayer({
  title = 'Obsidian Ambient Frequency',
  artist = 'UI99 Soundscapes',
  durationSec = 184,
  className,
}: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(42);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(80);

  useEffect(() => {
    let timer: any;
    if (playing) {
      timer = setInterval(() => {
        setCurrentTime((prev) => (prev >= durationSec ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [playing, durationSec]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPct = (currentTime / durationSec) * 100;

  // Waveform bars simulation
  const bars = [
    30, 45, 60, 35, 75, 90, 60, 40, 55, 80, 100, 70, 50, 65, 85, 95, 60, 40, 70, 85,
    50, 35, 60, 80, 100, 75, 45, 65, 80, 50, 40, 70, 90, 65, 45, 30, 55, 75, 85, 60,
  ];

  return (
    <div
      className={cn(
        'p-4 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.06] dark:border-white/[0.04]',
        'shadow-[0_16px_36px_-8px_rgba(0,0,0,0.5)] flex flex-col gap-3 w-full max-w-md',
        className
      )}
    >
      {/* Title & Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
              {title}
            </h5>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              {artist}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-zinc-400">
          {formatTime(currentTime)} / {formatTime(durationSec)}
        </span>
      </div>

      {/* Simulated Waveform Visualization */}
      <div
        className="flex items-end justify-between h-10 gap-1 px-1 cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const newPct = clickX / rect.width;
          setCurrentTime(Math.floor(newPct * durationSec));
        }}
      >
        {bars.map((barHeight, idx) => {
          const barPct = (idx / bars.length) * 100;
          const isPassed = barPct <= progressPct;

          return (
            <div
              key={idx}
              className={cn(
                'flex-1 rounded-full transition-all duration-150',
                isPassed
                  ? 'bg-zinc-900 dark:bg-emerald-400'
                  : 'bg-zinc-200 dark:bg-white/[0.08]'
              )}
              style={{ height: `${barHeight}%` }}
            />
          );
        })}
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between pt-1 border-t border-black/[0.04] dark:border-white/[0.03]">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentTime((prev) => Math.max(0, prev - 10))}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            title="Rewind 10s"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setPlaying(!playing)}
            className="w-9 h-9 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center shadow-md active:scale-95 transition-transform"
          >
            {playing ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={() => setCurrentTime((prev) => Math.min(durationSec, prev + 10))}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            title="Forward 10s"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMuted(!muted)}
            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={muted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              if (muted) setMuted(false);
            }}
            className="w-16 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-white"
          />
        </div>
      </div>
    </div>
  );
}
