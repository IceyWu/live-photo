import "./LivePhotoViewer.css";
import { arrowIcon, errorIcon, createProgressLiveIcon } from "./icons";

export interface ElementCustomization {
  attributes?: { [key: string]: string }; // HTML 属性
  styles?: { [key: string]: string }; // CSS 样式
}

export interface LivePhotoOptions {
  photoSrc: string;
  videoSrc: string;
  container: HTMLElement;
  width?: number | string;
  height?: number | string;
  autoplay?: boolean;
  lazyLoadVideo?: boolean;
  imageCustomization?: ElementCustomization; // 图片自定义配置
  videoCustomization?: ElementCustomization; // 视频自定义配置
  onCanPlay?: () => void;
  onError?: (e?: any) => void;
  onEnded?: () => void;
  onVideoLoad?: () => void;
  onPhotoLoad?: () => void;
  onProgress?: (progress: number) => void;
}

export class LivePhotoViewer {
  private readonly photo: HTMLImageElement;
  private readonly video: HTMLVideoElement;
  private readonly container: HTMLElement;
  private readonly badge: HTMLDivElement;
  private readonly dropMenu: HTMLDivElement;
  private readonly progressBar: HTMLDivElement; // 新增：进度条元素
  private isPlaying: boolean = false;
  private autoplay: boolean = false;
  private videoError: boolean = false;
  private touchTimeout?: number;
  private videoLoaded: boolean = false; // 新增：标记视频是否已加载
  private videoSrc?: string = "";
  private aspectRatio: number = 1; // 新增：存储图片实际宽高比

  constructor(options: LivePhotoOptions) {
    this.autoplay = options.autoplay ?? true;
    this.container = this.createContainer(options);
    this.photo = this.createPhoto(options);
    this.video = this.createVideo(options);
    this.badge = this.createBadge();
    this.dropMenu = this.createDropMenu();
    this.progressBar = this.createProgressBar();
    this.container.appendChild(this.progressBar);

    this.container.appendChild(this.photo);
    this.container.appendChild(this.video);
    this.container.appendChild(this.badge);
    this.container.appendChild(this.dropMenu);
    options.container.appendChild(this.container);

    this.touchTimeout = undefined;
    this.videoSrc = options.videoSrc || "";

    this.init(options);
  }
  private createProgressBar(): HTMLDivElement {
    const progressBar = document.createElement("div");
    progressBar.className = "live-photo-progress";
    progressBar.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: #fff;
      transition: width 0.2s;
      opacity: 0;
    `;
    return progressBar;
  }

  private createContainer(options: LivePhotoOptions): HTMLElement {
    const container = document.createElement("div");
    container.className = "live-photo-container";
    
    // 先设置已知的尺寸
    if (options.width) {
      const width = typeof options.width === 'number' ? `${options.width}px` : options.width;
      container.style.width = width;
    }
    
    if (options.height) {
      const height = typeof options.height === 'number' ? `${options.height}px` : options.height;
      container.style.height = height;
    }

    // 如果都没设置，使用默认值
    if (!options.width && !options.height) {
      container.style.width = '300px';
      container.style.height = '300px';
    }
    
    return container;
  }

  private createPhoto(options: LivePhotoOptions): HTMLImageElement {
    const photo = new Image();
    photo.src = options.photoSrc;
    photo.className = "live-photo-image";

    // 图片加载完成后获取实际宽高比并更新容器尺寸
    photo.addEventListener("load", () => {
      this.aspectRatio = photo.naturalWidth / photo.naturalHeight;
      this.updateContainerSize();
      options.onPhotoLoad?.();
    });

    // 应用自定义样式和属性
    if (options.imageCustomization) {
      // 应用样式
      if (options.imageCustomization.styles) {
        for (const prop in options.imageCustomization.styles) {
          photo.style[prop as any] = options.imageCustomization.styles[prop];
        }
      }

      // 应用属性
      if (options.imageCustomization.attributes) {
        for (const key in options.imageCustomization.attributes) {
          photo.setAttribute(key, options.imageCustomization.attributes[key]);
        }
      }
    }

    photo.addEventListener("error", () =>
      options.onError?.(new Error("Photo load error"))
    );
    this.addPreventDefaultListeners(photo);
    return photo;
  }
  private updateBadgeProgress(progress: number): void {
    if (this.badge) {
      const iconHtml = createProgressLiveIcon(progress, !this.autoplay);

      // 保留原有的 LIVE 文本和箭头
      this.badge.innerHTML = `
        ${iconHtml}
        <span class="live-text">LIVE</span>
        <span class="chevron">${arrowIcon}</span>
      `;
    }
  }

  private createVideo(options: LivePhotoOptions): HTMLVideoElement {
    const video = document.createElement("video");
    const defaultVideoAttributes = {
      loop: false,
      muted: true,
      playsInline: true,
      className: "live-photo-video",
    };

    // 应用默认属性
    for (const key in defaultVideoAttributes) {
      (video as any)[key] =
        defaultVideoAttributes[key as keyof typeof defaultVideoAttributes];
    }

    // 应用自定义样式和属性
    if (options.videoCustomization) {
      // 应用样式
      if (options.videoCustomization.styles) {
        for (const prop in options.videoCustomization.styles) {
          video.style[prop as any] = options.videoCustomization.styles[prop];
        }
      }

      // 应用属性
      if (options.videoCustomization.attributes) {
        for (const key in options.videoCustomization.attributes) {
          video.setAttribute(key, options.videoCustomization.attributes[key]);
        }
      }
    }

    // 只有在非延迟加载模式下才立即设置视频源
    if (!options.lazyLoadVideo) {
      video.src = options.videoSrc;
    }

    let lastProgress = 0;
    video.addEventListener("progress", () => {
      if (video.buffered.length > 0) {
        const progress = Math.floor(
          (video.buffered.end(0) / video.duration) * 100
        );
        // 只在进度发生实际变化时更新
        if (progress !== lastProgress) {
          lastProgress = progress;
          this.updateBadgeProgress(progress);
          options.onProgress?.(progress);

          // 加载完成后恢复原始图标
          if (progress >= 100) {
            setTimeout(() => {
              this.updateBadge();
            }, 500);
          }
        }
      }
    });

    // 添加更多进度事件监听
    video.addEventListener("loadeddata", () => {
      if (video.buffered.length > 0) {
        const progress = Math.floor(
          (video.buffered.end(0) / video.duration) * 100
        );
        this.updateBadgeProgress(progress);
      }
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
    badge.innerHTML = createProgressLiveIcon(100, !this.autoplay);

    const span = document.createElement("span");
    const spanChevron = document.createElement("span");
    span.className = "live-text";
    span.innerText = "LIVE";
    spanChevron.className = "chevron";
    spanChevron.innerHTML = arrowIcon;
    badge.appendChild(span);
    badge.appendChild(spanChevron);

    badge.style.transition = "width 0.3s";
    badge.addEventListener("click", () => {
      this.toggleAutoplay();
    });

    return badge;
  }
  private createDropMenu(): HTMLDivElement {
    const controlButton = document.createElement("div");
    controlButton.className = "dropdown-menu";
    const ctrBtn = document.createElement("button");
    ctrBtn.id = "toggle-autoplay";
    ctrBtn.innerHTML = this.autoplay ? "关闭自动播放" : "开启自动播放";
    controlButton.append(ctrBtn);

    ctrBtn?.addEventListener("click", (e) => {
      e.stopPropagation();

      this.autoplay = !this.autoplay;
      const button = document.getElementById("toggle-autoplay");
      if (button) {
        button.textContent = this.autoplay ? "关闭自动播放" : "开启自动播放";
        this.updateBadge();
      }
      this.toggleAutoplay();
      this.autoplay ? this.play() : this.stop();
    });

    return controlButton;
  }

  private updateBadge(): void {
    this.badge.innerHTML = `
        ${createProgressLiveIcon(100, !this.autoplay)}
        <span class="live-text">LIVE</span>
        <span class="chevron">${arrowIcon}</span>
    `;
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
        if (!this.videoError) {
          this.play();
        }
      });

      this.badge.addEventListener("mouseleave", () => {
        if (!this.videoError) {
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
        if (!this.videoLoaded && !this.video.src) {
          this.progressBar.style.opacity = "1";
          this.updateBadgeProgress(0);
          this.video.src = this.videoSrc ?? "";
        }
        this.isPlaying = true;
        this.video.currentTime = 0;
        this.updateBadge();
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
      // this.video.currentTime = 0;
      this.container.classList.remove("playing");
      this.photo.style.opacity = "1";
    }
  }

  private handleError(error: Error, callback?: (e?: any) => void): void {
    callback?.(error);
  }

  // 新增：更新容器尺寸的方法
  private updateContainerSize(): void {
    // 获取当前容器的计算样式
    const computedStyle = window.getComputedStyle(this.container);
    const currentWidth = parseFloat(computedStyle.width);
    const currentHeight = parseFloat(computedStyle.height);

    // 只设置了宽度，根据宽高比计算高度
    if (this.container.style.width && !this.container.style.height) {
      this.container.style.height = `${currentWidth / this.aspectRatio}px`;
    }
    
    // 只设置了高度，根据宽高比计算宽度
    if (this.container.style.height && !this.container.style.width) {
      this.container.style.width = `${currentHeight * this.aspectRatio}px`;
    }
  }
}

// Export to window object for browser use
(window as any).LivePhotoViewer = LivePhotoViewer;
