import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * AmbientSoundController:
 * Synthesizes peaceful Vietnamese pentatonic chimes (Hò - Xự - Xang - Xê - Cống)
 * using the Web Audio API with zero external media files.
 * Default is muted.
 */
export const AmbientSoundController: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Traditional Vietnamese pentatonic scale frequencies (Hz):
  // C4, D4, F4, G4, A4, C5, D5
  const pentatonicScale = [261.63, 293.66, 349.23, 392.0, 440.0, 523.25, 587.33];

  const playPentatonicChime = (ctx: AudioContext) => {
    try {
      const now = ctx.currentTime;
      // Pick 1 or 2 harmonious notes
      const freq1 = pentatonicScale[Math.floor(Math.random() * pentatonicScale.length)];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Soft sine wave with warm harmonic
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq1, now);

      // Gentle bell envelope: quick attack, long gentle release
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.035, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 3.3);
    } catch {
      // Ignore audio glitches if browser suspends context
    }
  };

  const toggleSound = () => {
    if (!isPlaying) {
      // Start
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      const ctx = audioCtxRef.current || new AudioCtxClass();
      audioCtxRef.current = ctx;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Play immediate note
      playPentatonicChime(ctx);

      // Play subsequent notes gently
      intervalRef.current = window.setInterval(() => {
        playPentatonicChime(ctx);
      }, 4200);

      setIsPlaying(true);
    } else {
      // Stop
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-40 select-none">
      <button
        type="button"
        onClick={toggleSound}
        title={isPlaying ? 'Tắt âm hưởng cổ phong' : 'Bật âm hưởng cổ phong (Đàn tranh & chuông)'}
        className={`px-3 py-2 flex items-center gap-2 border text-xs font-semibold uppercase tracking-wider backdrop-blur-md transition-all duration-300 shadow-xl ${
          isPlaying
            ? 'bg-[#181E29]/95 border-imperial-gold text-imperial-gold shadow-gold-glow'
            : 'bg-[#0E131B]/80 border-lacquer-border/80 text-silk-muted hover:text-silk-ivory hover:border-imperial-gold/50'
        }`}
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-4 h-4 text-imperial-gold animate-pulse" />
            <span className="hidden sm:inline">Âm hưởng Cổ phong</span>
            <span className="flex gap-0.5 items-end h-3">
              <span className="w-0.5 h-2 bg-imperial-gold animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-0.5 h-3 bg-imperial-gold animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-0.5 h-1.5 bg-imperial-gold animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4" />
            <span className="hidden sm:inline">Không gian âm thanh</span>
          </>
        )}
      </button>
    </div>
  );
};
