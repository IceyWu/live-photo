export interface ElementCustomization {
  attributes?: Record<string, string>;
  styles?: Partial<CSSStyleDeclaration>;
}

/**
 * Text labels used across the UI. All fields are required in a complete
 * label set; users can override any subset via `labels`.
 */
export interface LivePhotoLabels {
  /** Badge text, e.g. "LIVE" */
  live: string;
  /** Menu item shown when autoplay is OFF (clicking enables it) */
  enableAutoplay: string;
  /** Menu item shown when autoplay is ON (clicking disables it) */
  disableAutoplay: string;
  /** Menu item shown when sound is ON (clicking mutes) */
  mute: string;
  /** Menu item shown when muted (clicking unmutes) */
  unmute: string;
}

export interface LivePhotoOptions {
  // Required
  photoSrc: string;
  videoSrc: string;
  container: HTMLElement;
  
  // Dimensions
  width?: number | string;
  height?: number | string;
  
  // Behavior
  autoplay?: boolean;
  lazyLoadVideo?: boolean;
  longPressDelay?: number;

  // Audio
  muted?: boolean;
  showMuteButton?: boolean;
  
  // Styling
  borderRadius?: number | string;

  // Internationalization
  locale?: string;
  labels?: Partial<LivePhotoLabels>;

  // Persistence
  /** localStorage key 前缀，设置后自动播放和静音偏好会被持久化。留空则不持久化。*/
  storageKey?: string;
  
  // New options
  theme?: 'light' | 'dark' | 'auto';
  preload?: 'auto' | 'metadata' | 'none';
  retryAttempts?: number;
  enableVibration?: boolean;
  staticBadgeIcon?: boolean;
  
  // Customization
  imageCustomization?: ElementCustomization;
  videoCustomization?: ElementCustomization;
  
  // Callbacks
  onCanPlay?: (event: Event, video: HTMLVideoElement) => void;
  onClick?: (event: Event) => void;
  onError?: (error: LivePhotoError, event?: Event) => void;
  onEnded?: (event: Event, video: HTMLVideoElement) => void;
  onVideoLoad?: (duration: number, event: Event, video: HTMLVideoElement) => void;
  onPhotoLoad?: (event: Event, photo: HTMLImageElement) => void;
  onProgress?: (progress: number, event: Event, video: HTMLVideoElement) => void;
  onLoadStart?: () => void;
  onLoadProgress?: (loaded: number, total: number) => void;
  onMutedChange?: (muted: boolean, video: HTMLVideoElement) => void;
}

export interface LivePhotoState {
  isPlaying: boolean;
  autoplay: boolean;
  videoError: boolean;
  videoLoaded: boolean;
  isLongPressPlaying: boolean;
  muted: boolean;
}

export interface LivePhotoError {
  type: 'VIDEO_LOAD_ERROR' | 'PHOTO_LOAD_ERROR' | 'PLAYBACK_ERROR' | 'VALIDATION_ERROR';
  message: string;
  originalError?: Error;
}

export interface LivePhotoAPI {
  play(): Promise<void>;
  pause(): void;
  stop(): void;
  toggle(): void;
  destroy(): void;
  getState(): Readonly<LivePhotoState>;
  setMuted(muted: boolean): void;
  toggleMute(): void;
}

// Global type declaration
declare global {
  interface Window {
    LivePhotoViewer: typeof import('../core/LivePhotoViewer').LivePhotoViewer;
  }
}
