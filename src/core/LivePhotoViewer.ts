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
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private container: HTMLElement;
  private badge: HTMLDivElement;
  private dropdownMenu: HTMLDivElement;
  private photo: HTMLImageElement;
  private video: HTMLVideoElement;
  private isPlaying: boolean = false;
  private autoplay: boolean = false;
  private videoError: boolean = false;
  private touchTimeout: number | undefined;
  private width: number;
  private height: number;
  private transitionAlpha: number = 0;
  private isTransitioning: boolean = false;
  private animationFrameId: number | null = null;

  constructor(options: LivePhotoOptions) {
    this.width = options.width || 300;
    this.height = options.height || 300;
    this.autoplay = options.autoplay ?? true;
    this.container = this.createContainer(options);
    this.canvas = this.createCanvas();
    this.ctx = this.canvas.getContext("2d")!;
    this.badge = this.createBadge();
    this.dropdownMenu = this.createDropdownMenu();
    this.photo = this.createPhoto(options);
    this.video = this.createVideo(options);

    this.container.appendChild(this.canvas);
    this.container.appendChild(this.badge);
    this.container.appendChild(this.dropdownMenu);
    options.container.appendChild(this.container);

    this.touchTimeout = undefined;

    this.init(options);
    this.updateBadgeIcon(); // 确保初始化时更新图标
  }

  private createContainer(options: LivePhotoOptions): HTMLElement {
    const container = document.createElement("div");
    container.className = "live-photo-container";
    container.style.width = `${this.width}px`;
    container.style.height = `${this.height}px`;
    container.style.position = "relative";
    container.style.overflow = "hidden";
    return container;
  }

  private createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    return canvas;
  }

  private createBadge(): HTMLDivElement {
    const badge = document.createElement("div");
    badge.className = "live-photo-badge";
    badge.innerHTML = `
    <span class="live-icon"></span>
    <span class="live-text">LIVE</span>
    <span class="chevron">
      ${arrowIcon}
    </span>
  `;
    badge.style.position = "absolute";
    badge.style.top = "16px";
    badge.style.left = "16px";
    badge.style.zIndex = "10";
    badge.style.cursor = "pointer";
    badge.style.userSelect = "none"; // 添加这一行
    badge.style.webkitUserSelect = "none"; // 添加这一行
    badge.style.msUserSelect = "none"; // 添加这一行
    badge.addEventListener("touchstart", (event) => {
      event.preventDefault();
    });
    badge.addEventListener("mousedown", (event) => {
      event.preventDefault();
    });
    badge.addEventListener("selectstart", (event) => {
      event.preventDefault();
    });
    badge.addEventListener("touchmove", (event) => {
      event.preventDefault();
    });
    badge.addEventListener("touchend", (event) => {
      event.preventDefault();
    });
    return badge;
  }

  private createDropdownMenu(): HTMLDivElement {
    const dropdownMenu = document.createElement("div");
    dropdownMenu.className = "dropdown-menu";
    dropdownMenu.innerHTML = `<button id="toggle-autoplay">开启自动播放</button>`;
    dropdownMenu.style.display = "none";
    dropdownMenu.style.position = "absolute";
    dropdownMenu.style.top = "50px";
    dropdownMenu.style.left = "16px";
    dropdownMenu.style.zIndex = "11";
    return dropdownMenu;
  }

  private createPhoto(options: LivePhotoOptions): HTMLImageElement {
    const photo = new Image();
    photo.src = options.photoSrc;
    // object-fit: cover
    // photo.style.width = "100%";
    // photo.style.height = "100%";
    photo.style.objectFit = "cover";
    photo.style.userSelect = "none"; // 添加这一行
    photo.style.touchAction = "manipulation";

    photo.onload = () => {
      this.drawPhoto();
      if (options.onPhotoLoad) options.onPhotoLoad();
    };
    photo.onerror = () => {
      if (options.onError) options.onError(new Error("Photo load error"));
    };
    photo.addEventListener("touchstart", (event) => {
      event.preventDefault();
    });
    photo.addEventListener("mousedown", (event) => {
      event.preventDefault();
    });
    photo.addEventListener("selectstart", (event) => {
      event.preventDefault();
    });
    photo.addEventListener("touchmove", (event) => {
      event.preventDefault();
    });
    photo.addEventListener("touchend", (event) => {
      event.preventDefault();
    });
    return photo;
  }

  private createVideo(options: LivePhotoOptions): HTMLVideoElement {
    const video = document.createElement("video");
    video.src = options.videoSrc;
    video.loop = false;
    video.muted = true;
    video.style.objectFit = "cover";
    video.addEventListener("canplay", () => {
      if (options.onCanPlay) options.onCanPlay();
    });
    video.addEventListener("ended", () => {
      if (!video.loop) {
        this.stop();
        this.isPlaying = false;
        if (options.onEnded) options.onEnded();
      }
    });
    video.addEventListener("loadeddata", () => {
      if (options.onVideoLoad) options.onVideoLoad();
    });
    video.addEventListener("error", () => {
      this.videoError = true;
      this.isPlaying = false;
      this.badge.innerHTML = errorIcon;
      if (options.onError) options.onError(new Error("Video load error"));
    });
    video.style.userSelect = "none"; // 添加这一行
    video.playsInline = true;
    video.style.touchAction = "manipulation";

    video.addEventListener("touchstart", (event) => {
      event.preventDefault();
    });
    video.addEventListener("mousedown", (event) => {
      event.preventDefault();
    });
    video.addEventListener("selectstart", (event) => {
      event.preventDefault();
    });
    video.addEventListener("touchmove", (event) => {
      event.preventDefault();
    });
    video.addEventListener("touchend", (event) => {
      event.preventDefault();
    });
    return video;
  }

  private drawPhoto(): void {
    this.ctx.clearRect(0, 0, this.width, this.height); // 清除画布
    this.ctx.drawImage(this.photo, 0, 0, this.width, this.height);
  }

  private drawVideo(): void {
    this.ctx.drawImage(this.video, 0, 0, this.width, this.height);
  }

  private init(options: LivePhotoOptions): void {
    this.updateBadgeIcon(); // 确保在初始化时更新图标

    if (this.autoplay) {
      this.play();
    }

    this.badge.addEventListener("click", this.toggleDropdownMenu.bind(this));

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
        if (!this.isPlaying && !this.videoError) {
          this.play();
        }
      });

      this.badge.addEventListener("mouseleave", () => {
        if (!this.videoError) {
          this.stop();
        }
      });
    }

    document
      .getElementById("toggle-autoplay")
      ?.addEventListener("click", () => {
        this.toggleAutoplay();
        this.hideDropdownMenu();
      });
  }

  private toggleDropdownMenu(): void {
    if (this.videoError) return;
    if (this.dropdownMenu.style.display === "none") {
      this.dropdownMenu.style.display = "block";
    } else {
      this.hideDropdownMenu();
    }
  }

  private hideDropdownMenu(): void {
    this.dropdownMenu.style.display = "none";
  }

  private toggleAutoplay(): void {
    this.autoplay = !this.autoplay;
    const button = document.getElementById("toggle-autoplay");
    if (button) {
      button.textContent = this.autoplay ? "关闭自动播放" : "开启自动播放";
    }
    if (this.autoplay) {
      this.play();
    } else {
      this.stop();
    }
    this.updateBadgeIcon();
  }

  private updateBadgeIcon(): void {
    const iconElement = this.badge.querySelector(".live-icon");
    if (iconElement) {
      iconElement.innerHTML = this.autoplay ? liveIcon : liveIconNoAutoPlay;
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
    }, 500);
  }

  private handleTouchEnd(): void {
    clearTimeout(this.touchTimeout);
    if (!this.autoplay && !this.videoError) {
      this.stop();
    }
  }

  public play(): void {
    if (!this.isPlaying && !this.videoError) {
      this.isPlaying = true;
      this.video.currentTime = 0;
      this.video.play();

      // 兼容iOS和安卓的震动逻辑
      // if (typeof window === "object" && "vibrate" in navigator) {
      //   if (navigator.vibrate) {
      //     const vibrationPattern = [200];
      //     navigator.vibrate(vibrationPattern);
      //   }
      // } else if (typeof window === "object" && "webkit" in window) {
      //   // iOS 10+ 支持的HapticFeedback
      //   const haptic = new (window as any).UIImpactFeedbackGenerator(
      //     (window as any).UIImpactFeedbackStyleMedium
      //   );
      //   haptic.impactOccurred();
      // }

      this.startTransition(true);
    }
  }

  public pause(): void {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.video.pause();
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
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
      this.startTransition(false);
    }
  }

  private startTransition(toVideo: boolean): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.transitionAlpha = toVideo ? 0 : 1;
    this.animateTransition(toVideo);
  }

  private animateTransition(toVideo: boolean): void {
    const animate = () => {
      if (toVideo) {
        this.transitionAlpha += 0.05;
      } else {
        this.transitionAlpha -= 0.05;
      }

      this.ctx.clearRect(0, 0, this.width, this.height);
      this.drawPhoto();
      this.ctx.globalAlpha = this.transitionAlpha;
      this.drawVideo();
      this.ctx.globalAlpha = 1;

      if (
        (toVideo && this.transitionAlpha < 1) ||
        (!toVideo && this.transitionAlpha > 0)
      ) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.isTransitioning = false;
        if (!toVideo) {
          this.ctx.clearRect(0, 0, this.width, this.height);
          this.drawPhoto();
        } else {
          this.continuePlayback();
        }
      }
    };

    animate();
  }

  private continuePlayback(): void {
    const updateCanvas = () => {
      if (this.isPlaying) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawVideo();
        this.animationFrameId = requestAnimationFrame(updateCanvas);
      }
    };

    updateCanvas();
  }
}

// Export to window object for browser use
(window as any).LivePhotoViewer = LivePhotoViewer;
