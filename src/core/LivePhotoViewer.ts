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
  private readonly photo: HTMLImageElement;
  private readonly video: HTMLVideoElement;
  private readonly container: HTMLElement;
  private readonly badge: HTMLDivElement;
  private readonly dropMenu: HTMLDivElement;
  private isPlaying: boolean = false;
  private autoplay: boolean = false;
  private videoError: boolean = false;
  private touchTimeout?: number;

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
    const videoAttributes = {
      src: options.videoSrc,
      loop: false,
      muted: true,
      playsInline: true,
      className: "live-photo-video",
    };

    Object.entries(videoAttributes).forEach(([key, value]) => {
      video[key] = value;
    });

    video.addEventListener("loadedmetadata", () => {
      options.onCanPlay?.();
      options.onVideoLoad?.();
    });

    video.addEventListener("ended", () => this.handleVideoEnd(options));
    video.addEventListener("error", () => this.handleVideoError(options));

    this.addPreventDefaultListeners(video);
    return video;
  }

  private handleVideoEnd(options: LivePhotoOptions): void {
    if (!this.video.loop) {
      this.stop();
      this.isPlaying = false;
      this.container.classList.remove("playing");
      this.autoplay = false;
      options.onEnded?.();
    }
  }

  private handleVideoError(options: LivePhotoOptions): void {
    this.video.style.display = "none";
    this.videoError = true;
    this.badge.innerHTML = errorIcon;
    this.container.classList.remove("playing");
    this.handleError(new Error("Video load error"), options.onError);
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
    spanChevron.addEventListener("click", this.toggleAutoplay.bind(this));

    return badge;
  }
  private createDropMenu(): HTMLDivElement {
    const controlButton = document.createElement("div");
    controlButton.className = "dropdown-menu";
    const ctrBtn = document.createElement("button");
    ctrBtn.id = "toggle-autoplay";
    ctrBtn.innerHTML = `开启自动播放`;
    controlButton.append(ctrBtn);
    ctrBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.autoplay = !this.autoplay;
      const button = document.getElementById("toggle-autoplay");
      if (button) {
        button.textContent = this.autoplay ? "关闭自动播放" : "开启自动播放";
        this.badge.innerHTML = this.autoplay ? liveIcon : liveIconNoAutoPlay;
        this.badge.innerHTML += `<span class="live-text">LIVE</span><span class="chevron">${arrowIcon}</span>`;
      }
      this.autoplay ? this.play() : this.stop();
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

  public async play(): Promise<void> {
    if (!this.isPlaying && !this.videoError) {
      try {
        this.isPlaying = true;
        this.video.currentTime = 0;
        await this.video.play();

        if (navigator.vibrate) {
          navigator.vibrate(200);
        }

        requestAnimationFrame(() => {
          this.container.classList.add("playing");
          this.photo.style.opacity = "0";
        });
      } catch (error) {
        this.handleError(error as Error);
        this.stop();
      }
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

  private handleError(error: Error, callback?: (e?: any) => void): void {
    console.error("LivePhotoViewer Error:", error);
    callback?.(error);
  }
}

// Export to window object for browser use
(window as any).LivePhotoViewer = LivePhotoViewer;
