import "./LivePhotoViewer.css";
import type { LivePhotoOptions, LivePhotoAPI, LivePhotoState, LivePhotoError, ElementCustomization } from '../types';
import { StateManager } from './StateManager';
import { EventManager } from './EventManager';
import { VideoLoader } from './VideoLoader';
import { UIComponents } from './UIComponents';
import { validateOptions } from '../utils/validators';
import { debounce } from '../utils/debounce';
import { isMobile, createLivePhotoError } from '../utils/helpers';
import { errorIcon } from './icons';

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
  private readonly overlay: HTMLDivElement;
  
  private readonly options: LivePhotoOptions;
  private touchStartTime: number = 0;
  private intersectionObserver?: IntersectionObserver;
  private videoSrc: string;
  private aspectRatio: number = 1;

  constructor(options: LivePhotoOptions) {
    // Validate options
    validateOptions(options);
    
    // Set default options
    this.options = {
      autoplay: true,
      lazyLoadVideo: false,
      longPressDelay: 300,
      retryAttempts: 3,
      enableVibration: true,
      ...options,
    };

    // Initialize managers
    this.stateManager = new StateManager({
      autoplay: this.options.autoplay,
    });
    
    this.eventManager = new EventManager();
    this.videoLoader = new VideoLoader(this.options.retryAttempts);

    // Store video source
    this.videoSrc = this.options.videoSrc;

    // Create UI components
    this.container = UIComponents.createContainer(this.options);
    
    // Merge borderRadius into customization if provided
    const imageCustomization = this.mergeCustomization(this.options.imageCustomization, this.options.borderRadius);
    const videoCustomization = this.mergeCustomization(this.options.videoCustomization, this.options.borderRadius);
    
    this.photo = UIComponents.createPhoto(this.options.photoSrc, imageCustomization);
    this.video = UIComponents.createVideo(
      this.options.videoSrc,
      this.options.lazyLoadVideo ?? false,
      videoCustomization
    );
    this.badge = UIComponents.createBadge(this.options.autoplay ?? true);
    this.dropMenu = UIComponents.createDropMenu(this.options.autoplay ?? true);
    this.progressBar = UIComponents.createProgressBar();
    this.overlay = UIComponents.createOverlay();

    // Assemble DOM
    this.assembleDOM();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Initialize
    this.initialize();
  }

  private assembleDOM(): void {
    this.container.appendChild(this.progressBar);
    this.container.appendChild(this.photo);
    this.container.appendChild(this.video);
    this.container.appendChild(this.overlay);
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
    this.eventManager.addEventListener(this.video, 'loadeddata', this.handleVideoLoadedData.bind(this));

    // Badge events
    this.eventManager.addEventListener(this.badge, 'click', this.toggleDropMenu.bind(this));

    // Dropdown menu button
    const toggleButton = this.dropMenu.querySelector('#toggle-autoplay');
    if (toggleButton) {
      this.eventManager.addEventListener(toggleButton as HTMLElement, 'click', this.handleToggleAutoplay.bind(this));
    }

    // Interaction events
    if (isMobile()) {
      this.setupMobileEvents();
    } else {
      this.setupDesktopEvents();
    }
  }

  private setupMobileEvents(): void {
    this.eventManager.addEventListener(this.overlay, 'touchstart', this.handleTouchStart.bind(this));
    this.eventManager.addEventListener(this.overlay, 'touchend', this.handleTouchEnd.bind(this));
  }

  private setupDesktopEvents(): void {
    this.eventManager.addEventListener(this.badge, 'mouseenter', () => {
      const state = this.stateManager.getState();
      if (!state.videoError && state.autoplay) {
        this.play();
      }
    });

    this.eventManager.addEventListener(this.badge, 'mouseleave', () => {
      const state = this.stateManager.getState();
      if (!state.videoError && state.autoplay) {
        this.stop();
      }
    });
  }

  private handlePhotoLoad(): void {
    this.aspectRatio = this.photo.naturalWidth / this.photo.naturalHeight;
    this.updateContainerSize();
    this.options.onPhotoLoad?.();
  }

  private handlePhotoError(): void {
    const error = createLivePhotoError('PHOTO_LOAD_ERROR', 'Failed to load photo');
    this.options.onError?.(error);
  }

  private handleVideoEnd(): void {
    if (!this.video.loop) {
      this.stop();
      this.stateManager.setState({ 
        isPlaying: false, 
        isLongPressPlaying: false 
      });
      this.container.classList.remove('playing');
      this.options.onEnded?.();
    }
  }

  private handleVideoError(): void {
    this.video.style.display = 'none';
    this.stateManager.setState({ videoError: true });
    this.badge.innerHTML = errorIcon;
    this.container.classList.remove('playing');
    
    const error = createLivePhotoError('VIDEO_LOAD_ERROR', 'Failed to load video');
    this.options.onError?.(error);
  }

  private handleVideoProgress(): void {
    if (this.video.buffered.length > 0) {
      const progress = Math.floor((this.video.buffered.end(0) / this.video.duration) * 100);
      const state = this.stateManager.getState();
      
      UIComponents.updateBadgeContent(this.badge, progress, state.autoplay);
      this.options.onProgress?.(progress);

      // Restore badge after loading complete
      if (progress >= 100) {
        setTimeout(() => {
          UIComponents.updateBadgeContent(this.badge, 100, state.autoplay);
        }, 500);
      }
    }
  }

  private handleVideoLoadedData(): void {
    if (this.video.buffered.length > 0) {
      const progress = Math.floor((this.video.buffered.end(0) / this.video.duration) * 100);
      const state = this.stateManager.getState();
      UIComponents.updateBadgeContent(this.badge, progress, state.autoplay);
    }
  }

  private toggleDropMenu(): void {
    this.dropMenu.classList.toggle('show');
  }

  private handleToggleAutoplay(e: Event): void {
    e.stopPropagation();
    
    const state = this.stateManager.getState();
    const newAutoplay = !state.autoplay;
    
    this.stateManager.setState({ autoplay: newAutoplay });
    
    const button = this.dropMenu.querySelector('#toggle-autoplay');
    if (button) {
      button.textContent = newAutoplay ? '关闭自动播放' : '开启自动播放';
    }
    
    UIComponents.updateBadgeContent(this.badge, 100, newAutoplay);
    this.toggleDropMenu();
    
    // 如果关闭自动播放且正在播放，则停止
    if (!newAutoplay && state.isPlaying) {
      this.stop();
    }
  }

  private handleTouchStart(): void {
    this.touchStartTime = Date.now();
    
    const state = this.stateManager.getState();
    if (!state.videoError && !state.isPlaying) {
      this.stateManager.setState({ isLongPressPlaying: true });
      this.play();
    }
  }

  private handleTouchEnd(): void {
    const touchDuration = Date.now() - this.touchStartTime;
    const longPressDelay = this.options.longPressDelay ?? 300;
    
    // Short press (click)
    if (touchDuration < longPressDelay) {
      this.options.onClick?.();
    }
    
    // Stop playback
    const state = this.stateManager.getState();
    if (state.isLongPressPlaying && !state.videoError && state.isPlaying) {
      this.stateManager.setState({ isLongPressPlaying: false });
      this.stop();
    }
  }

  private initialize(): void {
    const state = this.stateManager.getState();
    
    // Setup lazy loading if enabled
    if (this.options.lazyLoadVideo) {
      this.setupLazyLoading();
    }
    
    // Autoplay if enabled
    if (state.autoplay) {
      this.play();
    }
  }

  private setupLazyLoading(): void {
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.video.src) {
          this.options.onLoadStart?.();
          this.video.src = this.videoSrc;
          this.stateManager.setState({ videoLoaded: true });
          this.intersectionObserver?.disconnect();
        }
      });
    });
    
    this.intersectionObserver.observe(this.container);
  }

  private updateContainerSize(): void {
    const computedStyle = window.getComputedStyle(this.container);
    const currentWidth = parseFloat(computedStyle.width);
    const currentHeight = parseFloat(computedStyle.height);

    if (this.container.style.width && !this.container.style.height) {
      this.container.style.height = `${currentWidth / this.aspectRatio}px`;
    }
    
    if (this.container.style.height && !this.container.style.width) {
      this.container.style.width = `${currentHeight * this.aspectRatio}px`;
    }
  }

  // Public API methods
  public async play(): Promise<void> {
    const state = this.stateManager.getState();
    
    if (state.isPlaying || state.videoError) {
      return;
    }

    try {
      // Load video if not loaded yet
      if (!state.videoLoaded && !this.video.src) {
        this.progressBar.style.opacity = '1';
        UIComponents.updateBadgeContent(this.badge, 0, state.autoplay);
        this.video.src = this.videoSrc;
        this.stateManager.setState({ videoLoaded: true });
      }

      this.stateManager.setState({ isPlaying: true });
      this.video.currentTime = 0;
      UIComponents.updateBadgeContent(this.badge, 100, state.autoplay);
      
      await this.video.play();

      // Haptic feedback
      if (this.options.enableVibration && navigator.vibrate) {
        navigator.vibrate(200);
      }

      requestAnimationFrame(() => {
        this.container.classList.add('playing');
        this.photo.style.opacity = '0';
      });
    } catch (error) {
      const livePhotoError = createLivePhotoError(
        'PLAYBACK_ERROR',
        'Failed to play video',
        error as Error
      );
      this.options.onError?.(livePhotoError);
      this.stop();
    }
  }

  public pause(): void {
    const state = this.stateManager.getState();
    
    if (state.isPlaying) {
      this.stateManager.setState({ isPlaying: false });
      this.video.pause();
      this.container.classList.remove('playing');
    }
  }

  public stop(): void {
    const state = this.stateManager.getState();
    
    if (state.isPlaying) {
      this.stateManager.setState({ isPlaying: false });
      this.video.pause();
      this.container.classList.remove('playing');
      this.photo.style.opacity = '1';
    }
  }

  public toggle(): void {
    const state = this.stateManager.getState();
    state.isPlaying ? this.pause() : this.play();
  }

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

  private mergeCustomization(
    customization?: ElementCustomization,
    borderRadius?: number | string
  ): ElementCustomization | undefined {
    if (!borderRadius && !customization) {
      return customization;
    }

    const merged: ElementCustomization = {
      ...customization,
      styles: {
        ...customization?.styles,
      },
    };

    // Only apply borderRadius if not already set in customization
    if (borderRadius && !customization?.styles?.borderRadius) {
      const borderRadiusValue = typeof borderRadius === 'number' 
        ? `${borderRadius}px` 
        : borderRadius;
      merged.styles!.borderRadius = borderRadiusValue as any;
    }

    return merged;
  }
}

// Export to window object for browser use
if (typeof window !== 'undefined') {
  window.LivePhotoViewer = LivePhotoViewer;
}
