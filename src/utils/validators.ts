import type { LivePhotoOptions } from '../types';

export function validateOptions(options: LivePhotoOptions): void {
  if (!options.photoSrc) {
    throw new Error('photoSrc is required');
  }
  
  if (!options.videoSrc) {
    throw new Error('videoSrc is required');
  }
  
  if (!options.container || !(options.container instanceof HTMLElement)) {
    throw new Error('container must be a valid HTMLElement');
  }

  if (options.longPressDelay !== undefined && options.longPressDelay < 0) {
    throw new Error('longPressDelay must be a positive number');
  }

  if (options.retryAttempts !== undefined && options.retryAttempts < 1) {
    throw new Error('retryAttempts must be at least 1');
  }
}
