import { useEffect, useRef, useState } from 'react';
import { Dream } from '../lib/supabase';

interface ImmersiveDreamVideoProps {
  dream: Dream;
  onEdit?: () => void;
}

export function ImmersiveDreamVideo({ dream, onEdit }: ImmersiveDreamVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'exhale'>('inhale');

  useEffect(() => {
    const breathingInterval = setInterval(() => {
      setBreathingPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale');
    }, 4000);

    return () => clearInterval(breathingInterval);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error('Video autoplay failed:', err);
      });
    }
  }, [dream.video_url]);

  return (
    <div
      className="relative w-full h-screen overflow-hidden group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {dream.video_url && (
        <video
          ref={videoRef}
          src={dream.video_url}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out ${
            isHovering ? 'scale-105 brightness-110' : 'scale-100 brightness-100'
          }`}
          loop
          muted
          playsInline
          autoPlay
        />
      )}

      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)',
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
        <div
          className={`transition-all duration-1000 ${
            isHovering ? 'scale-110 opacity-100' : 'scale-100 opacity-90'
          }`}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-4 drop-shadow-2xl">
            {dream.title}
          </h1>
          <p className="text-xl md:text-2xl text-center text-white/90 drop-shadow-lg">
            Your dream is within reach
          </p>
        </div>

        {isHovering && (
          <div
            className={`mt-12 transition-all duration-[4000ms] ease-in-out ${
              breathingPhase === 'inhale' ? 'scale-110 opacity-100' : 'scale-100 opacity-70'
            }`}
          >
            <div className="w-24 h-24 rounded-full border-4 border-white/60 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <div className="text-sm font-medium">
                  {breathingPhase === 'inhale' ? 'Breathe In' : 'Breathe Out'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {onEdit && (
        <button
          onClick={onEdit}
          className="absolute bottom-8 right-8 px-6 py-3 bg-white/10 backdrop-blur-md text-white border border-white/30 rounded-lg hover:bg-white/20 transition-all duration-300 z-20 font-medium"
        >
          Edit Dream
        </button>
      )}

      <a
        href="/styleguide"
        className="absolute bottom-8 left-8 px-6 py-3 bg-white/10 backdrop-blur-md text-white border border-white/30 rounded-lg hover:bg-white/20 transition-all duration-300 z-20 font-medium"
      >
        View Styleguide
      </a>
    </div>
  );
}
