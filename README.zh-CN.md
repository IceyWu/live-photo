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

| 参数               | 类型                       | 是否必填 | 描述                            |
| ------------------ | -------------------------- | -------- | ------------------------------- |
| photoSrc           | string                     | 是       | 图片资源 URL                    |
| videoSrc           | string                     | 是       | 视频资源 URL                    |
| container          | HTMLElement                | 是       | 容器 DOM 元素                   |
| width              | number                     | 否       | 查看器宽度（默认：300px）       |
| height             | number                     | 否       | 查看器高度（默认：300px）       |
| autoplay           | boolean                    | 否       | 是否自动播放（默认：false）     |
| lazyLoadVideo      | boolean                    | 否       | 是否延迟加载视频（默认：false） |
| imageCustomization | ElementCustomization       | 否       | 图片元素的自定义配置            |
| videoCustomization | ElementCustomization       | 否       | 视频元素的自定义配置            |
| onCanPlay          | () => void                 | 否       | 视频可以播放时的回调            |
| onError            | (e?: any) => void          | 否       | 加载错误时的回调                |
| onEnded            | () => void                 | 否       | 视频播放结束时的回调            |
| onVideoLoad        | () => void                 | 否       | 视频加载完成时的回调            |
| onPhotoLoad        | () => void                 | 否       | 图片加载完成时的回调            |
| onProgress         | (progress: number) => void | 否       | 视频加载进度回调                |

### ElementCustomization 类型

| 参数       | 类型                      | 描述          |
| ---------- | ------------------------- | ------------- |
| attributes | { [key: string]: string } | HTML 属性配置 |
| styles     | { [key: string]: string } | CSS 样式配置  |

### 抛出方法

| 方法   | 描述                   |
| ------ | ---------------------- |
| play   | 开始播放视频           |
| pause  | 暂停播放视频           |
| toggle | 切换播放和暂停状态     |
| stop   | 停止播放视频并重置时间 |

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
