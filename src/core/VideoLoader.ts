export class VideoLoader {
  private retryAttempts: number;
  private currentAttempt: number = 0;

  constructor(retryAttempts: number = 3) {
    this.retryAttempts = retryAttempts;
  }

  public async loadVideo(
    video: HTMLVideoElement,
    src: string,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<void> {
    this.currentAttempt = 0;

    while (this.currentAttempt < this.retryAttempts) {
      try {
        await this.attemptLoad(video, src, onProgress);
        return;
      } catch (error) {
        this.currentAttempt++;
        
        if (this.currentAttempt >= this.retryAttempts) {
          throw new Error(`Failed to load video after ${this.retryAttempts} attempts`);
        }

        // Exponential backoff
        await this.delay(1000 * Math.pow(2, this.currentAttempt - 1));
      }
    }
  }

  private attemptLoad(
    video: HTMLVideoElement,
    src: string,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const handleLoad = () => {
        cleanup();
        resolve();
      };

      const handleError = (e: Event) => {
        cleanup();
        reject(e);
      };

      const handleProgress = () => {
        if (video.buffered.length > 0 && onProgress) {
          const loaded = video.buffered.end(0);
          const total = video.duration;
          onProgress(loaded, total);
        }
      };

      const cleanup = () => {
        video.removeEventListener('loadeddata', handleLoad);
        video.removeEventListener('error', handleError);
        video.removeEventListener('progress', handleProgress);
      };

      video.addEventListener('loadeddata', handleLoad);
      video.addEventListener('error', handleError);
      video.addEventListener('progress', handleProgress);

      video.src = src;
      video.load();
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
