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

  if (options.width !== undefined) {
    const w = typeof options.width === 'number' ? options.width : parseFloat(options.width as string);
    if (!isNaN(w) && w <= 0) throw new Error('width must be a positive value');
  }

  if (options.height !== undefined) {
    const h = typeof options.height === 'number' ? options.height : parseFloat(options.height as string);
    if (!isNaN(h) && h <= 0) throw new Error('height must be a positive value');
  }

  if (options.storageKey !== undefined) {
    if (typeof options.storageKey !== 'string' || options.storageKey.trim() === '') {
      throw new Error('storageKey must be a non-empty string');
    }
  }
}
