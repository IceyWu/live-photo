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

<p align="center">🚀 <strong>live-photo</strong> — A tiny, zero-dependency Live Photo web viewer that works with any modern front-end framework (Vue, React, Angular, Svelte) or plain JavaScript. Bring iOS‑style Live Photos to the web with minimal code.</p>

<p align="center">
<a href="https://www.npmjs.com/package/live-photo" target="__blank"><img src="https://img.shields.io/npm/v/live-photo?color=a1b858&label=" alt="NPM version"></a>
<a href="https://www.npmjs.com/package/live-photo" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/live-photo?color=50a36f&label="></a>
</p>

<p align="center">
Live demo: <a href="https://lpalette.cn" target="_blank">https://lpalette.cn</a>
</p>

**English** | [中文](./README.zh-CN.md)

## ✨ Features

- 🎯 Zero dependencies, lightweight implementation
<!-- - 📱 Supports both mobile and desktop -->
- 🖼️ Seamless switching between images and videos
- 🎨 Customizable sizes and styles
- 🚀 Easy-to-use API

- 🔧 Works with Vue / React / Angular / Svelte / Vanilla JS
- ⚡ Small footprint, easy to integrate into component-based apps

## 📦 Installation

```bash
npm install live-photo
or
pnpm add live-photo
or
yarn add live-photo
or
bun i live-photo
```

## 📖 API

### Configuration Options

| Parameter          | Type                       | Required | Description                                 |
| ------------------ | -------------------------- | -------- | ------------------------------------------- |
| photoSrc           | string                     | Yes      | Image resource URL                          |
| videoSrc           | string                     | Yes      | Video resource URL                          |
| container          | HTMLElement                | Yes      | Container DOM element                       |
| width              | number｜string             | No       | Viewer width (default: 300px)               |
| height             | number｜string             | No       | Viewer height (default: 300px)              |
| autoplay           | boolean                    | No       | Whether to autoplay (default: false)        |
| lazyLoadVideo      | boolean                    | No       | Whether to lazy load video (default: false) |
| longPressDelay     | number                     | No       | Long press threshold in ms (default: 300)   |
| imageCustomization | ElementCustomization       | No       | Image element customization                 |
| videoCustomization | ElementCustomization       | No       | Video element customization                 |
| onCanPlay          | () => void                 | No       | Callback when video can play                |
| onClick            | () => void                 | No       | Callback on click (short press)             |
| onError            | (e?: any) => void          | No       | Callback on load error                      |
| onEnded            | () => void                 | No       | Callback when video ends                    |
| onVideoLoad        | () => void                 | No       | Callback when video loads                   |
| onPhotoLoad        | () => void                 | No       | Callback when image loads                   |
| onProgress         | (progress: number) => void | No       | Callback for video loading progress         |

### ElementCustomization Type

| Parameter  | Type                      | Description     |
| ---------- | ------------------------- | --------------- |
| attributes | { [key: string]: string } | HTML attributes |
| styles     | { [key: string]: string } | CSS styles      |

### Methods

| Method | Description                   |
| ------ | ----------------------------- |
| play   | Start playing the video       |
| pause  | Pause the video               |
| toggle | Toggle play and pause state   |
| stop   | Stop the video and reset time |

## 🔧 Development Environment

- Bun
- Modern browser support

## 📚 Usage Example

### Native JavaScript Example

[View HTML example code](./demo/html-demo.html)

```html
<script src="https://fastly.jsdelivr.net/npm/live-photo@latest"></script>
<div id="live-photo-container"></div>

<script>
  const demoSource = {
    photoSrc:
      "https://nest-js.oss-accelerate.aliyuncs.com/nestTest/1/1733058160256.JPEG",
    videoSrc:
      "https://nest-js.oss-accelerate.aliyuncs.com/nestTest/1/1733058160657.MOV",
  };
  document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("live-photo-container");
    new LivePhotoViewer({
      photoSrc: demoSource.photoSrc,
      videoSrc: demoSource.videoSrc,
      container: container,
      width: 300,
      height: 300,
      imageCustomization: {
        styles: {
          objectFit: "cover",
          borderRadius: "8px",
        },
        attributes: {
          alt: "Live Photo Demo",
          loading: "lazy",
        },
      },
    });
  });
</script>
```

### Vue 3 Example (TypeScript, Composition API)

[View Vue 3 example code](./demo/vue3-demo.html)

```typescript
<template>
  <div ref="containerRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { LivePhotoViewer } from "live-photo";
const demoSource = {
  photoSrc:
    "https://nest-js.oss-accelerate.aliyuncs.com/nestTest/1/1733058160256.JPEG",
  videoSrc:
    "https://nest-js.oss-accelerate.aliyuncs.com/nestTest/1/1733058160657.MOV",
};
const containerRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (containerRef.value) {
    new LivePhotoViewer({
      photoSrc: demoSource.photoSrc,
      videoSrc: demoSource.videoSrc,
      container: containerRef.value,
      width: 300,
      height: 300,
      imageCustomization: {
            styles: {
              objectFit: "cover",
              borderRadius: "8px",
            },
            attributes: {
              alt: "Live Photo Demo",
              loading: "lazy",
            },
        },
    });
  }
});
</script>
```

### React Example (TypeScript)

[View React example code](./demo/react-demo.html)

```typescript
import React, { useEffect, useRef } from "react";
import { LivePhotoViewer } from "live-photo";

const ReactDemo: React.FC = () => {
  const demoSource = {
    photoSrc:
      "https://nest-js.oss-accelerate.aliyuncs.com/nestTest/1/1733058160256.JPEG",
    videoSrc:
      "https://nest-js.oss-accelerate.aliyuncs.com/nestTest/1/1733058160657.MOV",
  };
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      new LivePhotoViewer({
        photoSrc: demoSource.photoSrc,
        videoSrc: demoSource.videoSrc,
        container: containerRef.current,
        width: 300,
        height: 300,
        imageCustomization: {
          styles: {
            objectFit: "cover",
            borderRadius: "8px",
          },
          attributes: {
            alt: "Live Photo Demo",
            loading: "lazy",
          },
        },
      });
    }
  }, []);

  return <div ref={containerRef}></div>;
};

export default ReactDemo;
```
