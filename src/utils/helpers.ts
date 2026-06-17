// IS_MOBILE：用触摸能力检测替代 UA 嗅探，iPad 等设备也能正确识别
export const IS_MOBILE: boolean = (() => {
  if (typeof window === 'undefined') return false;
  // 优先用触摸 API 判断（覆盖 iPad、平板等现代设备）
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return true;
  // 兜底：UA 判断（老设备）
  return /Mobi|Android/i.test(navigator.userAgent);
})();

export function createLivePhotoError(
  type: 'VIDEO_LOAD_ERROR' | 'PHOTO_LOAD_ERROR' | 'PLAYBACK_ERROR' | 'VALIDATION_ERROR',
  message: string,
  originalError?: Error
) {
  return { type, message, originalError };
}
