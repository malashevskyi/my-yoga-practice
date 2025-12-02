import { useEffect, useRef, useState, useId } from "react";
import { toast } from "sonner";

interface UseYouTubePlayerOptions {
  videoId: string;
  autoplay?: boolean;
  onReady?: () => void;
  onEnd?: () => void;
}

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getPlayerState: () => number;
  destroy: () => void;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          playerVars?: {
            autoplay?: number;
            controls?: number;
            rel?: number;
            modestbranding?: number;
          };
          events?: {
            onReady?: (event: { target: YouTubePlayer }) => void;
            onStateChange?: (event: { data: number }) => void;
          };
        },
      ) => YouTubePlayer;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function useYouTubePlayer({
  videoId,
  autoplay = true,
  onReady,
  onEnd,
}: UseYouTubePlayerOptions) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const containerId = useId();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load YouTube IFrame API
    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
          resolve();
        };
      });
    };

    const initPlayer = async () => {
      await loadYouTubeAPI();

      // Create player
      playerRef.current = new window.YT.Player(containerId, {
        videoId,
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (event) => {
            setIsReady(true);
            onReady?.();
            if (autoplay) {
              event.target.playVideo();
            }
          },
          onStateChange: (event) => {
            // Video ended
            if (event.data === window.YT.PlayerState.ENDED) {
              onEnd?.();
              // Restart video
              playerRef.current?.seekTo(0, true);
              playerRef.current?.playVideo();
            }
          },
        },
      });
    };

    initPlayer();

    return () => {
      // Safely stop and destroy player
      if (
        playerRef.current &&
        typeof playerRef.current.stopVideo === "function"
      ) {
        try {
          playerRef.current.stopVideo();
        } catch (error) {
          console.error("Error stopping video:", error);
          toast.error("Error stopping YouTube video.");
        }
      }

      if (
        playerRef.current &&
        typeof playerRef.current.destroy === "function"
      ) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error("Error destroying player:", error);
          toast.error("Error destroying YouTube player.");
        }
      }

      playerRef.current = null;
    };
  }, [videoId, autoplay, onReady, onEnd, containerId]);

  const play = () => {
    playerRef.current?.playVideo();
  };

  const pause = () => {
    playerRef.current?.pauseVideo();
  };

  const stop = () => {
    playerRef.current?.stopVideo();
  };

  const restart = () => {
    playerRef.current?.seekTo(0, true);
    playerRef.current?.playVideo();
  };

  const togglePlayPause = () => {
    if (playerRef.current) {
      const state = playerRef.current.getPlayerState();
      // 1 = PLAYING, 2 = PAUSED
      if (state === 1) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  return {
    containerId,
    isReady,
    play,
    pause,
    stop,
    restart,
    togglePlayPause,
  };
}
