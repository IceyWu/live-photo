import "./LivePhotoViewer.css";
import { liveIcon, liveIconNoAutoPlay, arrowIcon, errorIcon } from "./icons";

export interface LivePhotoOptions {
  photoSrc: string;
  videoSrc: string;
  container: HTMLElement;
  width?: number;
  height?: number;
  autoplay?: boolean; // 新增自动播放参数
  onCanPlay?: () => void; // 新增事件回调
  onError?: (e?: any) => void; // 新增事件回调
  onEnded?: () => void; // 新增事件回调
  onVideoLoad?: () => void; // 新增事件回调
  onPhotoLoad?: () => void; // 新增事件回调
}

export class LivePhotoViewer {
  private photo: HTMLImageElement;
  private video: HTMLVideoElement;
  private container: HTMLElement;
  private badge: HTMLDivElement;
  private isPlaying: boolean = false;
  private autoplay: boolean = false;
  private videoError: boolean = false; // 新增视频加载错误状态

  constructor(options: LivePhotoOptions) {
    this.autoplay = options.autoplay || false; // 初始化自动播放状态

    document
      .getElementById("toggle-autoplay")
      ?.addEventListener("click", () => {
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
    this.container = document.createElement("div");
    this.container.className = "live-photo-container";
    this.container.style.width = `${options.width || 300}px`;
    this.container.style.height = `${options.height || 300}px`;
    this.container = document.createElement("div");
    this.container.className = "live-photo-container";
    this.container.style.width = `${options.width || 300}px`;
    this.container.style.height = `${options.height || 300}px`;

    this.photo = new Image();
    this.photo.src = options.photoSrc;
    this.photo.className = "live-photo-image";
    this.photo.addEventListener("load", () => {
      if (options.onPhotoLoad) options.onPhotoLoad();
    });
    this.photo.addEventListener("error", () => {
      if (options.onError) options.onError(new Error("Photo load error"));
    });

    this.video = document.createElement("video");
    this.video.src = options.videoSrc;
    this.video.loop = false;
    this.video.muted = true;
    this.video.className = "live-photo-video";
    this.video.addEventListener("canplay", () => {
      if (options.onCanPlay) options.onCanPlay();
    });
    this.video.addEventListener("ended", () => {
      if (!this.video.loop) {
        this.stop();
        this.isPlaying = false;
        this.container.classList.remove("playing");
        this.autoplay = false;
        if (options.onEnded) options.onEnded();
      }
    });
    this.video.addEventListener("loadeddata", () => {
      if (options.onVideoLoad) options.onVideoLoad();
    });
    this.video.addEventListener("error", () => {
      this.video.style.display = "none"; // 隐藏视频
      this.videoError = true; // 设置视频加载错误状态
      this.badge.innerHTML = errorIcon;
      if (options.onError) options.onError(new Error("Video load error"));
    });

    this.badge = document.createElement("div");
    this.badge.className = "live-photo-badge";

    this.badge.innerHTML = this.autoplay ? liveIcon : liveIconNoAutoPlay;

    const span = document.createElement("span");
    const spanChevron = document.createElement("span");
    // 类名
    span.className = "live-text";
    span.innerText = "LIVE";
    spanChevron.className = "chevron";
    spanChevron.innerHTML = arrowIcon;
    this.badge.appendChild(span);
    this.badge.appendChild(spanChevron);

    this.badge.style.transition = "width 0.3s";

    this.badge.addEventListener("click", () => {
      const hasControlButton = document.querySelector(".dropdown-menu");
      if (hasControlButton) {
        hasControlButton?.remove();
      } else {
        const controlButton = document.createElement("div");
        controlButton.className = "dropdown-menu";
        controlButton.innerHTML = `
        <button id="toggle-autoplay">开启自动播放</button>
      `;
        this.container.appendChild(controlButton);

        document
          .getElementById("toggle-autoplay")
          ?.addEventListener("click", () => {
            console.log("🌈-----click-----");
          });
      }
    });

    this.container.appendChild(this.photo);
    this.container.appendChild(this.video);
    this.container.appendChild(this.badge);

    options.container.appendChild(this.container);

    this.init();
  }

  private init(): void {
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

  public stop(): void {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.video.pause();
      this.video.currentTime = 0;
      this.container.classList.remove("playing");
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
}

// Export to window object for browser use
(window as any).LivePhotoViewer = LivePhotoViewer;
