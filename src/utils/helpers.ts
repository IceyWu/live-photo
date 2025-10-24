export function isMobile(): boolean {
  return /Mobi|Android/i.test(navigator.userAgent);
}

export function createLivePhotoError(
  type: 'VIDEO_LOAD_ERROR' | 'PHOTO_LOAD_ERROR' | 'PLAYBACK_ERROR' | 'VALIDATION_ERROR',
  message: string,
  originalError?: Error
) {
  return {
    type,
    message,
    originalError,
  };
}
