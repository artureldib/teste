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
    if (videoRef.current && dream.video_url) {
      videoRef.current.play().catch(err => {
        console.error('Video autoplay failed:', err);
      });
    }
  }, [dream.video_url]);

  const isGenerating = dream.video_status === 'generating' || dream.video_status === 'pending';
  const isFailed = dream.video_status === 'failed';

  if (isGenerating) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
          <div className="text-center max-w-2xl px-8">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <div className="absolute inset-0 border-4 border-white/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
              Creating Your Dream
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-6">
              We're crafting a cinematic experience just for you
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <p className="text-lg font-medium mb-2">Your Vision:</p>
              <p className="text-white/90 italic">"{dream.title}"</p>
            </div>
            <p className="mt-6 text-sm text-white/60">
              This usually takes 10-30 seconds. Feel free to close this tab and return later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
          <div className="text-center max-w-2xl px-8">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
              Video Generation Failed
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-6">
              We encountered an issue creating your dream video
            </p>
            {dream.error_message && (
              <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-6 border border-red-500/20 mb-6">
                <p className="text-sm text-red-200">{dream.error_message}</p>
              </div>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-8 py-3 bg-white/10 backdrop-blur-md text-white border border-white/30 rounded-lg hover:bg-white/20 transition-all duration-300 font-medium"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

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
