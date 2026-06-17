import type { LivePhotoLabels } from '../types';

/**
 * Built-in locale label presets.
 * Add more locales here as needed.
 */
export const LOCALE_LABELS: Record<string, LivePhotoLabels> = {
  'zh-CN': {
    live: '实况',
    enableAutoplay: '开启自动播放',
    disableAutoplay: '关闭自动播放',
    mute: '静音',
    unmute: '开启声音',
  },
  'en': {
    live: 'LIVE',
    enableAutoplay: 'Enable autoplay',
    disableAutoplay: 'Disable autoplay',
    mute: 'Mute',
    unmute: 'Unmute',
  },
};

export const DEFAULT_LOCALE = 'zh-CN';

/**
 * Resolve the final labels by merging, in order of precedence:
 * built-in default locale < requested locale preset < custom labels override.
 */
export function resolveLabels(
  locale?: string,
  labels?: Partial<LivePhotoLabels>
): LivePhotoLabels {
  const base = LOCALE_LABELS[DEFAULT_LOCALE];
  const localePreset = (locale && LOCALE_LABELS[locale]) || base;

  return {
    ...base,
    ...localePreset,
    ...labels,
  };
}
