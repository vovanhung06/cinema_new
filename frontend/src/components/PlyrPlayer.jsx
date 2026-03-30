import React, { useEffect, useRef, useState } from 'react';
import Plyr from 'plyr';
import HLS from 'hls.js';
import 'plyr/dist/plyr.css';

const PlyrPlayer = ({ url, poster, title, onPlayStateChange = () => {} }) => {
  const videoRef = useRef(null);
  const plyrRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!videoRef.current || !url) {
      console.warn('PlyrPlayer: Missing video ref or URL', { hasRef: !!videoRef.current, hasUrl: !!url });
      return;
    }

    setIsLoading(true);
    setError(null);
    const video = videoRef.current;
    let hls = null;

    try {
      // Initialize Plyr
      if (!plyrRef.current) {
        plyrRef.current = new Plyr(video, {
          controls: [
            'play-large',
            'play',
            'progress',
            'current-time',
            'duration',
            'mute',
            'volume',
            'settings',
            'fullscreen'
          ],
          settings: ['quality', 'speed'],
          quality: {
            default: 720,
            options: [360, 480, 720, 1080]
          },
          speed: {
            selected: 1,
            options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
          },
          tooltips: {
            controls: true,
            seek: true
          },
          captions: { active: true },
          autoplay: false
        });

        // Plyr event listeners
        plyrRef.current.on('play', () => {
          console.log('Video playing');
          onPlayStateChange(true);
        });

        plyrRef.current.on('pause', () => {
          console.log('Video paused');
          onPlayStateChange(false);
        });

        plyrRef.current.on('error', (error) => {
          console.error('Plyr error:', error);
          setError('Failed to load video');
        });
      }

      const plyr = plyrRef.current;

      // Handle HLS (.m3u8) streams
      if (url.includes('.m3u8')) {
        console.log('🎬 Loading HLS stream:', url);

        if (HLS.isSupported()) {
          hls = new HLS({
            debug: false,
            enableWorker: true,
            lowLatencyMode: true,
            startLevel: 2
          });

          hls.loadSource(url);
          hls.attachMedia(video);

          hls.on(HLS.Events.MANIFEST_PARSED, () => {
            console.log('✅ HLS manifest loaded, available quality levels:', hls.levels.length);
            setIsLoading(false);
            // Don't auto-play
          });

          hls.on(HLS.Events.ERROR, (event, data) => {
            console.error('❌ HLS Error:', event, data);
            if (data.fatal) {
              switch (data.type) {
                case HLS.ErrorTypes.NETWORK_ERROR:
                  console.error('Network error - retrying...');
                  hls.startLoad();
                  break;
                case HLS.ErrorTypes.MEDIA_ERROR:
                  console.error('Media error - attempting recovery...');
                  hls.recoverMediaError();
                  break;
                default:
                  setError('Unable to load video');
                  break;
              }
            }
          });

          hls.on(HLS.Events.LEVEL_SWITCHED, (event, data) => {
            console.log('Quality changed to level:', data.level);
          });

          // Attach to Plyr
          plyr.hls = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          console.log('📱 Using Safari native HLS support');
          video.src = url;
          setIsLoading(false);
        } else {
          console.error('❌ HLS is not supported on this browser');
          setError('HLS streaming not supported on your browser');
          setIsLoading(false);
        }
      } else {
        // Handle MP4 and other formats
        console.log('🎬 Loading MP4 video:', url);
        video.src = url;
        video.load();

        video.addEventListener('loadedmetadata', () => {
          console.log('✅ Video metadata loaded');
          setIsLoading(false);
        });

        video.addEventListener('error', (e) => {
          console.error('❌ Video load error:', e);
          setError('Failed to load video');
          setIsLoading(false);
        });
      }
    } catch (error) {
      console.error('Error initializing Plyr player:', error);
      setError(error.message);
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      if (hls) {
        hls.destroy();
      }
      if (plyrRef.current) {
        plyrRef.current.destroy();
        plyrRef.current = null;
      }
    };
  }, [url, onPlayStateChange]);

  return (
    <div className="relative w-full h-full bg-black rounded-[3rem] overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/60">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black">
          <div className="text-center space-y-4">
            <p className="text-red-500 font-bold">{error}</p>
            <p className="text-white/60 text-sm">Video URL: {url}</p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full plyr-player"
        poster={poster}
        crossOrigin="anonymous"
        preload="metadata"
      />
    </div>
  );
};

export default PlyrPlayer;
