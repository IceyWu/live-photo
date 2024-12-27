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
  private isPlaying: boolean = false;
  private autoplay: boolean = false;
  private videoError: boolean = false;

  constructor(options: LivePhotoOptions) {
    this.autoplay = options.autoplay || true;
    this.container = this.createContainer(options);
    this.photo = this.createPhoto(options);
    this.video = this.createVideo(options);
    this.badge = this.createBadge();

    this.container.appendChild(this.photo);
    this.container.appendChild(this.video);
    this.container.appendChild(this.badge);
    options.container.appendChild(this.container);

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
    photo.addEventListener("load", () => {
      if (options.onPhotoLoad) options.onPhotoLoad();
    });
    photo.addEventListener("error", () => {
      if (options.onError) options.onError(new Error("Photo load error"));
    });
    return photo;
  }

  private createVideo(options: LivePhotoOptions): HTMLVideoElement {
    const video = document.createElement("video");
    video.src = options.videoSrc;
    video.loop = false;
    video.muted = true;
    video.className = "live-photo-video";
    video.addEventListener("canplay", () => {
      if (options.onCanPlay) options.onCanPlay();
    });
    video.addEventListener("ended", () => {
      if (!video.loop) {
        this.stop();
        this.isPlaying = false;
        this.container.classList.remove("playing");
        this.autoplay = false;
        if (options.onEnded) options.onEnded();
      }
    });
    video.addEventListener("loadeddata", () => {
      if (options.onVideoLoad) options.onVideoLoad();
    });
    video.addEventListener("error", () => {
      video.style.display = "none";
      this.videoError = true;
      this.badge.innerHTML = errorIcon;
      if (options.onError) options.onError(new Error("Video load error"));
    });
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

  private toggleAutoplay(): void {
    const hasControlButton = document.querySelector(".dropdown-menu");
    if (hasControlButton) {
      hasControlButton.remove();
    } else {
      const controlButton = document.createElement("div");
      controlButton.className = "dropdown-menu";
      controlButton.innerHTML = `<button id="toggle-autoplay">开启自动播放</button>`;
      this.container.appendChild(controlButton);

      document.getElementById("toggle-autoplay")?.addEventListener("click", () => {
        this.autoplay = !this.autoplay;
        const button = document.getElementById("toggle-autoplay");
        if (button) {
          button.textContent = this.autoplay ? "关闭自动播放" : "开启自动播放";
          this.badge.innerHTML = this.autoplay ? liveIcon : liveIconNoAutoPlay;
        }
        if (this.autoplay) {
          this.play();
        } else {
          this.stop();
        }
      });
    }
  }

  private init(options: LivePhotoOptions): void {
    if (this.autoplay) {
      this.play();
    }

    this.badge.addEventListener("mouseenter", () => {
      if (!this.autoplay && !this.videoError) {
        this.play();
      }
    });

    this.badge.addEventListener("mouseleave", () => {
      if (!this.autoplay && !this.videoError) {
        this.stop();
      }
      const controlButton = document.querySelector(".dropdown-menu");
      controlButton?.remove();
    });
  }

  public play(): void {
    if (!this.isPlaying && !this.videoError) {
      this.isPlaying = true;
      this.video.currentTime = 0;
      this.video.play();
      this.container.classList.add("playing");
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
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public stop(): void {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.video.pause();
      this.video.currentTime = 0;
      this.container.classList.remove("playing");
    }
  }
}

// Export to window object for browser use
(window as any).LivePhotoViewer = LivePhotoViewer;