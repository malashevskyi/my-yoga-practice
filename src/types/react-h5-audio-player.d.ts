declare module "react-h5-audio-player" {
  import { Component, RefObject, CSSProperties, ReactNode } from "react";

  export interface AudioPlayerProps {
    src?: string;
    preload?: "auto" | "metadata" | "none";
    autoPlay?: boolean;
    autoPlayAfterSrcChange?: boolean;
    loop?: boolean;
    muted?: boolean;
    volume?: number;
    crossOrigin?: string;
    mediaGroup?: string;

    // Layout customization
    showJumpControls?: boolean;
    showSkipControls?: boolean;
    showDownloadProgress?: boolean;
    showFilledProgress?: boolean;
    showFilledVolume?: boolean;

    // Custom controls
    customProgressBarSection?: ReactNode[];
    customControlsSection?: ReactNode[];
    customAdditionalControls?: ReactNode[];
    customVolumeControls?: ReactNode[];
    customIcons?: {
      play?: ReactNode;
      pause?: ReactNode;
      rewind?: ReactNode;
      forward?: ReactNode;
      previous?: ReactNode;
      next?: ReactNode;
      loop?: ReactNode;
      loopOff?: ReactNode;
      volume?: ReactNode;
      volumeMute?: ReactNode;
    };

    // Key bindings
    hasDefaultKeyBindings?: boolean;

    // Time display
    timeFormat?: "auto" | "mm:ss" | "hh:mm:ss";

    // Callbacks
    onPlay?: (e: Event) => void;
    onPause?: (e: Event) => void;
    onEnded?: (e: Event) => void;
    onSeeking?: (e: Event) => void;
    onSeeked?: (e: Event) => void;
    onAbort?: (e: Event) => void;
    onCanPlay?: (e: Event) => void;
    onCanPlayThrough?: (e: Event) => void;
    onEmptied?: (e: Event) => void;
    onError?: (e: Event) => void;
    onLoadStart?: (e: Event) => void;
    onLoadedMetaData?: (e: Event) => void;
    onLoadedData?: (e: Event) => void;
    onPlaying?: (e: Event) => void;
    onSuspend?: (e: Event) => void;
    onWaiting?: (e: Event) => void;
    onVolumeChange?: (e: Event) => void;
    onChangeCurrentTimeError?: () => void;
    onListen?: (e: Event) => void;
    onPlayError?: (err: Error) => void;
    listenInterval?: number;

    // Styling
    style?: CSSProperties;
    className?: string;

    // Other props
    [key: string]: unknown;
  }

  export default class AudioPlayer extends Component<AudioPlayerProps> {
    audio: RefObject<HTMLAudioElement>;
  }
}

declare module "react-h5-audio-player/lib/styles.css" {
  const content: string;
  export default content;
}
