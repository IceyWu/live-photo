import "./LivePhotoViewer.css";
import type { LivePhotoOptions, LivePhotoAPI, LivePhotoState, ElementCustomization } from '../types';
import { StateManager } from './StateManager';
import { EventManager } from './EventManager';
import {
  createContainer, createPhoto, createVideo, createBadge, createDropMenu,
  createProgressBar, createOverlay,
  updateBadgeContent, updateAutoplayButton, updateMuteButton,
} from './UIComponents';
import { VideoLoader, type LoadAbortController } from './VideoLoader';
import { validateOptions } from '../utils/validators';
import { debounce, type DebouncedFn } from '../utils/debounce';
import { IS_MOBILE, createLivePhotoError } from '../utils/helpers';
import { errorIcon } from './icons';
import { resolveLabels } from './i18n';
import type { LivePhotoLabels } from '../types';
import { loadPrefs, savePrefs } from '../utils/storage';

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

  private readonly photoCleanup: () => void;
  private readonly videoCleanup: () => void;

  private readonly options: LivePhotoOptions;
  private readonly labels: LivePhotoLabels;

  private touchStartTime: number = 0;
  private intersectionObserver?: IntersectionObserver;
  private videoSrc: string;
  private aspectRatio: number = 1;
  private badgeRestoreTimer?: ReturnType<typeof setTimeout>;
  private hoverStopTimer?: ReturnType<typeof setTimeout>;
  private videoReady: boolean = false;
  private photoLoaded: boolean = false;
  private pendingAutoplay: boolean = false;
  private readonly debouncedVideoProgress: DebouncedFn<(event: Event) => void>;
  private lastSyncedState?: LivePhotoState;
  private loadAbortController?: LoadAbortController;
  private destroyed: boolean = false;

  constructor(options: LivePhotoOptions) {
    validateOptions(options);

    const defaults: Partial<LivePhotoOptions> = {
      autoplay: true,
      lazyLoadVideo: false,
      longPressDelay: 300,
      retryAttempts: 3,
      enableVibration: true,
      staticBadgeIcon: false,
      muted: true,
      showMuteButton: true,
    };

    // 读取持久化偏好（优先级高于默认值，低于用户本次显式传入）
    const prefs = options.storageKey ? loadPrefs(options.storageKey) : {};
    const persistedAutoplay = prefs.autoplay !== undefined && options.autoplay === undefined
      ? prefs.autoplay : undefined;
    const persistedMuted = prefs.muted !== undefined && options.muted === undefined
      ? prefs.muted : undefined;

    this.options = {
      ...defaults,
      ...options,
      ...(persistedAutoplay !== undefined ? { autoplay: persistedAutoplay } : {}),
      ...(persistedMuted !== undefined ? { muted: persistedMuted } : {}),
    };

    this.labels = resolveLabels(this.options.locale, this.options.labels);

    this.stateManager = new StateManager({
      autoplay: this.options.autoplay,
      muted: this.options.muted,
    });

    this.eventManager = new EventManager();
    this.videoLoader = new VideoLoader(this.options.retryAttempts ?? 3);
    this.videoSrc = this.options.videoSrc;

    this.debouncedVideoProgress = debounce(this.handleVideoProgress.bind(this), 100);

    this.container = createContainer(this.options);

    const imageCustomization = this.mergeCustomization(this.options.imageCustomization, this.options.borderRadius);
    const videoCustomization = this.mergeCustomization(this.options.videoCustomization, this.options.borderRadius);

    const photoResult = createPhoto(this.options.photoSrc, imageCustomization);
    this.photo = photoResult.element;
    this.photoCleanup = photoResult.cleanup;

    const videoResult = createVideo(
      videoCustomization,
      this.options.muted ?? true,
      this.options.preload ?? 'metadata'
    );
    this.video = videoResult.element;
    this.videoCleanup = videoResult.cleanup;

    this.badge = createBadge(
      this.options.autoplay ?? true,
      this.options.staticBadgeIcon ?? false,
      this.labels.live
    );
    this.dropMenu = createDropMenu(this.options.autoplay ?? true, {
      muted: this.options.muted ?? true,
      showMuteButton: this.options.showMuteButton ?? true,
      labels: this.labels,
    });
    this.progressBar = createProgressBar();
    this.overlay = createOverlay();

    this.assembleDOM();
    this.setupEventListeners();
    this.stateManager.subscribe(this.syncUI.bind(this));
    this.initialize();
  }

  // ─── UI 同步 ──────────────────────────────────────────────────────────────

  private syncUI(state: LivePhotoState): void {
    const prev = this.lastSyncedState;

    if (!prev || prev.autoplay !== state.autoplay) {
      this.refreshProgressBadge();
      updateAutoplayButton(this.dropMenu, state.autoplay, this.labels);
    }

    if (!prev || prev.muted !== state.muted) {
      updateMuteButton(this.dropMenu, state.muted, this.labels);
    }

    this.lastSyncedState = { ...state };
  }

  // ─── DOM 组装 ─────────────────────────────────────────────────────────────

  private assembleDOM(): void {
    this.container.appendChild(this.progressBar);
    this.container.appendChild(this.photo);
    this.container.appendChild(this.video);
    this.container.appendChild(this.overlay);
    this.container.appendChild(this.badge);
    this.container.appendChild(this.dropMenu);
    this.options.container.appendChild(this.container);
  }

  // ─── 事件监听 ─────────────────────────────────────────────────────────────

  private setupEventListeners(): void {
    this.eventManager.addEventListener(this.photo, 'load', this.handlePhotoLoad.bind(this));
    this.eventManager.addEventListener(this.photo, 'error', this.handlePhotoError.bind(this));

    this.eventManager.addEventListener(this.video, 'ended', this.handleVideoEnd.bind(this));
    this.eventManager.addEventListener(this.video, 'error', this.handleRuntimeVideoError.bind(this));
    this.eventManager.addEventListener(this.video, 'progress', this.debouncedVideoProgress);
    this.eventManager.addEventListener(this.video, 'loadeddata', this.handleVideoLoadedData.bind(this));
    this.eventManager.addEventListener(this.video, 'canplay', this.handleCanPlay.bind(this));
    this.eventManager.addEventListener(this.video, 'loadedmetadata', this.handleVideoLoad.bind(this));

    this.eventManager.addEventListener(this.badge, 'click', this.toggleDropMenu.bind(this));
    this.eventManager.addEventListener(this.badge, 'keydown', this.handleBadgeKeydown.bind(this));
    this.eventManager.addEventListener(this.dropMenu, 'keydown', this.handleMenuKeydown.bind(this));
    this.eventManager.addEventListener(document, 'click', this.handleOutsideClick.bind(this));

    const toggleButton = this.dropMenu.querySelector('#toggle-autoplay');
    if (toggleButton) {
      this.eventManager.addEventListener(
        toggleButton as HTMLElement, 'click', this.handleToggleAutoplay.bind(this)
      );
    }
    const muteButton = this.dropMenu.querySelector('#toggle-mute');
    if (muteButton) {
      this.eventManager.addEventListener(
        muteButton as HTMLElement, 'click', this.handleToggleMute.bind(this)
      );
    }

    if (IS_MOBILE) {
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
    const enter = this.handleHoverEnter.bind(this);
    const leave = this.handleHoverLeave.bind(this);
    this.eventManager.addEventListener(this.badge, 'mouseenter', enter);
    this.eventManager.addEventListener(this.badge, 'mouseleave', leave);
    this.eventManager.addEventListener(this.dropMenu, 'mouseenter', enter);
    this.eventManager.addEventListener(this.dropMenu, 'mouseleave', leave);
    // 桌面端点击 overlay 也触发 onClick 回调，与移动端行为一致
    this.eventManager.addEventListener(this.overlay, 'click', (e: Event) => {
      this.options.onClick?.(e);
    });
  }

  // ─── 事件处理器 ───────────────────────────────────────────────────────────

  private handleHoverEnter(): void {
    if (this.hoverStopTimer) {
      clearTimeout(this.hoverStopTimer);
      this.hoverStopTimer = undefined;
    }
    if (!this.stateManager.getState().videoError) this.play();
  }

  private handleHoverLeave(): void {
    if (this.hoverStopTimer) clearTimeout(this.hoverStopTimer);
    this.hoverStopTimer = setTimeout(() => {
      this.hoverStopTimer = undefined;
      if (!this.stateManager.getState().videoError) this.stop();
    }, 120);
  }

  private handleOutsideClick(e: Event): void {
    if (!this.dropMenu.classList.contains('show')) return;
    const target = e.target as Node;
    if (!this.dropMenu.contains(target) && !this.badge.contains(target)) {
      this.closeDropMenu();
    }
  }

  private handlePhotoLoad(event: Event): void {
    this.photoLoaded = true;
    this.aspectRatio = this.photo.naturalWidth / this.photo.naturalHeight;
    this.updateContainerSize();
    this.options.onPhotoLoad?.(event, this.photo);

    if (this.pendingAutoplay) {
      this.pendingAutoplay = false;
      this.play();
    }
  }

  private handlePhotoError(event: Event): void {
    this.photoLoaded = true;
    this.options.onError?.(createLivePhotoError('PHOTO_LOAD_ERROR', 'Failed to load photo'), event);

    if (this.pendingAutoplay) {
      this.pendingAutoplay = false;
      this.play();
    }
  }

  private handleVideoEnd(event: Event): void {
    if (!this.video.loop) {
      this.stop();
      this.stateManager.setState({ isLongPressPlaying: false });
      this.options.onEnded?.(event, this.video);
    }
  }

  private markVideoError(event?: Event, originalError?: Error): void {
    if (this.stateManager.getState().videoError) return;
    this.video.style.display = 'none';
    this.stateManager.setState({ videoError: true });
    this.badge.innerHTML = errorIcon;
    this.container.classList.remove('playing');
    this.options.onError?.(
      createLivePhotoError('VIDEO_LOAD_ERROR', 'Failed to load video', originalError), event
    );
  }

  private handleRuntimeVideoError(event: Event): void {
    if (!this.videoReady) return;
    this.markVideoError(event);
  }

  /** 5. 统一的进度徽标刷新，避免 handleVideoProgress / handleVideoLoadedData / syncUI 三处重复 */
  private refreshProgressBadge(progress?: number): void {
    const p = progress !== undefined
      ? progress
      : this.video.buffered.length > 0
        ? Math.min(100, Math.floor((this.video.buffered.end(0) / (this.video.duration || 1)) * 100))
        : 100;
    const state = this.stateManager.getState();
    updateBadgeContent(this.badge, p, state.autoplay, this.options.staticBadgeIcon ?? false, this.labels.live);
  }

  private handleVideoProgress(event: Event): void {
    if (this.video.buffered.length === 0) return;

    const progress = Math.floor((this.video.buffered.end(0) / this.video.duration) * 100);
    this.refreshProgressBadge(progress);
    this.options.onProgress?.(progress, event, this.video);

    if (progress >= 100) {
      if (this.badgeRestoreTimer) clearTimeout(this.badgeRestoreTimer);
      this.badgeRestoreTimer = setTimeout(() => {
        this.badgeRestoreTimer = undefined;
        this.progressBar.style.opacity = '0';
        this.progressBar.style.width = '0%';
        this.syncUI(this.stateManager.getState());
      }, 500);
    } else {
      this.progressBar.style.width = `${progress}%`;
    }
  }

  private handleVideoLoadedData(): void {
    if (this.video.buffered.length > 0) {
      this.refreshProgressBadge();
    }
  }

  private handleCanPlay(event: Event): void {
    this.videoReady = true;
    this.options.onCanPlay?.(event, this.video);
  }

  private handleVideoLoad(event: Event): void {
    this.options.onVideoLoad?.(this.video.duration || 0, event, this.video);
  }

  private openDropMenu(): void {
    this.dropMenu.classList.add('show');
    this.badge.setAttribute('aria-expanded', 'true');
    const first = this.dropMenu.querySelector<HTMLElement>('button');
    first?.focus();
  }

  private closeDropMenu(): void {
    this.dropMenu.classList.remove('show');
    this.badge.setAttribute('aria-expanded', 'false');
  }

  private toggleDropMenu(): void {
    this.dropMenu.classList.contains('show') ? this.closeDropMenu() : this.openDropMenu();
  }

  private handleToggleAutoplay(e: Event): void {
    e.stopPropagation();
    const state = this.stateManager.getState();
    const newAutoplay = !state.autoplay;
    this.stateManager.setState({ autoplay: newAutoplay });
    if (this.options.storageKey) {
      savePrefs(this.options.storageKey, { autoplay: newAutoplay, muted: state.muted });
    }
    this.closeDropMenu();
    if (!newAutoplay && state.isPlaying) this.stop();
  }

  private handleToggleMute(e: Event): void {
    e.stopPropagation();
    this.toggleMute();
    this.closeDropMenu();
  }

  private handleBadgeKeydown(e: Event): void {
    const key = (e as KeyboardEvent).key;
    if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      this.toggleDropMenu();
    }
  }

  private handleMenuKeydown(e: Event): void {
    const ke = e as KeyboardEvent;
    if (ke.key === 'Escape') {
      ke.preventDefault();
      this.closeDropMenu();
      this.badge.focus();
      return;
    }
    if (ke.key === 'ArrowDown' || ke.key === 'ArrowUp') {
      ke.preventDefault();
      const items = Array.from(this.dropMenu.querySelectorAll<HTMLElement>('button'));
      const idx = items.indexOf(document.activeElement as HTMLElement);
      const next = ke.key === 'ArrowDown'
        ? items[(idx + 1) % items.length]
        : items[(idx - 1 + items.length) % items.length];
      next?.focus();
    }
  }

  private handleTouchStart(): void {
    this.touchStartTime = Date.now();
    const state = this.stateManager.getState();
    if (!state.videoError && !state.isPlaying) {
      this.stateManager.setState({ isLongPressPlaying: true });
      this.container.classList.add('playing');
      this.photo.style.opacity = '0';
      this.play();
    }
  }

  private handleTouchEnd(event: Event): void {
    const touchDuration = Date.now() - this.touchStartTime;
    if (touchDuration < (this.options.longPressDelay ?? 300)) {
      this.options.onClick?.(event);
    }
    const state = this.stateManager.getState();
    if (state.isLongPressPlaying && !state.videoError && state.isPlaying) {
      this.stateManager.setState({ isLongPressPlaying: false });
      this.stop();
    }
  }

  // ─── 初始化 / 加载 ────────────────────────────────────────────────────────

  private initialize(): void {
    if (this.options.lazyLoadVideo) {
      this.setupLazyLoading();
    } else {
      this.loadVideoSource();
    }

    if (this.stateManager.getState().autoplay) {
      if (!this.photoLoaded) {
        this.pendingAutoplay = true;
      } else {
        this.play();
      }
    }
  }

  private setupLazyLoading(): void {
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadVideoSource();
          this.intersectionObserver?.disconnect();
        }
      });
    });
    this.intersectionObserver.observe(this.container);
  }

  private loadVideoSource(): void {
    const state = this.stateManager.getState();
    if (state.videoLoaded || this.video.src || state.videoError) return;

    this.stateManager.setState({ videoLoaded: true });
    this.options.onLoadStart?.();
    this.progressBar.style.opacity = '1';
    this.progressBar.style.width = '0%';

    const { promise, controller } = this.videoLoader.loadVideo(
      this.video, this.videoSrc,
      (loaded, total) => { this.options.onLoadProgress?.(loaded, total); }
    );
    this.loadAbortController = controller;
    promise.catch((error: Error) => {
      this.markVideoError(undefined, error);
    });
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

  // ─── 公开 API ─────────────────────────────────────────────────────────────

  public async play(): Promise<void> {
    if (this.destroyed) return;
    const state = this.stateManager.getState();
    if (state.isPlaying || state.videoError) return;

    if (!state.videoLoaded && !this.video.src) {
      this.loadVideoSource();
    }

    if (!this.videoReady) {
      await new Promise<void>((resolve, reject) => {
        const onReady = () => { cleanup(); resolve(); };
        const onError = () => { cleanup(); reject(); };
        const cleanup = () => {
          this.video.removeEventListener('canplay', onReady);
          this.video.removeEventListener('error', onError);
        };
        this.video.addEventListener('canplay', onReady, { once: true });
        this.video.addEventListener('error', onError, { once: true });
      }).catch(() => {});

      if (this.stateManager.getState().videoError) return;
    }

    try {
      this.stateManager.setState({ isPlaying: true });
      this.video.currentTime = 0;
      await this.video.play();

      if (this.options.enableVibration && navigator.vibrate) {
        navigator.vibrate(200);
      }

      this.container.classList.add('playing');
      this.photo.style.opacity = '0';
    } catch (error) {
      this.options.onError?.(createLivePhotoError('PLAYBACK_ERROR', 'Failed to play video', error as Error));
      this.stop();
    }
  }

  private stopPlayback(resetPhoto: boolean): void {
    if (this.destroyed) return;
    if (!this.stateManager.getState().isPlaying) return;
    this.stateManager.setState({ isPlaying: false });
    this.video.pause();
    this.container.classList.remove('playing');
    if (resetPhoto) this.photo.style.opacity = '1';
  }

  public pause(): void { this.stopPlayback(false); }
  public stop(): void { this.stopPlayback(true); }

  public setMuted(muted: boolean): void {
    if (this.destroyed) return;
    const state = this.stateManager.getState();
    this.stateManager.setState({ muted });
    this.video.muted = muted;
    if (this.options.storageKey) {
      savePrefs(this.options.storageKey, { autoplay: state.autoplay, muted });
    }
    this.options.onMutedChange?.(muted, this.video);
  }

  public toggleMute(): void {
    if (this.destroyed) return;
    this.setMuted(!this.stateManager.getState().muted);
  }

  public toggle(): void {
    if (this.destroyed) return;
    this.stateManager.getState().isPlaying ? this.pause() : this.play();
  }

  public destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    if (this.badgeRestoreTimer) {
      clearTimeout(this.badgeRestoreTimer);
      this.badgeRestoreTimer = undefined;
    }
    if (this.hoverStopTimer) {
      clearTimeout(this.hoverStopTimer);
      this.hoverStopTimer = undefined;
    }
    this.debouncedVideoProgress.cancel();
    this.loadAbortController?.abort();
    this.photoCleanup();
    this.videoCleanup();
    this.intersectionObserver?.disconnect();
    this.eventManager.destroy();
    this.stateManager.destroy();
    this.video.pause();
    this.video.src = '';
    this.video.load();
    this.photo.src = '';
    this.container.remove();
  }

  public getState(): Readonly<LivePhotoState> {
    return this.stateManager.getState();
  }

  // ─── 私有工具 ─────────────────────────────────────────────────────────────

  private mergeCustomization(
    customization?: ElementCustomization,
    borderRadius?: number | string
  ): ElementCustomization | undefined {
    if (!borderRadius && !customization) return customization;
    const merged: ElementCustomization = {
      ...customization,
      styles: { ...customization?.styles },
    };
    if (borderRadius && !customization?.styles?.borderRadius) {
      const value = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;
      merged.styles!.borderRadius = value;
    }
    return merged;
  }
}

// 浏览器全局挂载
if (typeof window !== 'undefined') {
  window.LivePhotoViewer = LivePhotoViewer;
}
