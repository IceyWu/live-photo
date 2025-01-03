<h1 align="center">live-photo</h1>
<p align="center">🚀A simple and easy-to-use Live Photo web viewer component that allows you to display effects similar to iOS Live Photos on the web. </p>

<p align="center">
<a href="https://www.npmjs.com/package/live-photo" target="__blank"><img src="https://img.shields.io/npm/v/live-photo?color=a1b858&label=" alt="NPM version"></a>
<a href="https://www.npmjs.com/package/live-photo" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/live-photo?color=50a36f&label="></a>
</p>

**Eenglish** | [中文](./README.zh-CN.md)

## ✨ Features

- 🎯 Zero dependencies, lightweight implementation
<!-- - 📱 Supports both mobile and desktop -->
- 🖼️ Seamless switching between images and videos
- 🎨 Customizable sizes and styles
- 🚀 Easy-to-use API

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

| Parameter     | Type              | Required | Description                |
|--------------|-------------------|----------|----------------------------|
| photoSrc     | string           | Yes      | Image resource URL         |
| videoSrc     | string           | Yes      | Video resource URL         |
| container    | HTMLElement      | Yes      | Container DOM element      |
| width        | number           | No       | Viewer width (default: 300px) |
| height       | number           | No       | Viewer height (default: 300px) |
| autoplay     | boolean          | No       | Whether to autoplay (default: false) |
| lazyLoadVideo| boolean          | No       | Whether to lazy load video (default: false) |
| onCanPlay    | () => void       | No       | Callback when video can play |
| onError      | (e?: any) => void| No       | Callback on load error     |
| onEnded      | () => void       | No       | Callback when video ends    |
| onVideoLoad  | () => void       | No       | Callback when video loads   |
| onPhotoLoad  | () => void       | No       | Callback when image loads   |
| onProgress   | (progress: number) => void | No | Callback for video loading progress |

### Methods

| Method | Description                  |
|--------|------------------------------|
| play   | Start playing the video      |
| pause  | Pause the video              |
| toggle | Toggle play and pause state  |
| stop   | Stop the video and reset time|

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
    photoSrc: "https://nest-js.oss-accelerate.aliyuncs.com/nestTest/1/1733058160256.JPEG",
    videoSrc: "https://nest-js.oss-accelerate.aliyuncs.com/nestTest/1/1733058160657.MOV",
  };
  document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("live-photo-container");
    new LivePhotoViewer({
      photoSrc: demoSource.photoSrc,
      videoSrc: demoSource.videoSrc,
      container: container,
      width: 300,
      height: 300,
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
      });
    }
  }, []);

  return <div ref={containerRef}></div>;
};

export default ReactDemo;
```
