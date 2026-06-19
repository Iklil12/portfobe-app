import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, PictureInPicture } from 'lucide-react';

interface UniversalPlayerProps {
  mediaUrl: string;
  title?: string;
  autoPlayMode?: boolean;
  className?: string;
}

export function UniversalPlayer({ mediaUrl, title = "Video Player", autoPlayMode = false, className }: UniversalPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Custom Player States
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(autoPlayMode);
  const [progress, setProgress] = useState(0);
  const [timeText, setTimeText] = useState({ current: "0:00", duration: "0:00" });
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement && document.fullscreenElement === containerRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Settings Menu States
  const hlsRef = useRef<Hls | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [levels, setLevels] = useState<{ height: number }[]>([]);
  const [currentLevel, setCurrentLevel] = useState(-1);

  // Helper untuk format waktu (Detik -> M:SS)
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // FALLBACK TIMEOUT
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (inView) {
      timeoutId = setTimeout(() => {
        setIsLoaded(true);
      }, 1500);
    }
    return () => clearTimeout(timeoutId);
  }, [inView]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const getVimeoId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:vimeo\.com\/)(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i);
    return match ? match[1] : null;
  };

  const isBunnyStream = (url: string) => {
    if (!url) return false;
    if (url.length === 36 && url.includes('-')) return true;
    return url.startsWith('https://iframe.mediadelivery.net/embed/') || url.includes('mediadelivery.net');
  };

  // Convert Bunny Iframe URL to Direct HLS URL
  const getHlsUrl = (url: string) => {
    if (!url) return null;

    // Jika URL adalah iframe Bunny Stream bertanda tangan
    if (url.includes('iframe.mediadelivery.net')) {
      try {
        const urlObj = new URL(url);
        const paths = urlObj.pathname.split('/').filter(Boolean);
        const videoId = paths[2];
        const token = urlObj.searchParams.get('token');
        const expires = urlObj.searchParams.get('expires');
        const pullZone = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE || 'vz-eed0251b-ae9.b-cdn.net';

        if (videoId && token && expires) {
          return `https://${pullZone}/${videoId}/playlist.m3u8?token=${token}&expires=${expires}`;
        }
      } catch (e) {
        console.error("Gagal memproses Bunny URL");
      }
    }
    return url; // Fallback jika bukan URL bertanda tangan (atau murni HLS)
  };

  const ytId = getYouTubeId(mediaUrl);
  const vimeoId = getVimeoId(mediaUrl);
  const bunnyHlsUrl = isBunnyStream(mediaUrl) ? getHlsUrl(mediaUrl) : null;

  const handleOverlayClick = () => {
    setIsActivated(true);
    if (autoPlayMode && iframeRef.current && iframeRef.current.contentWindow) {
      try {
        if (ytId) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
            '*'
          );
        } else if (vimeoId) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ method: 'pause' }),
            '*'
          );
        }
      } catch (e) {
        console.error("Failed to send pause command to iframe", e);
      }
    }
  };

  // Initialize HLS.js
  useEffect(() => {
    if (inView && bunnyHlsUrl && videoRef.current) {
      let hls: Hls | null = null;

      if (Hls.isSupported()) {
        hls = new Hls({
          maxBufferLength: 30, // Menghemat memori RAM perangkat klien
          startLevel: -1 // Auto Quality
        });
        hls.loadSource(bunnyHlsUrl);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          setIsLoaded(true);
          // Hapus duplikat resolusi (jika ada) dan urutkan dari yang terbesar
          const uniqueLevels = data.levels.filter((v, i, a) => a.findIndex(t => (t.height === v.height)) === i).sort((a, b) => b.height - a.height);
          setLevels(uniqueLevels);
        });

        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
          setCurrentLevel(data.level);
        });

        hlsRef.current = hls;
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Native Safari support
        videoRef.current.src = bunnyHlsUrl;
        videoRef.current.addEventListener('loadedmetadata', () => setIsLoaded(true));
      }

      return () => {
        if (hls) hls.destroy();
      };
    }
  }, [inView, bunnyHlsUrl]);

  const handleQualityChange = (index: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = index;
      setCurrentLevel(index);
      setShowSettings(false);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackRate(speed);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              // Abaikan error jika video di-unmount atau di-refresh oleh Editor secara mendadak
              console.warn("Video play interrupted by Editor unmount or re-render.");
              setIsPlaying(false);
            });
        }
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      const p = (current / total) * 100;
      setProgress(p || 0);
      setTimeText({
        current: formatTime(current),
        duration: formatTime(total)
      });
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    const container = containerRef.current;

    // Untuk iOS/iPhone Safari: gunakan webkitEnterFullscreen langsung di video
    if (video && (video as any).webkitEnterFullscreen) {
      (video as any).webkitEnterFullscreen();
      return;
    }

    if (container) {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
          if (video && video.requestFullscreen) {
            video.requestFullscreen().catch(e => console.log(e));
          }
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  };

  return (
    <div ref={containerRef} className={`mobile-landscape-wrapper @container w-full h-full relative group overflow-hidden ${className || 'bg-black rounded-2xl border border-slate-800/60 shadow-2xl'}`}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 1023px) and (orientation: landscape) {
            .mobile-landscape-wrapper {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              width: 100vw !important;
              height: 100vh !important;
              z-index: 99999 !important;
              border-radius: 0 !important;
              margin: 0 !important;
              background-color: black !important;
            }
            .mobile-landscape-wrapper .aspect-video-wrapper {
              height: 100vh !important;
              width: 100vw !important;
              aspect-ratio: auto !important;
            }
            .mobile-landscape-wrapper video {
              object-fit: contain !important;
            }
          }
          :fullscreen .aspect-video-wrapper {
            height: 100% !important;
            width: 100% !important;
            aspect-ratio: auto !important;
          }
          :fullscreen video {
            object-fit: contain !important;
          }
          :-webkit-full-screen .aspect-video-wrapper {
            height: 100% !important;
            width: 100% !important;
            aspect-ratio: auto !important;
          }
          :-webkit-full-screen video {
            object-fit: contain !important;
          }
        `
      }} />
      <div className={`aspect-video-wrapper w-full ${isFullscreen ? 'h-full' : 'aspect-video'} transition-all duration-700 relative ${!isLoaded ? 'animate-pulse' : ''}`}>

        {/* Loading Spinner */}
        {(!isLoaded || !inView) && (
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <i className="fas fa-circle-notch text-white/30 animate-spin text-3xl"></i>
          </div>
        )}

        {inView && (
          <>
            {ytId ? (
              <div className="w-full h-full relative">
                <iframe
                  ref={iframeRef}
                  className={`w-full h-full z-10 relative opacity-0 transition-opacity duration-700 ${!isActivated ? 'pointer-events-none' : ''}`}
                  style={{ opacity: isLoaded ? 1 : 0 }}
                  src={`https://www.youtube.com/embed/${ytId}?enablejsapi=1&rel=0${origin ? `&origin=${encodeURIComponent(origin)}` : ''}${autoPlayMode || isActivated ? '&autoplay=1' : ''}${autoPlayMode ? '&mute=1' : ''}`}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  onLoad={() => setIsLoaded(true)}
                ></iframe>
                {!isActivated && (
                  <div
                    onClick={handleOverlayClick}
                    className="absolute inset-0 z-20 cursor-pointer bg-transparent"
                  />
                )}
              </div>
            ) : vimeoId ? (
              <div className="w-full h-full relative">
                <iframe
                  ref={iframeRef}
                  className={`w-full h-full z-10 relative opacity-0 transition-opacity duration-700 ${!isActivated ? 'pointer-events-none' : ''}`}
                  style={{ opacity: isLoaded ? 1 : 0 }}
                  src={`https://player.vimeo.com/video/${vimeoId}?color=ffffff&title=0&byline=0&portrait=0${origin ? `&origin=${encodeURIComponent(origin)}` : ''}${autoPlayMode || isActivated ? '&autoplay=1' : ''}${autoPlayMode ? '&muted=1' : ''}`}
                  title={title}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  onLoad={() => setIsLoaded(true)}
                ></iframe>
                {!isActivated && (
                  <div
                    onClick={handleOverlayClick}
                    className="absolute inset-0 z-20 cursor-pointer bg-transparent"
                  />
                )}
              </div>
            ) : bunnyHlsUrl ? (
              /* CUSTOM HEADLESS PLAYER ENTERPRISE */
              <div
                className="w-full h-full relative bg-black cursor-pointer overflow-hidden z-10 opacity-0 transition-opacity duration-700"
                style={{ opacity: isLoaded ? 1 : 0 }}
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
                onClick={togglePlay}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  playsInline
                  autoPlay={autoPlayMode}
                  muted={isMuted}
                />

                {/* Top Controls Bar (Gradient) */}
                <div
                  className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent transition-all duration-300 pointer-events-none ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* Center Custom Logo / Play indicator (Snappy Spring Fading) */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-none ${isPlaying ? 'opacity-0 scale-[1.5]' : 'opacity-100 scale-100'}`}>
                  <Play className="w-10 h-10 md:w-16 md:h-16 text-white ml-1.5 md:ml-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]" fill="currentColor" />
                </div>

                {/* Bottom Controls Bar (Sleek Inline Design) */}
                <div
                  className={`absolute bottom-0 left-0 right-0 px-6 py-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-500 transform ${showControls || !isPlaying ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-5">
                    {/* Play/Pause */}
                    <button onClick={togglePlay} className="text-white/80 hover:text-white transition-all hover:scale-110">
                      {isPlaying ? <Pause className="w-4 h-4" fill="currentColor" /> : <Play className="w-4 h-4" fill="currentColor" />}
                    </button>

                    {/* Volume */}
                    <button onClick={toggleMute} className="text-white/80 hover:text-white transition-all hover:scale-110">
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    {/* Time Signature */}
                    <span className="text-[11px] font-medium text-white/80 tracking-wide min-w-[60px] text-center select-none font-sans">
                      {timeText.current} / {timeText.duration}
                    </span>

                    {/* Minimalist Progress Bar */}
                    <div
                      className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer group relative mx-2"
                      onClick={(e) => {
                        if (videoRef.current) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const percent = (e.clientX - rect.left) / rect.width;
                          videoRef.current.currentTime = percent * videoRef.current.duration;
                        }
                      }}
                    >
                      <div
                        className="h-full bg-white transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Right Tools: Settings, PiP, Fullscreen */}
                    <div className="flex items-center gap-4 pl-2 relative">

                      {/* SETTINGS POPUP MENU */}
                      {showSettings && (
                        <div className="absolute bottom-10 right-10 bg-black/85 backdrop-blur-xl border border-white/10 rounded-2xl p-4 w-48 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 transform origin-bottom-right transition-all animate-in fade-in zoom-in-95">
                          {/* Speed Control */}
                          <div className="text-white/40 text-[9px] uppercase font-bold mb-2.5 tracking-[0.2em]">Speed</div>
                          <div className="flex justify-between mb-5 bg-white/5 p-1 rounded-lg">
                            {[0.5, 1, 1.5, 2].map(speed => (
                              <button
                                key={speed}
                                onClick={(e) => { e.stopPropagation(); handleSpeedChange(speed); }}
                                className={`text-[10px] px-2 py-1 rounded-md font-medium transition-all ${playbackRate === speed ? 'bg-white text-black shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                              >{speed}x</button>
                            ))}
                          </div>

                          {/* Quality Control (Hanya jika HLS.js aktif) */}
                          {levels.length > 0 && (
                            <>
                              <div className="text-white/40 text-[9px] uppercase font-bold mb-2.5 tracking-[0.2em]">Quality</div>
                              <div className="flex flex-col gap-1 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleQualityChange(-1); }}
                                  className={`text-[11px] text-left px-3 py-2 rounded-lg transition-all ${currentLevel === -1 ? 'bg-white text-black font-semibold' : 'text-white/80 hover:bg-white/10'}`}
                                >
                                  Auto {currentLevel !== -1 && <span className="opacity-50 text-[9px] ml-1">({levels[currentLevel]?.height}p)</span>}
                                </button>
                                {levels.map((level, index) => (
                                  <button
                                    key={index}
                                    onClick={(e) => { e.stopPropagation(); handleQualityChange(index); }}
                                    className={`text-[11px] text-left px-3 py-2 rounded-lg transition-all ${currentLevel === index ? 'bg-white text-black font-semibold' : 'text-white/80 hover:bg-white/10'}`}
                                  >
                                    {level.height}p
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      <button
                        onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
                        className={`transition-all duration-300 ${showSettings ? 'text-white rotate-90 scale-110' : 'text-white/70 hover:text-white hover:rotate-90'}`}
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (videoRef.current && (videoRef.current as any).requestPictureInPicture) {
                            (videoRef.current as any).requestPictureInPicture();
                          }
                        }}
                        className="text-white/70 hover:text-white transition-all hover:scale-110"
                      >
                        <PictureInPicture className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }} className="text-white/70 hover:text-white transition-all hover:scale-110">
                        <Maximize className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // NATIVE HTML5 VIDEO PLAYER (Untuk file MP4 direct URL)
              <video
                className="w-full h-full object-cover z-10 relative opacity-0 transition-opacity duration-700"
                style={{ opacity: isLoaded ? 1 : 0 }}
                controls
                autoPlay={autoPlayMode}
                muted={isMuted}
                controlsList="nodownload"
                preload="metadata"
                onLoadedData={() => setIsLoaded(true)}
              >
                <source src={mediaUrl} type="video/mp4" />
                Browser Anda tidak mendukung tag video.
              </video>
            )}
          </>
        )}
      </div>
    </div>
  );
}
