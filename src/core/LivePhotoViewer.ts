import "./LivePhotoViewer.css";

export interface LivePhotoOptions {
  photoSrc: string;
  videoSrc: string;
  container: HTMLElement;
  width?: number;
  height?: number;
}

export class LivePhotoViewer {
  private photo: HTMLImageElement;
  private video: HTMLVideoElement;
  private container: HTMLElement;
  private badge: HTMLDivElement;
  private isPlaying: boolean = false;

  constructor(options: LivePhotoOptions) {
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

    this.video = document.createElement("video");
    this.video.src = options.videoSrc;
    this.video.loop = true;
    this.video.muted = true;
    this.video.className = "live-photo-video";

    this.badge = document.createElement("div");
    this.badge.className = "live-photo-badge";

    this.badge.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="live-icon">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
        <path d="M15.9 20.11l0 .01" />
        <path d="M19.04 17.61l0 .01" />
        <path d="M20.77 14l0 .01" />
        <path d="M20.77 10l0 .01" />
        <path d="M19.04 6.39l0 .01" />
        <path d="M15.9 3.89l0 .01" />
        <path d="M12 3l0 .01" />
        <path d="M8.1 3.89l0 .01" />
        <path d="M4.96 6.39l0 .01" />
        <path d="M3.23 10l0 .01" />
        <path d="M3.23 14l0 .01" />
        <path d="M4.96 17.61l0 .01" />
        <path d="M8.1 20.11l0 .01" />
        <path d="M12 21l0 .01" />
      </svg>
    `;

    const arrowIcon = `
   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="M16 22L6 12l1.4-1.4l8.6 8.6l8.6-8.6L26 12z"/></svg>
  `;
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
    this.badge.addEventListener("mouseenter", () => this.play());
    this.badge.addEventListener("mouseleave", () => {
      this.stop();
      const controlButton = document.querySelector(".dropdown-menu");
      controlButton?.remove();
    });
  }

  public play(): void {
    if (!this.isPlaying) {
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
      this.container.classList.remove("playing");
    }
  }
}

// Export to window object for browser use
(window as any).LivePhotoViewer = LivePhotoViewer;
