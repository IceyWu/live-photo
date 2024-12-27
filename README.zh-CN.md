<h1 align="center">live-photo</h1>
<p align="center">🚀一个简单易用的 Live Photo 网页查看器组件。让您能够在网页上展示类似 iOS 实时照片的效果。 </p>

<p align="center">
<a href="https://www.npmjs.com/package/live-photo" target="__blank"><img src="https://img.shields.io/npm/v/live-photo?color=a1b858&label=" alt="NPM version"></a>
<a href="https://www.npmjs.com/package/live-photo" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/live-photo?color=50a36f&label="></a>
</p>

**中文** | [English](./README.md)

## ✨ 特性

- 🎯 零依赖，轻量级实现
<!-- - 📱 支持移动端和桌面端 -->
- 🖼️ 支持图片和视频无缝切换
- 🎨 可自定义尺寸和样式
- 🚀 简单易用的 API

## 📦 安装

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

### 配置选项

| 参数      | 类型        | 必填 | 描述                    |
| --------- | ----------- | ---- | ----------------------- |
| photoSrc  | string      | 是   | 图片资源地址            |
| videoSrc  | string      | 是   | 视频资源地址            |
| container | HTMLElement | 是   | 容器 DOM 元素           |
| width     | number      | 否   | 查看器宽度(默认: 300px) |
| height    | number      | 否   | 查看器高度(默认: 300px) |
| autoplay  | boolean     | 否   | 是否自动播放(默认: false) |
| onCanPlay | () => void  | 否   | 视频可以播放时的回调    |
| onError   | (e?: any) => void | 否 | 加载错误时的回调        |
| onEnded   | () => void  | 否   | 视频播放结束时的回调    |
| onVideoLoad | () => void | 否  | 视频加载完成时的回调    |
| onPhotoLoad | () => void | 否  | 图片加载完成时的回调    |

### 抛出方法

| 方法   | 描述                     |
| ------ | ------------------------ |
| play   | 开始播放视频             |
| pause  | 暂停播放视频             |
| toggle | 切换播放和暂停状态       |
| stop   | 停止播放视频并重置时间   |

## 🔧 开发环境

- Bun
- 现代浏览器支持

## 📚 使用示例

### 原生 JavaScript 示例

[查看 HTML 示例代码](./demo/html-demo.html)

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

### Vue 3 示例 (TypeScript, 组合式 API)

[查看 Vue 3 示例代码](./demo/vue3-demo.html)

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

### React 示例 (TypeScript)

[查看 React 示例代码](./demo/react-demo.html)

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
