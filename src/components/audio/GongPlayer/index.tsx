import { useRef, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

interface GongPlayerProps {
  src: string;
  autoPlay?: boolean;
  onEnded?: () => void;
}

export function GongPlayer({
  src,
  autoPlay = false,
  onEnded,
}: GongPlayerProps) {
  const ref = useRef<AudioPlayer>(null);

  useEffect(() => {
    if (ref?.current?.audio?.current) {
      ref.current.audio.current.playbackRate = 1.0;
    }
  }, []);

  // Stop previous audio and play new one when src changes
  useEffect(() => {
    const audioElement = ref?.current?.audio?.current;
    if (audioElement) {
      // Stop previous audio
      audioElement.pause();

      // Play new audio if autoPlay is true
      if (autoPlay) {
        audioElement.load(); // Reload new source (this resets currentTime)
        audioElement.play().catch((error: Error) => {
          console.error("Failed to play gong:", error);
        });
      }
    }
  }, [src, autoPlay]);

  return (
    <AudioPlayer
      src={src}
      ref={ref}
      autoPlay={autoPlay}
      showJumpControls={false}
      showFilledProgress={false}
      hasDefaultKeyBindings={false}
      customProgressBarSection={[]}
      customVolumeControls={[]}
      customAdditionalControls={[]}
      autoPlayAfterSrcChange={false}
      onEnded={onEnded}
      style={{ display: "none" }}
    />
  );
}
