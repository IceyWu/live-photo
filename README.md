# live-photo

A zero-dependency Live Photo viewer for the web. Works with any framework or plain JavaScript.

**[中文文档](./README.zh-CN.md)** | [Live Demo](https://live-photo.netlify.app)

[![npm](https://img.shields.io/npm/v/live-photo?color=a1b858&label=)](https://www.npmjs.com/package/live-photo)
[![downloads](https://img.shields.io/npm/dm/live-photo?color=50a36f&label=)](https://www.npmjs.com/package/live-photo)

## Install

```bash
npm install live-photo
# pnpm add live-photo
# yarn add live-photo
```

## Quick Start

**CDN**
```html
<script src="https://fastly.jsdelivr.net/npm/live-photo@latest"></script>
<div id="container"></div>
<script>
  new LivePhotoViewer({
    photoSrc: 'photo.jpg',
    videoSrc: 'video.mp4',
    container: document.getElementById('container'),
  });
</script>
```

**ES Module**
```js
import { LivePhotoViewer } from 'live-photo';

const viewer = new LivePhotoViewer({
  photoSrc: 'photo.jpg',
  videoSrc: 'video.mp4',
  container: document.getElementById('container'),
});
```

→ More examples: [Vanilla JS](./docs/vanilla.md) · [Vue 3](./docs/vue.md) · [React](./docs/react.md)

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `photoSrc` | `string` | **required** | Photo URL |
| `videoSrc` | `string` | **required** | Video URL |
| `container` | `HTMLElement` | **required** | Mount target |
| `width` | `number \| string` | `300px` | Viewer width |
| `height` | `number \| string` | `300px` | Viewer height |
| `autoplay` | `boolean` | `true` | Play on hover (desktop) or long-press (mobile) |
| `lazyLoadVideo` | `boolean` | `false` | Load video only when in viewport |
| `longPressDelay` | `number` | `300` | Long-press threshold in ms (mobile) |
| `muted` | `boolean` | `true` | Start muted |
| `showMuteButton` | `boolean` | `true` | Show mute toggle in menu |
| `borderRadius` | `number \| string` | — | Container border radius |
| `theme` | `'light' \| 'dark' \| 'auto'` | — | UI color theme |
| `preload` | `'auto' \| 'metadata' \| 'none'` | `'metadata'` | Video preload strategy |
| `retryAttempts` | `number` | `3` | Retry count on load failure |
| `enableVibration` | `boolean` | `true` | Haptic feedback on play |
| `staticBadgeIcon` | `boolean` | `false` | Disable slash on badge icon |
| `locale` | `string` | `'zh-CN'` | UI language (`'zh-CN'` \| `'en'`) |
| `labels` | `Partial<LivePhotoLabels>` | — | Override individual UI strings |
| `storageKey` | `string` | — | localStorage key to persist autoplay/muted preferences |
| `imageCustomization` | `ElementCustomization` | — | Custom styles/attributes for the `<img>` |
| `videoCustomization` | `ElementCustomization` | — | Custom styles/attributes for the `<video>` |

```ts
interface ElementCustomization {
  styles?: Partial<CSSStyleDeclaration>;
  attributes?: Record<string, string>;
}
```

## Callbacks

| Callback | Signature | Trigger |
|----------|-----------|---------|
| `onPhotoLoad` | `(event, photo) => void` | Photo loaded |
| `onVideoLoad` | `(duration, event, video) => void` | Video metadata ready |
| `onCanPlay` | `(event, video) => void` | Video ready to play |
| `onLoadStart` | `() => void` | Video load begins (lazy mode) |
| `onLoadProgress` | `(loaded, total) => void` | Download progress |
| `onProgress` | `(progress, event, video) => void` | Buffer progress 0–100 |
| `onEnded` | `(event, video) => void` | Playback finished |
| `onClick` | `(event) => void` | Short click/tap |
| `onMutedChange` | `(muted, video) => void` | Mute state changed |
| `onError` | `(error, event?) => void` | Load or playback error |

```ts
interface LivePhotoError {
  type: 'VIDEO_LOAD_ERROR' | 'PHOTO_LOAD_ERROR' | 'PLAYBACK_ERROR' | 'VALIDATION_ERROR';
  message: string;
  originalError?: Error;
}
```

## Methods

```ts
viewer.play()        // Promise<void>
viewer.pause()       // void
viewer.stop()        // void — pause + reset to start + show photo
viewer.toggle()      // void
viewer.setMuted(v)   // void
viewer.toggleMute()  // void
viewer.getState()    // Readonly<LivePhotoState>
viewer.destroy()     // void — remove from DOM, clean up all resources
```

```ts
interface LivePhotoState {
  isPlaying: boolean;
  autoplay: boolean;
  muted: boolean;
  videoError: boolean;
  videoLoaded: boolean;
  isLongPressPlaying: boolean;
}
```

## Extract Live Photo

→ See [docs/extract.md](./docs/extract.md)

## i18n

→ See [docs/i18n.md](./docs/i18n.md)

## Styling

→ See [docs/styling.md](./docs/styling.md)

## CSS Variables

```css
:root {
  --live-photo-badge-bg: rgba(64, 64, 64, 0.5);
  --live-photo-badge-hover-bg: rgba(64, 64, 64, 0.7);
  --live-photo-text-color: #fff;
  --live-photo-border-radius: 12px;
  --live-photo-transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --live-photo-progress-height: 3px;
  --live-photo-progress-color: #fff;
  --live-photo-dropdown-bg: rgba(64, 64, 64, 0.25);
  --live-photo-dropdown-button-hover: rgba(64, 64, 64, 0.5);
}
```

## License

MIT © [Icey Wu](https://github.com/iceywu)
