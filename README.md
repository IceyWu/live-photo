<h1 align="center">
  <br>
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" rx="16" fill="#4F46E5"/>
    <path d="M85 45H73L70.2 40.4C69.9331 39.9011 69.5539 39.4752 69.0953 39.1581C68.6367 38.841 68.1119 38.6417 67.57 38.575C67.3808 38.5461 67.1905 38.5273 67 38.519H53C52.8095 38.5273 52.6192 38.5461 52.43 38.575C51.8881 38.6417 51.3633 38.841 50.9047 39.1581C50.4461 39.4752 50.0669 39.9011 49.8 40.4L47 45H35C33.6739 45 32.4021 45.5268 31.4645 46.4645C30.5268 47.4021 30 48.6739 30 50V80C30 81.3261 30.5268 82.5979 31.4645 83.5355C32.4021 84.4732 33.6739 85 35 85H85C86.3261 85 87.5979 84.4732 88.5355 83.5355C89.4732 82.5979 90 81.3261 90 80V50C90 48.6739 89.4732 47.4021 88.5355 46.4645C87.5979 45.5268 86.3261 45 85 45ZM60 77.5C57.0333 77.5 54.1332 76.7082 51.6665 75.2248C49.1997 73.7414 47.2771 71.6277 46.1418 69.1385C45.0065 66.6493 44.7094 63.8916 45.2882 61.2295C45.8669 58.5673 47.2956 56.1307 49.3934 54.2582C51.4912 52.3857 54.1939 51.1055 57.1477 50.5843C60.1015 50.0631 63.1599 50.3289 65.9107 51.3503C68.6615 52.3717 70.9927 54.1022 72.6265 56.3265C74.2604 58.5507 75.1111 61.1701 75.1111 63.8333C75.1111 67.4674 73.4493 70.9534 70.4877 73.5702C67.5261 76.187 63.5768 77.6667 59.4444 77.6667L60 77.5Z" fill="white"/>
    <circle cx="60" cy="64" r="12" fill="#4F46E5" stroke="white" stroke-width="3"/>
  </svg>
  <br>
  live-photo
  <br>
</h1>

<p align="center">🚀 A powerful and lightweight Live Photo web viewer component that brings iOS-style Live Photos experience to the web.</p>

<p align="center">
<a href="https://www.npmjs.com/package/live-photo" target="__blank"><img src="https://img.shields.io/npm/v/live-photo?color=a1b858&label=" alt="NPM version"></a>
<a href="https://www.npmjs.com/package/live-photo" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/live-photo?color=50a36f&label="></a>
</p>

**English** | [中文](./README.zh-CN.md)

## ✨ Features

- 🎯 **Zero Dependencies** - Lightweight implementation with no external dependencies
- 📱 **Cross-Platform** - Seamless support for both mobile (touch) and desktop (mouse) interactions
- 🖼️ **Smart Media Handling** - Automatic switching between photo and video with smooth transitions
- 🎨 **Highly Customizable** - Flexible styling and configuration options for both image and video elements
- 🔄 **Advanced Loading** - Support for lazy loading and progressive video loading with visual feedback
- ⚡ **Performance Optimized** - Efficient resource management and clean-up mechanisms
- 🎮 **Rich API** - Comprehensive public methods and event callbacks for full control
- 🎭 **Interactive Experience** - Long-press to play, click detection, auto-play modes, and haptic feedback
- � **State Management** - Built-in state tracking and subscription system
- 🛡️ **Type Safe** - Full TypeScript support with complete type definitions
- 🎪 **Framework Agnostic** - Works with vanilla JavaScript, Vue, React, Angular, and more

## 📦 Installation

```bash
npm install live-photo
# or
pnpm add live-photo
# or
yarn add live-photo
# or
bun add live-photo
```

## 🚀 Quick Start

### Browser (CDN)

```html
<script src="https://fastly.jsdelivr.net/npm/live-photo@latest"></script>

<div id="live-photo-container"></div>

<script>
  new LivePhotoViewer({
    photoSrc: 'path/to/photo.jpg',
    videoSrc: 'path/to/video.mp4',
    container: document.getElementById('live-photo-container'),
  });
</script>
```

### ES Module

```javascript
import { LivePhotoViewer } from 'live-photo';

const viewer = new LivePhotoViewer({
  photoSrc: 'path/to/photo.jpg',
  videoSrc: 'path/to/video.mp4',
  container: document.getElementById('live-photo-container'),
});
```

## 📖 API Reference

### Configuration Options

| Parameter          | Type                       | Required | Default | Description                                                              |
| ------------------ | -------------------------- | -------- | ------- | ------------------------------------------------------------------------ |
| photoSrc           | string                     | ✅       | -       | URL of the static image to display                                      |
| videoSrc           | string                     | ✅       | -       | URL of the video to play on interaction                                 |
| container          | HTMLElement                | ✅       | -       | DOM element to mount the viewer                                          |
| width              | number \| string           | ❌       | `300px` | Width of the viewer (supports px, %, vh, vw, etc.)                       |
| height             | number \| string           | ❌       | `300px` | Height of the viewer (supports px, %, vh, vw, etc.)                      |
| autoplay           | boolean                    | ❌       | `true`  | Enable automatic video playback on hover (desktop) or long-press (mobile)|
| lazyLoadVideo      | boolean                    | ❌       | `false` | Delay video loading until viewer is in viewport                         |
| longPressDelay     | number                     | ❌       | `300`   | Time threshold (ms) to distinguish between click and long-press          |
| borderRadius       | number \| string           | ❌       | -       | Border radius for the container (supports px, %, rem, etc.)              |
| theme              | 'light' \| 'dark' \| 'auto'| ❌       | -       | Color theme for UI elements                                              |
| preload            | 'auto' \| 'metadata' \| 'none' | ❌  | -       | Video preload strategy                                                   |
| retryAttempts      | number                     | ❌       | `3`     | Number of retry attempts for failed video loads                          |
| enableVibration    | boolean                    | ❌       | `true`  | Enable haptic feedback on supported devices                              |
| staticBadgeIcon    | boolean                    | ❌       | `false` | Keep badge icon static (no slash) regardless of autoplay state           |
| imageCustomization | ElementCustomization       | ❌       | -       | Custom attributes and styles for the image element                       |
| videoCustomization | ElementCustomization       | ❌       | -       | Custom attributes and styles for the video element                       |

### ElementCustomization Interface

```typescript
interface ElementCustomization {
  attributes?: Record<string, string>;  // HTML attributes (e.g., { alt: "...", loading: "lazy" })
  styles?: Partial<CSSStyleDeclaration>; // CSS styles (e.g., { objectFit: "cover" })
}
```

### Event Callbacks

| Callback       | Parameters               | Description                                          |
| -------------- | ------------------------ | ---------------------------------------------------- |
| onPhotoLoad    | `() => void`             | Triggered when the photo finishes loading            |
| onVideoLoad    | `() => void`             | Triggered when the video finishes loading            |
| onCanPlay      | `() => void`             | Triggered when the video is ready to play            |
| onLoadStart    | `() => void`             | Triggered when video loading starts (lazy load mode) |
| onLoadProgress | `(loaded, total) => void`| Triggered during video download progress             |
| onProgress     | `(progress) => void`     | Triggered with video buffering progress (0-100)      |
| onEnded        | `() => void`             | Triggered when video playback completes              |
| onClick        | `() => void`             | Triggered on short press/click                       |
| onError        | `(error) => void`        | Triggered when an error occurs                       |

### LivePhotoError Interface

```typescript
interface LivePhotoError {
  type: 'VIDEO_LOAD_ERROR' | 'PHOTO_LOAD_ERROR' | 'PLAYBACK_ERROR' | 'VALIDATION_ERROR';
  message: string;
  originalError?: Error;
}
```

### Public Methods

All methods are available on the `LivePhotoViewer` instance:

| Method           | Returns         | Description                                          |
| ---------------- | --------------- | ---------------------------------------------------- |
| `play()`         | `Promise<void>` | Start or resume video playback                       |
| `pause()`        | `void`          | Pause video playback                                 |
| `stop()`         | `void`          | Stop video and reset to beginning                    |
| `toggle()`       | `void`          | Toggle between play and pause states                 |
| `getState()`     | `LivePhotoState`| Get current viewer state (readonly)                  |
| `destroy()`      | `void`          | Clean up resources and remove viewer from DOM        |

### LivePhotoState Interface

```typescript
interface LivePhotoState {
  isPlaying: boolean;           // Whether video is currently playing
  autoplay: boolean;            // Current autoplay setting
  videoError: boolean;          // Whether video loading failed
  videoLoaded: boolean;         // Whether video has been loaded
  aspectRatio: number;          // Calculated aspect ratio of the photo
  isLongPressPlaying: boolean;  // Whether playing due to long-press
}
```

## 🎯 How It Works

### Desktop Interaction
- **Hover on Badge**: Video plays automatically when hovering over the LIVE badge (if autoplay is enabled)
- **Hover Off**: Video stops and returns to photo
- **Click Badge**: Opens dropdown menu to toggle autoplay settings

### Mobile Interaction
- **Long Press**: Hold down on the photo to play the video
- **Release**: Video stops and returns to photo
- **Short Tap**: Triggers `onClick` callback without playing video
- **Haptic Feedback**: Vibration feedback on supported devices (if enabled)

### Loading Behavior
- **Standard Loading**: Video loads immediately with the component
- **Lazy Loading**: Video loads only when the viewer enters the viewport
- **Progress Indicator**: Visual feedback shows loading progress in the LIVE badge
- **Error Recovery**: Automatic retry mechanism for failed loads

## 🎨 Customization

### Styling

```javascript
const viewer = new LivePhotoViewer({
  photoSrc: "photo.jpg",
  videoSrc: "video.mp4",
  container: document.getElementById("container"),
  
  // Container styling
  width: "100%",
  height: "auto",
  borderRadius: "16px",
  theme: "dark",
  
  // Image customization
  imageCustomization: {
    styles: {
      objectFit: "cover",
      filter: "brightness(1.1)",
    },
    attributes: {
      alt: "My Live Photo",
      loading: "lazy",
      draggable: "false",
    },
  },
  
  // Video customization
  videoCustomization: {
    styles: {
      objectFit: "contain",
      filter: "contrast(1.1)",
    },
    attributes: {
      preload: "metadata",
    },
  },
});
```

### Custom CSS

You can override the default styles using CSS:

```css
/* Container */
.live-photo-container {
  border: 2px solid #4F46E5;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Badge */
.live-photo-badge {
  background: rgba(0, 0, 0, 0.8) !important;
  backdrop-filter: blur(10px);
}

/* Playing state */
.live-photo-container.playing {
  transform: scale(1.02);
  transition: transform 0.3s ease;
}

/* Dropdown menu */
.dropdown-menu {
  background: rgba(255, 255, 255, 0.95);
}
```

## 🔧 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Requirements
- Modern browser with ES6+ support
- Support for `IntersectionObserver` (for lazy loading)
- Support for `Promise` and `async/await`

## 📋 Best Practices

1. **Optimize Media Files**
   - Use compressed images (JPEG, WebP)
   - Use short video clips (2-3 seconds recommended)
   - Consider using adaptive bitrate videos for better performance

2. **Use Lazy Loading**
   - Enable `lazyLoadVideo: true` for content below the fold
   - Improves initial page load performance

3. **Handle Errors Gracefully**
   - Always implement `onError` callback
   - Provide fallback UI for failed loads

4. **Clean Up Resources**
   - Call `destroy()` method when removing the viewer
   - Especially important in SPAs (Single Page Applications)

5. **Responsive Design**
   - Use relative units (`%`, `vh`, `vw`) for responsive sizing
   - Set appropriate `objectFit` values for your aspect ratios

## 🐛 Troubleshooting

### Video not playing on mobile
- Ensure video has `muted` attribute (automatically set by the component)
- Check that video format is supported (MP4 H.264 recommended)
- Verify that `playsInline` is set (automatically set by the component)

### Video not loading
- Check video URL is accessible and CORS-enabled
- Verify video file is not corrupted
- Check browser console for specific errors
- Try increasing `retryAttempts` option

### Performance issues
- Enable `lazyLoadVideo` for multiple viewers on one page
- Optimize video file size and format
- Consider using shorter video clips

### Autoplay not working
- Verify `autoplay: true` is set in options
- Check that video is muted (required for autoplay in browsers)
- Desktop: Ensure you're hovering over the badge
- Mobile: Use long-press instead (autoplay works differently)

## 🔧 Development

```bash
# Install dependencies
pnpm install

# Development mode with watch
pnpm dev

# Build for production
pnpm build

# Run playground
cd playground
pnpm dev
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💖 Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📖 Improving documentation

## 📬 Contact

- Author: Icey Wu
- Email: 3128006406@qq.com
- GitHub: [@IceyWu](https://github.com/iceywu)

## 🙏 Acknowledgments

Inspired by Apple's Live Photos feature on iOS devices.

---

Made with ❤️ by [Icey Wu](https://github.com/iceywu)

## � Usage Examples

### Vanilla JavaScript

[View complete HTML demo](./demo/html-demo.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Photo Demo</title>
  <script src="https://fastly.jsdelivr.net/npm/live-photo@latest"></script>
</head>
<body>
  <div id="live-photo-container"></div>

  <script>
    document.addEventListener("DOMContentLoaded", function () {
      const container = document.getElementById("live-photo-container");
      
      const viewer = new LivePhotoViewer({
        photoSrc: "https://example.com/photo.jpg",
        videoSrc: "https://example.com/video.mp4",
        container: container,
        width: 400,
        height: 600,
        borderRadius: "12px",
        autoplay: true,
        lazyLoadVideo: true,
        enableVibration: true,
        imageCustomization: {
          styles: {
            objectFit: "cover",
          },
          attributes: {
            alt: "Beautiful Live Photo",
            loading: "lazy",
          },
        },
        videoCustomization: {
          styles: {
            objectFit: "cover",
          },
        },
        // Event callbacks
        onPhotoLoad: () => console.log("Photo loaded"),
        onVideoLoad: () => console.log("Video loaded"),
        onProgress: (progress) => console.log(`Loading: ${progress}%`),
        onError: (error) => console.error("Error:", error),
        onClick: () => console.log("Clicked!"),
      });

      // Control playback programmatically
      // viewer.play();
      // viewer.pause();
      // viewer.stop();
      // viewer.toggle();
      
      // Get current state
      // const state = viewer.getState();
      // console.log(state.isPlaying, state.autoplay);
    });
  </script>
</body>
</html>
```

### Vue 3 (Composition API)

[View complete Vue 3 demo](./demo/vue3-demo.html)

```vue
<template>
  <div ref="containerRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { LivePhotoViewer } from "live-photo";
import type { LivePhotoAPI } from "live-photo";

const containerRef = ref<HTMLElement | null>(null);
const viewerInstance = ref<LivePhotoAPI | null>(null);

onMounted(() => {
  if (containerRef.value) {
    viewerInstance.value = new LivePhotoViewer({
      photoSrc: "https://example.com/photo.jpg",
      videoSrc: "https://example.com/video.mp4",
      container: containerRef.value,
      width: 400,
      height: 600,
      borderRadius: "12px",
      autoplay: true,
      lazyLoadVideo: true,
      enableVibration: true,
      imageCustomization: {
        styles: {
          objectFit: "cover",
        },
        attributes: {
          alt: "Beautiful Live Photo",
          loading: "lazy",
        },
      },
      videoCustomization: {
        styles: {
          objectFit: "cover",
        },
      },
      onPhotoLoad: () => console.log("Photo loaded"),
      onVideoLoad: () => console.log("Video loaded"),
      onProgress: (progress) => console.log(`Loading: ${progress}%`),
      onError: (error) => console.error("Error:", error),
      onClick: () => console.log("Clicked!"),
    });
  }
});

// Clean up on component unmount
onUnmounted(() => {
  if (viewerInstance.value) {
    viewerInstance.value.destroy();
  }
});

// Example: Control methods
const play = () => viewerInstance.value?.play();
const pause = () => viewerInstance.value?.pause();
const toggle = () => viewerInstance.value?.toggle();
</script>
```

### React (TypeScript)

[View complete React demo](./demo/react-demo.html)

```tsx
import React, { useEffect, useRef } from "react";
import { LivePhotoViewer } from "live-photo";
import type { LivePhotoAPI } from "live-photo";

const LivePhotoComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<LivePhotoAPI | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      viewerRef.current = new LivePhotoViewer({
        photoSrc: "https://example.com/photo.jpg",
        videoSrc: "https://example.com/video.mp4",
        container: containerRef.current,
        width: 400,
        height: 600,
        borderRadius: "12px",
        autoplay: true,
        lazyLoadVideo: true,
        enableVibration: true,
        imageCustomization: {
          styles: {
            objectFit: "cover",
          },
          attributes: {
            alt: "Beautiful Live Photo",
            loading: "lazy",
          },
        },
        videoCustomization: {
          styles: {
            objectFit: "cover",
          },
        },
        onPhotoLoad: () => console.log("Photo loaded"),
        onVideoLoad: () => console.log("Video loaded"),
        onProgress: (progress) => console.log(`Loading: ${progress}%`),
        onError: (error) => console.error("Error:", error),
        onClick: () => console.log("Clicked!"),
      });
    }

    // Cleanup on unmount
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  // Example: Control methods
  const handlePlay = () => viewerRef.current?.play();
  const handlePause = () => viewerRef.current?.pause();
  const handleToggle = () => viewerRef.current?.toggle();

  return (
    <div>
      <div ref={containerRef}></div>
      <div>
        <button onClick={handlePlay}>Play</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handleToggle}>Toggle</button>
      </div>
    </div>
  );
};

export default LivePhotoComponent;
```

### Advanced Usage

#### Lazy Loading with Intersection Observer

```javascript
const viewer = new LivePhotoViewer({
  photoSrc: "photo.jpg",
  videoSrc: "video.mp4",
  container: document.getElementById("container"),
  lazyLoadVideo: true, // Video loads only when viewer is in viewport
  onLoadStart: () => {
    console.log("Video loading started");
  },
  onProgress: (progress) => {
    console.log(`Video buffering: ${progress}%`);
  },
});
```

#### Custom Error Handling

```javascript
const viewer = new LivePhotoViewer({
  photoSrc: "photo.jpg",
  videoSrc: "video.mp4",
  container: document.getElementById("container"),
  retryAttempts: 5, // Retry 5 times on failure
  onError: (error) => {
    switch (error.type) {
      case 'VIDEO_LOAD_ERROR':
        console.error("Failed to load video:", error.message);
        // Show fallback UI
        break;
      case 'PHOTO_LOAD_ERROR':
        console.error("Failed to load photo:", error.message);
        break;
      case 'PLAYBACK_ERROR':
        console.error("Playback failed:", error.message);
        break;
    }
  },
});
```

#### State Subscription

```javascript
const viewer = new LivePhotoViewer({
  photoSrc: "photo.jpg",
  videoSrc: "video.mp4",
  container: document.getElementById("container"),
});

// Get current state
const state = viewer.getState();
console.log(state.isPlaying); // false
console.log(state.autoplay);  // true

// Note: For reactive state updates, you can poll getState() 
// or use the event callbacks
```

#### Responsive Sizing

```javascript
const viewer = new LivePhotoViewer({
  photoSrc: "photo.jpg",
  videoSrc: "video.mp4",
  container: document.getElementById("container"),
  width: "100%",      // Responsive width
  height: "50vh",     // 50% of viewport height
  borderRadius: "1rem",
  imageCustomization: {
    styles: {
      objectFit: "cover",  // Maintain aspect ratio
    },
  },
});
```
