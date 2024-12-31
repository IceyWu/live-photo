import "./LivePhotoViewer.css";
import { liveIcon, liveIconNoAutoPlay, arrowIcon, errorIcon } from "./icons";

export interface LivePhotoOptions {
  photoSrc: string;
  videoSrc: string;
  container: HTMLElement;
  width?: number;
  height?: number;
  autoplay?: boolean;
  onCanPlay?: () => void;
  onError?: (e?: any) => void;
  onEnded?: () => void;
  onVideoLoad?: () => void;
  onPhotoLoad?: () => void;
}

export class LivePhotoViewer {
  private photo: HTMLImageElement;
  private video: HTMLVideoElement;
  private container: HTMLElement;
  private badge: HTMLDivElement;
  private dropMenu: HTMLDivElement;
  private isPlaying: boolean = false;
  private autoplay: boolean = false;
  private videoError: boolean = false;
  private touchTimeout: number | undefined;

  constructor(options: LivePhotoOptions) {
    this.autoplay = options.autoplay ?? true;
    this.container = this.createContainer(options);
    this.photo = this.createPhoto(options);
    this.video = this.createVideo(options);
    this.badge = this.createBadge();
    this.dropMenu = this.createDropMenu();

    this.container.appendChild(this.photo);
    this.container.appendChild(this.video);
    this.container.appendChild(this.badge);
    this.container.appendChild(this.dropMenu);
    options.container.appendChild(this.container);

    this.touchTimeout = undefined;

    this.init(options);
  }

  private createContainer(options: LivePhotoOptions): HTMLElement {
    const container = document.createElement("div");
    container.className = "live-photo-container";
    container.style.width = `${options.width || 300}px`;
    container.style.height = `${options.height || 300}px`;
    return container;
  }

  private createPhoto(options: LivePhotoOptions): HTMLImageElement {
    const photo = new Image();
    photo.src = options.photoSrc;
    photo.className = "live-photo-image";
    photo.addEventListener("load", () => options.onPhotoLoad?.());
    photo.addEventListener("error", () =>
      options.onError?.(new Error("Photo load error"))
    );
    this.addPreventDefaultListeners(photo);
    return photo;
  }

  private createVideo(options: LivePhotoOptions): HTMLVideoElement {
    const video = document.createElement("video");
    video.src = options.videoSrc;
    video.loop = false;
    video.muted = true;
    video.playsInline = true;
    video.className = "live-photo-video";
    video.addEventListener("canplay", () => options.onCanPlay?.());
    video.addEventListener("ended", () => {
      if (!video.loop) {
        this.stop();
        this.isPlaying = false;
        this.container.classList.remove("playing");
        this.autoplay = false;
        options.onEnded?.();
      }
    });
    video.addEventListener("loadeddata", () => options.onVideoLoad?.());
    video.addEventListener("error", () => {
      video.style.display = "none";
      this.videoError = true;
      this.badge.innerHTML = errorIcon;
      this.container.classList.remove("playing");
      options.onError?.(new Error("Video load error"));
    });
    this.addPreventDefaultListeners(video);
    return video;
  }

  private createBadge(): HTMLDivElement {
    const badge = document.createElement("div");
    badge.className = "live-photo-badge";
    badge.innerHTML = this.autoplay ? liveIcon : liveIconNoAutoPlay;

    const span = document.createElement("span");
    const spanChevron = document.createElement("span");
    span.className = "live-text";
    span.innerText = "LIVE";
    spanChevron.className = "chevron";
    spanChevron.innerHTML = arrowIcon;
    badge.appendChild(span);
    badge.appendChild(spanChevron);

    badge.style.transition = "width 0.3s";
    badge.addEventListener("click", this.toggleAutoplay.bind(this));

    return badge;
  }
  private createDropMenu(): HTMLDivElement {
    const controlButton = document.createElement("div");
    controlButton.className = "dropdown-menu";
    const ctrBtn = document.createElement("button");
    ctrBtn.id = "toggle-autoplay";
    ctrBtn.innerHTML = `开启自动播放`;
    controlButton.append(ctrBtn);
    ctrBtn?.addEventListener("click", () => {
      this.autoplay = !this.autoplay;
      const button = document.getElementById("toggle-autoplay");
      if (button) {
        button.textContent = this.autoplay ? "关闭自动播放" : "开启自动播放";
        this.badge.innerHTML = this.autoplay ? liveIcon : liveIconNoAutoPlay;
        this.badge.innerHTML += `<span class="live-text">LIVE</span><span class="chevron">${arrowIcon}</span>`;
      }
      this.autoplay ? this.play() : this.stop();
      this.toggleAutoplay()
    });

    return controlButton;
  }

  private toggleAutoplay(): void {
    if (this.dropMenu.classList.contains("show")) {
      this.dropMenu.classList.remove("show");
    } else {
      this.dropMenu.classList.add("show");
    }
  }

  private isMobile(): boolean {
    return /Mobi|Android/i.test(navigator.userAgent);
  }

  private handleTouchStart(): void {
    this.touchTimeout = setTimeout(() => {
      if (!this.autoplay && !this.videoError) {
        this.play();
      }
    }, 500); // 长按 500ms
  }

  private handleTouchEnd(): void {
    clearTimeout(this.touchTimeout);
    if (!this.autoplay && !this.videoError) {
      this.stop();
    }
  }

  private init(options: LivePhotoOptions): void {
    if (this.autoplay) {
      this.play();
    }

    if (this.isMobile()) {
      this.container.addEventListener(
        "touchstart",
        this.handleTouchStart.bind(this)
      );
      this.container.addEventListener(
        "touchend",
        this.handleTouchEnd.bind(this)
      );
    } else {
      this.badge.addEventListener("mouseenter", () => {
        if (!this.autoplay && !this.videoError) {
          this.play();
        }
      });

      this.badge.addEventListener("mouseleave", () => {
        if (!this.autoplay && !this.videoError) {
          this.stop();
        }
      });
    }
  }

  private addPreventDefaultListeners(element: HTMLElement): void {
    element.style.userSelect = "none";
    element.style.touchAction = "manipulation";
    element.addEventListener("touchstart", this.preventDefault);
    element.addEventListener("mousedown", this.preventDefault);
    element.addEventListener("selectstart", this.preventDefault);
    element.addEventListener("touchmove", this.preventDefault);
    element.addEventListener("touchend", this.preventDefault);
  }

  private preventDefault(event: Event): void {
    event.preventDefault();
  }

  public play(): void {
    if (!this.isPlaying && !this.videoError) {
      this.isPlaying = true;
      this.video.currentTime = 0;
      this.video.play();

      if (navigator.vibrate) {
        navigator.vibrate(200); // 震动 200ms
      } else {
        // iOS 设备兼容处理
        // const silentAudio = new Audio(
        //   "data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCAAMEQAA=="
        // );
        // silentAudio.play().catch(() => {});
      }

      requestAnimationFrame(() => {
        this.container.classList.add("playing");
        this.photo.style.opacity = "0";
      });
    }
  }

  public pause(): void {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.video.pause();
      this.container.classList.remove("playing");
    }
  }

  public toggle(): void {
    this.isPlaying ? this.pause() : this.play();
  }

  public stop(): void {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.video.pause();
      this.video.currentTime = 0;
      this.container.classList.remove("playing");
      this.photo.style.opacity = "1";
    }
  }
}

// Export to window object for browser use
(window as any).LivePhotoViewer = LivePhotoViewer;
