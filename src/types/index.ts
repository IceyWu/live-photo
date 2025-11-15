export interface ElementCustomization {
  attributes?: Record<string, string>;
  styles?: Partial<CSSStyleDeclaration>;
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
  
  // Styling
  borderRadius?: number | string;
  
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
}

export interface LivePhotoState {
  isPlaying: boolean;
  autoplay: boolean;
  videoError: boolean;
  videoLoaded: boolean;
  aspectRatio: number;
  isLongPressPlaying: boolean;
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
}

// Global type declaration
declare global {
  interface Window {
    LivePhotoViewer: any;
  }
}
