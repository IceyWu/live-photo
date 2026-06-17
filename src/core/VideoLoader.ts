export interface LoadAbortController {
  abort(): void;
}

export class VideoLoader {
  private readonly retryAttempts: number;

  constructor(retryAttempts: number = 3) {
    this.retryAttempts = retryAttempts;
  }

  public loadVideo(
    video: HTMLVideoElement,
    src: string,
    onProgress?: (loaded: number, total: number) => void
  ): { promise: Promise<void>; controller: LoadAbortController } {
    // 用闭包变量，每次调用完全独立，互不干扰
    let aborted = false;
    let currentAttempt = 0;
    const maxAttempts = this.retryAttempts;

    const controller: LoadAbortController = {
      abort: () => { aborted = true; },
    };

    const promise = (async () => {
      while (currentAttempt < maxAttempts) {
        if (aborted) return;

        try {
          await this.attemptLoad(video, src, onProgress);
          return;
        } catch (error) {
          if (aborted) return;
          currentAttempt++;
          if (currentAttempt >= maxAttempts) {
            throw new Error(`Failed to load video after ${maxAttempts} attempts`);
          }
          await new Promise<void>(resolve => setTimeout(resolve, 1000 * Math.pow(2, currentAttempt - 1)));
        }
      }
    })();

    return { promise, controller };
  }

  private attemptLoad(
    video: HTMLVideoElement,
    src: string,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const handleLoad = () => { cleanup(); resolve(); };
      const handleError = (e: Event) => { cleanup(); reject(e); };
      const handleProgress = () => {
        if (video.buffered.length > 0 && onProgress) {
          onProgress(video.buffered.end(0), video.duration);
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
}
