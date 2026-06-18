// Export main class
export { LivePhotoViewer } from './core/LivePhotoViewer';

// Export declarative auto-initialization (scan [data-live-photo] elements)
export { autoInit, AUTO_INIT_SELECTOR } from './core/autoInit';

// Export types
export type {
  LivePhotoOptions,
  ElementCustomization,
  LivePhotoState,
  LivePhotoError,
  LivePhotoAPI,
  LivePhotoLabels,
} from './types';

export type { LoadAbortController } from './core/VideoLoader';
export type { DebouncedFn } from './utils/debounce';

// Export i18n helpers
export { LOCALE_LABELS, DEFAULT_LOCALE, resolveLabels } from './core/i18n';

// Export storage helpers
export { loadPrefs, savePrefs } from './utils/storage';

// Export UI component functions (for custom UI integration)
export {
  createContainer,
  createPhoto,
  createVideo,
  createBadge,
  createDropMenu,
  createProgressBar,
  createOverlay,
  updateBadgeContent,
  updateAutoplayButton,
  updateMuteButton,
} from './core/UIComponents';

// Export extract utilities
export { extractFromLivePhoto } from './utils/livePhotoExtract';
export type { ExtractResult } from './utils/livePhotoExtract';
