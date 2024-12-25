# live-photo

一个简单易用的 Apple Live Photo 网页查看器组件。让您能够在网页上展示类似 iOS 实时照片的效果。

## ✨ 特性

- 🎯 零依赖，轻量级实现
- 📱 支持移动端和桌面端
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

## 🔧 开发环境

- Bun
- 现代浏览器支持

## 📚 使用示例

### 原生 JavaScript 示例

```html
<script src="https://fastly.jsdelivr.net/npm/live-photo@latest"></script>
<div id="live-photo-container"></div>

<script>
  new LivePhotoViewer({
    photoSrc: "https://nest-js.oss-accelerate.aliyuncs.com/nestTest/1/1733058160256.JPEG",
    videoSrc: "https://nest-js.oss-accelerate.aliyuncs.com/nestTest/1/1733058160657.MOV",
    container: document.getElementById("live-photo-container"),
    width: 300,
    height: 300,
  });
</script>
```

### Vue 3 示例 (TypeScript, 组合式 API)

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


