import './LivePhotoViewer.css';

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
    this.container = document.createElement('div');
    this.container.className = 'live-photo-container';
    this.container.style.width = `${options.width || 300}px`;
    this.container.style.height = `${options.height || 300}px`;

    this.photo = new Image();
    this.photo.src = options.photoSrc;
    this.photo.className = 'live-photo-image';

    this.video = document.createElement('video');
    this.video.src = options.videoSrc;
    this.video.loop = true;
    this.video.muted = true;
    this.video.className = 'live-photo-video';

    this.badge = document.createElement('div');
    this.badge.className = 'live-photo-badge';
    this.badge.textContent = 'LIVE';

    this.container.appendChild(this.photo);
    this.container.appendChild(this.video);
    this.container.appendChild(this.badge);

    options.container.appendChild(this.container);

    this.init();
  }

  private init(): void {
    this.badge.addEventListener('mouseenter', () => this.play());
    this.badge.addEventListener('mouseleave', () => this.stop());
  }

  public play(): void {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.video.currentTime = 0;
      this.video.play();
      this.container.classList.add('playing');
    }
  }

  public stop(): void {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.video.pause();
      this.container.classList.remove('playing');
    }
  }
}

// Add styles
const style = document.createElement('style');
style.textContent = `
  .live-photo-container {
    position: relative;
    overflow: hidden;
  }
  .live-photo-image,
  .live-photo-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .live-photo-video {
    display: none;
  }
  .live-photo-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 4px;
    cursor: pointer;
  }
  .live-photo-container.playing .live-photo-video {
    display: block;
  }
  .live-photo-container.playing .live-photo-image {
    display: none;
  }
`;
document.head.appendChild(style);

// Export to window object for browser use
(window as any).LivePhotoViewer = LivePhotoViewer;

