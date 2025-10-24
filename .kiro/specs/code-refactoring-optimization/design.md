# Design Document

## Overview

This design outlines a comprehensive refactoring of the LivePhotoViewer library to improve code organization, performance, type safety, and maintainability. The refactoring will follow SOLID principles and modern TypeScript best practices while maintaining 100% backward compatibility with the existing public API.

## Architecture

### Current Architecture Issues

1. **Monolithic Class**: 500+ lines in a single file with mixed responsibilities
2. **No Resource Cleanup**: Event listeners and DOM elements are never cleaned up
3. **Type Safety Gaps**: Uses `any` types and unsafe type assertions
4. **Performance Issues**: No debouncing, excessive DOM manipulations
5. **Inline Styles**: Hardcoded styles mixed with logic
6. **Limited Testability**: Tightly coupled code makes unit testing difficult

### New Architecture

```
src/
├── core/
│   ├── LivePhotoViewer.ts          # Main orchestrator (simplified)
│   ├── EventManager.ts              # Event handling & cleanup
│   ├── UIComponents.ts              # UI element creation
│   ├── StateManager.ts              # State management
│   ├── VideoLoader.ts               # Video loading with retry logic
│   ├── icons.ts                     # Icon definitions
│   └── LivePhotoViewer.css          # All styles with CSS variables
├── types/
│   └── index.ts                     # Type definitions
├── utils/
│   ├── debounce.ts                  # Utility functions
│   ├── validators.ts                # Config validation
│   └── helpers.ts                   # Helper functions
└── index.ts                         # Public API exports
```

## Components and Interfaces

### 1. Type Definitions (types/index.ts)

```typescript
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
  
  // New options
  theme?: 'light' | 'dark' | 'auto';
  preload?: 'auto' | 'metadata' | 'none';
  retryAttempts?: number;
  enableVibration?: boolean;
  
  // Customization
  imageCustomization?: ElementCustomization;
  videoCustomization?: ElementCustomization;
  
  // Callbacks
  onCanPlay?: () => void;
  onClick?: () => void;
  onError?: (error: LivePhotoError) => void;
  onEnded?: () => void;
  onVideoLoad?: () => void;
  onPhotoLoad?: () => void;
  onProgress?: (progress: number) => void;
  onLoadStart?: () => void;
  onLoadProgress?: (loaded: number, total: number) => void;
}

export interface ElementCustomization {
  attributes?: Record<string, string>;
  styles?: Partial<CSSStyleDeclaration>;
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
  type: 'VIDEO_LOAD_ERROR' | 'PHOTO_LOAD_ERROR' | 'PLAYBACK_ERROR';
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
    LivePhotoViewer: typeof LivePhotoViewer;
  }
}
```

### 2. State Manager (core/StateManager.ts)

**Purpose**: Centralize all state management with immutable updates

```typescript
export class StateManager {
  private state: LivePhotoState;
  private listeners: Set<(state: LivePhotoState) => void>;

  constructor(initialState: Partial<LivePhotoState>) {
    this.state = {
      isPlaying: false,
      autoplay: true,
      videoError: false,
      videoLoaded: false,
      aspectRatio: 1,
      isLongPressPlaying: false,
      ...initialState,
    };
    this.listeners = new Set();
  }

  public getState(): Readonly<LivePhotoState> {
    return Object.freeze({ ...this.state });
  }

  public setState(updates: Partial<LivePhotoState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  public subscribe(listener: (state: LivePhotoState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const currentState = this.getState();
    this.listeners.forEach(listener => listener(currentState));
  }

  public destroy(): void {
    this.listeners.clear();
  }
}
```

### 3. Event Manager (core/EventManager.ts)

**Purpose**: Handle all event listeners with automatic cleanup

```typescript
type EventHandler = (event: Event) => void;

interface EventRegistration {
  element: HTMLElement | Window | Document;
  event: string;
  handler: EventHandler;
  boundHandler: EventHandler;
}

export class EventManager {
  private registrations: EventRegistration[] = [];

  public addEventListener(
    element: HTMLElement | Window | Document,
    event: string,
    handler: EventHandler,
    options?: AddEventListenerOptions
  ): void {
    const boundHandler = handler.bind(this);
    element.addEventListener(event, boundHandler, options);
    
    this.registrations.push({
      element,
      event,
      handler,
      boundHandler,
    });
  }

  public removeEventListener(
    element: HTMLElement | Window | Document,
    event: string,
    handler: EventHandler
  ): void {
    const index = this.registrations.findIndex(
      reg => reg.element === element && reg.event === event && reg.handler === handler
    );
    
    if (index !== -1) {
      const registration = this.registrations[index];
      element.removeEventListener(event, registration.boundHandler);
      this.registrations.splice(index, 1);
    }
  }

  public destroy(): void {
    this.registrations.forEach(({ element, event, boundHandler }) => {
      element.removeEventListener(event, boundHandler);
    });
    this.registrations = [];
  }
}
```

### 4. UI Components (core/UIComponents.ts)

**Purpose**: Create and manage all UI elements

```typescript
export class UIComponents {
  public static createContainer(options: LivePhotoOptions): HTMLElement {
    const container = document.createElement('div');
    container.className = 'live-photo-container';
    
    if (options.width) {
      const width = typeof options.width === 'number' ? `${options.width}px` : options.width;
      container.style.width = width;
    }
    
    if (options.height) {
      const height = typeof options.height === 'number' ? `${options.height}px` : options.height;
      container.style.height = height;
    }

    if (!options.width && !options.height) {
      container.style.width = '300px';
      container.style.height = '300px';
    }

    // Apply theme
    if (options.theme) {
      container.setAttribute('data-theme', options.theme);
    }
    
    return container;
  }

  public static createPhoto(
    src: string,
    customization?: ElementCustomization
  ): HTMLImageElement {
    const photo = new Image();
    photo.src = src;
    photo.className = 'live-photo-image';

    if (customization) {
      UIComponents.applyCustomization(photo, customization);
    }

    UIComponents.preventDefaultBehaviors(photo);
    return photo;
  }

  public static createVideo(
    src: string,
    lazyLoad: boolean,
    customization?: ElementCustomization
  ): HTMLVideoElement {
    const video = document.createElement('video');
    video.loop = false;
    video.muted = true;
    video.playsInline = true;
    video.className = 'live-photo-video';

    if (!lazyLoad) {
      video.src = src;
    }

    if (customization) {
      UIComponents.applyCustomization(video, customization);
    }

    UIComponents.preventDefaultBehaviors(video);
    return video;
  }

  public static createBadge(autoplay: boolean): HTMLDivElement {
    const badge = document.createElement('div');
    badge.className = 'live-photo-badge';
    UIComponents.updateBadgeContent(badge, 100, autoplay);
    return badge;
  }

  public static updateBadgeContent(
    badge: HTMLDivElement,
    progress: number,
    autoplay: boolean
  ): void {
    badge.innerHTML = `
      ${createProgressLiveIcon(progress, !autoplay)}
      <span class="live-text">LIVE</span>
      <span class="chevron">${arrowIcon}</span>
    `;
  }

  public static createProgressBar(): HTMLDivElement {
    const progressBar = document.createElement('div');
    progressBar.className = 'live-photo-progress';
    return progressBar;
  }

  public static createDropMenu(autoplay: boolean): HTMLDivElement {
    const menu = document.createElement('div');
    menu.className = 'dropdown-menu';
    
    const button = document.createElement('button');
    button.id = 'toggle-autoplay';
    button.textContent = autoplay ? '关闭自动播放' : '开启自动播放';
    
    menu.appendChild(button);
    return menu;
  }

  private static applyCustomization(
    element: HTMLElement,
    customization: ElementCustomization
  ): void {
    if (customization.styles) {
      Object.assign(element.style, customization.styles);
    }

    if (customization.attributes) {
      Object.entries(customization.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }
  }

  private static preventDefaultBehaviors(element: HTMLElement): void {
    element.style.userSelect = 'none';
    element.style.touchAction = 'manipulation';
    
    const preventDefault = (e: Event) => e.preventDefault();
    
    ['touchstart', 'mousedown', 'selectstart', 'touchmove', 'touchend'].forEach(event => {
      element.addEventListener(event, preventDefault);
    });
  }
}
```

### 5. Video Loader (core/VideoLoader.ts)

**Purpose**: Handle video loading with retry logic

```typescript
export class VideoLoader {
  private retryAttempts: number;
  private currentAttempt: number = 0;

  constructor(retryAttempts: number = 3) {
    this.retryAttempts = retryAttempts;
  }

  public async loadVideo(
    video: HTMLVideoElement,
    src: string,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<void> {
    this.currentAttempt = 0;

    while (this.currentAttempt < this.retryAttempts) {
      try {
        await this.attemptLoad(video, src, onProgress);
        return;
      } catch (error) {
        this.currentAttempt++;
        
        if (this.currentAttempt >= this.retryAttempts) {
          throw new Error(`Failed to load video after ${this.retryAttempts} attempts`);
        }

        // Exponential backoff
        await this.delay(1000 * Math.pow(2, this.currentAttempt - 1));
      }
    }
  }

  private attemptLoad(
    video: HTMLVideoElement,
    src: string,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const handleLoad = () => {
        cleanup();
        resolve();
      };

      const handleError = (e: Event) => {
        cleanup();
        reject(e);
      };

      const handleProgress = () => {
        if (video.buffered.length > 0 && onProgress) {
          const loaded = video.buffered.end(0);
          const total = video.duration;
          onProgress(loaded, total);
        }
      };

      const cleanup = () => {
        video.removeEventListener('loadeddata', handleLoad);
        video.removeEventListener('error', handleError);
        video.removeEventListener('progress', handleProgress);
      };

      video.addEventListener('loadeddata', handleLoad);
      video.addEventListener('error', handleError);
      video.addEventListener('progress', handleProgress);

      video.src = src;
      video.load();
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 6. Utility Functions (utils/)

**debounce.ts**:
```typescript
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
```

**validators.ts**:
```typescript
export function validateOptions(options: LivePhotoOptions): void {
  if (!options.photoSrc) {
    throw new Error('photoSrc is required');
  }
  
  if (!options.videoSrc) {
    throw new Error('videoSrc is required');
  }
  
  if (!options.container || !(options.container instanceof HTMLElement)) {
    throw new Error('container must be a valid HTMLElement');
  }

  if (options.longPressDelay !== undefined && options.longPressDelay < 0) {
    throw new Error('longPressDelay must be a positive number');
  }

  if (options.retryAttempts !== undefined && options.retryAttempts < 1) {
    throw new Error('retryAttempts must be at least 1');
  }
}
```

### 7. Refactored LivePhotoViewer (core/LivePhotoViewer.ts)

**Simplified main class**:

```typescript
export class LivePhotoViewer implements LivePhotoAPI {
  private readonly stateManager: StateManager;
  private readonly eventManager: EventManager;
  private readonly videoLoader: VideoLoader;
  
  private readonly container: HTMLElement;
  private readonly photo: HTMLImageElement;
  private readonly video: HTMLVideoElement;
  private readonly badge: HTMLDivElement;
  private readonly dropMenu: HTMLDivElement;
  private readonly progressBar: HTMLDivElement;
  
  private readonly options: LivePhotoOptions;
  private touchStartTime: number = 0;
  private intersectionObserver?: IntersectionObserver;

  constructor(options: LivePhotoOptions) {
    validateOptions(options);
    
    this.options = {
      autoplay: true,
      lazyLoadVideo: false,
      longPressDelay: 300,
      retryAttempts: 3,
      enableVibration: true,
      ...options,
    };

    this.stateManager = new StateManager({
      autoplay: this.options.autoplay,
    });
    
    this.eventManager = new EventManager();
    this.videoLoader = new VideoLoader(this.options.retryAttempts);

    // Create UI components
    this.container = UIComponents.createContainer(this.options);
    this.photo = UIComponents.createPhoto(this.options.photoSrc, this.options.imageCustomization);
    this.video = UIComponents.createVideo(
      this.options.videoSrc,
      this.options.lazyLoadVideo ?? false,
      this.options.videoCustomization
    );
    this.badge = UIComponents.createBadge(this.options.autoplay ?? true);
    this.dropMenu = UIComponents.createDropMenu(this.options.autoplay ?? true);
    this.progressBar = UIComponents.createProgressBar();

    this.assembleDOM();
    this.setupEventListeners();
    this.initialize();
  }

  private assembleDOM(): void {
    this.container.appendChild(this.progressBar);
    this.container.appendChild(this.photo);
    this.container.appendChild(this.video);
    this.container.appendChild(this.badge);
    this.container.appendChild(this.dropMenu);
    this.options.container.appendChild(this.container);
  }

  private setupEventListeners(): void {
    // Photo events
    this.eventManager.addEventListener(this.photo, 'load', this.handlePhotoLoad.bind(this));
    this.eventManager.addEventListener(this.photo, 'error', this.handlePhotoError.bind(this));

    // Video events
    this.eventManager.addEventListener(this.video, 'ended', this.handleVideoEnd.bind(this));
    this.eventManager.addEventListener(this.video, 'error', this.handleVideoError.bind(this));
    this.eventManager.addEventListener(this.video, 'progress', debounce(this.handleVideoProgress.bind(this), 100));

    // Badge events
    this.eventManager.addEventListener(this.badge, 'click', this.toggleDropMenu.bind(this));

    // Interaction events
    if (this.isMobile()) {
      this.setupMobileEvents();
    } else {
      this.setupDesktopEvents();
    }
  }

  // ... rest of the methods (simplified and delegated to managers)

  public destroy(): void {
    // Clean up intersection observer
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    // Clean up event listeners
    this.eventManager.destroy();

    // Clean up state manager
    this.stateManager.destroy();

    // Release media resources
    this.video.pause();
    this.video.src = '';
    this.video.load();
    this.photo.src = '';

    // Remove from DOM
    this.container.remove();
  }

  public getState(): Readonly<LivePhotoState> {
    return this.stateManager.getState();
  }
}
```

### 8. CSS Variables (core/LivePhotoViewer.css)

```css
:root {
  --live-photo-badge-bg: rgba(64, 64, 64, 0.5);
  --live-photo-badge-hover-bg: rgba(64, 64, 64, 0.7);
  --live-photo-text-color: #fff;
  --live-photo-border-radius: 12px;
  --live-photo-transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --live-photo-progress-height: 3px;
  --live-photo-progress-color: #fff;
}

[data-theme="dark"] {
  --live-photo-badge-bg: rgba(32, 32, 32, 0.7);
  --live-photo-badge-hover-bg: rgba(32, 32, 32, 0.9);
}

[data-theme="light"] {
  --live-photo-badge-bg: rgba(255, 255, 255, 0.7);
  --live-photo-badge-hover-bg: rgba(255, 255, 255, 0.9);
  --live-photo-text-color: #000;
}

.live-photo-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0%;
  height: var(--live-photo-progress-height);
  background: var(--live-photo-progress-color);
  transition: width 0.2s;
  opacity: 0;
}

/* Remove all inline styles from TypeScript */
```

## Data Models

No database or persistent storage required. All state is managed in-memory through the StateManager.

## Error Handling

### Error Types

```typescript
enum LivePhotoErrorType {
  VIDEO_LOAD_ERROR = 'VIDEO_LOAD_ERROR',
  PHOTO_LOAD_ERROR = 'PHOTO_LOAD_ERROR',
  PLAYBACK_ERROR = 'PLAYBACK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}
```

### Error Recovery Strategy

1. **Video Load Errors**: Retry with exponential backoff (3 attempts by default)
2. **Photo Load Errors**: Display error icon, call onError callback
3. **Playback Errors**: Stop playback, reset state, call onError callback
4. **Validation Errors**: Throw immediately during construction

## Testing Strategy

### Unit Tests

- StateManager: Test state updates and subscriptions
- EventManager: Test event registration and cleanup
- VideoLoader: Test retry logic and error handling
- UIComponents: Test element creation and customization
- Utilities: Test debounce, validators

### Integration Tests

- Test full lifecycle (create → play → stop → destroy)
- Test event interactions (touch, mouse, keyboard)
- Test lazy loading with IntersectionObserver
- Test error recovery scenarios

### Test Utilities

```typescript
export const testUtils = {
  createMockOptions: (): LivePhotoOptions => ({
    photoSrc: 'test.jpg',
    videoSrc: 'test.mp4',
    container: document.createElement('div'),
  }),
  
  simulateVideoLoad: (viewer: LivePhotoViewer) => {
    // Trigger video load event
  },
  
  simulateVideoError: (viewer: LivePhotoViewer) => {
    // Trigger video error event
  },
};
```

## Migration Path

### Backward Compatibility

All existing public APIs remain unchanged:
- Constructor signature
- Public methods (play, pause, stop, toggle)
- Options interface (extended, not modified)
- Event callbacks

### Breaking Changes

None. This is a pure refactoring with added features.

### Deprecation Warnings

None planned for this release.

## Performance Improvements

1. **Debounced Progress Updates**: Reduce callback frequency from ~60fps to ~10fps
2. **Lazy Loading**: Use IntersectionObserver instead of immediate load
3. **Cached DOM References**: Eliminate repeated querySelector calls
4. **CSS Transitions**: Use GPU-accelerated transforms
5. **Event Delegation**: Reduce number of event listeners where possible

## Bundle Size Impact

Expected changes:
- Slight increase due to new modules (~2-3KB)
- Better tree-shaking potential
- Gzip compression will minimize impact

## Implementation Phases

1. **Phase 1**: Create new modules (StateManager, EventManager, UIComponents, VideoLoader)
2. **Phase 2**: Refactor LivePhotoViewer to use new modules
3. **Phase 3**: Add CSS variables and remove inline styles
4. **Phase 4**: Add new configuration options
5. **Phase 5**: Add destroy() method and cleanup logic
6. **Phase 6**: Add test utilities and documentation
