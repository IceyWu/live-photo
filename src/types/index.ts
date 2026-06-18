export interface ElementCustomization {
  attributes?: Record<string, string>;
  styles?: Partial<CSSStyleDeclaration>;
}

/**
 * 可共享 / 可持久化的用户偏好（自动播放、静音）。
 */
export interface LivePhotoPrefs {
  autoplay?: boolean;
  muted?: boolean;
}

/**
 * 偏好存储抽象。同步与持久化都被统一为「换一个 store 实现」：
 * - 内存 store：同页面多个实例实时同步
 * - localStorage store：持久化 + 跨标签页同步
 * 实例只负责观测 store 并把变更写回 store，自身不关心背后是同步还是持久化。
 */
export interface PreferencesStore {
  /** 读取当前偏好快照。*/
  get(): LivePhotoPrefs;
  /** 写入偏好（仅在确有变化时通知订阅者）。*/
  set(patch: LivePhotoPrefs): void;
  /** 订阅变更，返回取消订阅函数。*/
  subscribe(listener: (prefs: LivePhotoPrefs) => void): () => void;
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
  /** localStorage key 前缀，设置后自动播放和静音偏好会被持久化，并在同源标签页间同步。留空则不持久化。*/
  storageKey?: string;

  // Cross-instance sync
  /**
   * 同步分组名。设置后，同名分组内的多个实例会共享 autoplay / muted 状态：
   * 任意一个切换，分组内其它实例实时同步（同页面内存级）。留空则各实例独立。
   * 本质是 `preferencesStore: getSharedStore(name)` 的语法糖。
   */
  syncGroup?: string;

  /**
   * 显式传入偏好存储。优先级高于 `syncGroup` / `storageKey`。
   * 把同一个 store 传给多个实例即可让它们共享 autoplay / muted 状态。
   */
  preferencesStore?: PreferencesStore;
  
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
