// Export main class
export { LivePhotoViewer } from './core/LivePhotoViewer';

// Export types
export type {
  LivePhotoOptions,
  ElementCustomization,
  LivePhotoState,
  LivePhotoError,
  LivePhotoAPI,
} from './types';

// Export extract utilities
export { extractFromLivePhoto } from './utils/livePhotoExtract';
export type { ExtractResult } from './utils/livePhotoExtract';
