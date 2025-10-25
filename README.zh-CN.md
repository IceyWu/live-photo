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

<p align="center">🚀 一个功能强大且轻量级的 Live Photo 网页查看器组件,将 iOS 风格的实时照片体验带到网页端。</p>

<p align="center">
<a href="https://www.npmjs.com/package/live-photo" target="__blank"><img src="https://img.shields.io/npm/v/live-photo?color=a1b858&label=" alt="NPM version"></a>
<a href="https://www.npmjs.com/package/live-photo" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/live-photo?color=50a36f&label="></a>
</p>

**中文** | [English](./README.md)

## ✨ 特性

- 🎯 **零依赖** - 轻量级实现,无需任何外部依赖
- 📱 **跨平台** - 无缝支持移动端(触摸)和桌面端(鼠标)交互
- 🖼️ **智能媒体处理** - 照片和视频之间自动切换,过渡流畅
- 🎨 **高度可定制** - 灵活的样式和配置选项,支持图片和视频元素自定义
- 🔄 **高级加载** - 支持懒加载和渐进式视频加载,带有视觉反馈
- ⚡ **性能优化** - 高效的资源管理和清理机制
- 🎮 **丰富的 API** - 完善的公共方法和事件回调,实现完全控制
- 🎭 **交互体验** - 长按播放、点击检测、自动播放模式和震动反馈
- 📊 **状态管理** - 内置状态跟踪和订阅系统
- 🛡️ **类型安全** - 完整的 TypeScript 支持,提供完整类型定义
- 🎪 **框架无关** - 支持原生 JavaScript、Vue、React、Angular 等

## 📦 安装

```bash
npm install live-photo
# 或
pnpm add live-photo
# 或
yarn add live-photo
# 或
bun add live-photo
```

## 🚀 快速开始

### 浏览器 (CDN)

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

### ES 模块

```javascript
import { LivePhotoViewer } from 'live-photo';

const viewer = new LivePhotoViewer({
  photoSrc: 'path/to/photo.jpg',
  videoSrc: 'path/to/video.mp4',
  container: document.getElementById('live-photo-container'),
});
```

## 📖 API 参考

### 配置选项

| 参数               | 类型                       | 必填 | 默认值  | 描述                                                     |
| ------------------ | -------------------------- | ---- | ------- | -------------------------------------------------------- |
| photoSrc           | string                     | ✅   | -       | 要显示的静态图片 URL                                      |
| videoSrc           | string                     | ✅   | -       | 交互时播放的视频 URL                                      |
| container          | HTMLElement                | ✅   | -       | 挂载查看器的 DOM 元素                                     |
| width              | number \| string           | ❌   | `300px` | 查看器宽度(支持 px、%、vh、vw 等)                         |
| height             | number \| string           | ❌   | `300px` | 查看器高度(支持 px、%、vh、vw 等)                         |
| autoplay           | boolean                    | ❌   | `true`  | 启用悬停(桌面)或长按(移动端)时自动播放视频                |
| lazyLoadVideo      | boolean                    | ❌   | `false` | 延迟视频加载,直到查看器进入视口                           |
| longPressDelay     | number                     | ❌   | `300`   | 区分点击和长按的时间阈值(毫秒)                            |
| borderRadius       | number \| string           | ❌   | -       | 容器的边框圆角(支持 px、%、rem 等)                        |
| theme              | 'light' \| 'dark' \| 'auto'| ❌   | -       | UI 元素的颜色主题                                         |
| preload            | 'auto' \| 'metadata' \| 'none' | ❌ | -    | 视频预加载策略                                            |
| retryAttempts      | number                     | ❌   | `3`     | 视频加载失败时的重试次数                                  |
| enableVibration    | boolean                    | ❌   | `true`  | 在支持的设备上启用震动反馈                                |
| staticBadgeIcon    | boolean                    | ❌   | `false` | 保持徽章图标静态(无斜杠),不随 autoplay 状态变化           |
| imageCustomization | ElementCustomization       | ❌   | -       | 图片元素的自定义属性和样式                                |
| videoCustomization | ElementCustomization       | ❌   | -       | 视频元素的自定义属性和样式                                |

### ElementCustomization 接口

```typescript
interface ElementCustomization {
  attributes?: Record<string, string>;  // HTML 属性(如 { alt: "...", loading: "lazy" })
  styles?: Partial<CSSStyleDeclaration>; // CSS 样式(如 { objectFit: "cover" })
}
```

### 事件回调

| 回调           | 参数                     | 描述                                    |
| -------------- | ------------------------ | --------------------------------------- |
| onPhotoLoad    | `() => void`             | 图片加载完成时触发                      |
| onVideoLoad    | `() => void`             | 视频加载完成时触发                      |
| onCanPlay      | `() => void`             | 视频准备好播放时触发                    |
| onLoadStart    | `() => void`             | 视频开始加载时触发(懒加载模式)          |
| onLoadProgress | `(loaded, total) => void`| 视频下载进度时触发                      |
| onProgress     | `(progress) => void`     | 视频缓冲进度时触发(0-100)               |
| onEnded        | `() => void`             | 视频播放完成时触发                      |
| onClick        | `() => void`             | 短按/点击时触发                         |
| onError        | `(error) => void`        | 发生错误时触发                          |

### LivePhotoError 接口

```typescript
interface LivePhotoError {
  type: 'VIDEO_LOAD_ERROR' | 'PHOTO_LOAD_ERROR' | 'PLAYBACK_ERROR' | 'VALIDATION_ERROR';
  message: string;
  originalError?: Error;
}
```

### 公共方法

所有方法都可在 `LivePhotoViewer` 实例上使用:

| 方法             | 返回值          | 描述                                    |
| ---------------- | --------------- | --------------------------------------- |
| `play()`         | `Promise<void>` | 开始或恢复视频播放                      |
| `pause()`        | `void`          | 暂停视频播放                            |
| `stop()`         | `void`          | 停止视频并重置到开始位置                |
| `toggle()`       | `void`          | 切换播放和暂停状态                      |
| `getState()`     | `LivePhotoState`| 获取当前查看器状态(只读)                |
| `destroy()`      | `void`          | 清理资源并从 DOM 中移除查看器           |

### LivePhotoState 接口

```typescript
interface LivePhotoState {
  isPlaying: boolean;           // 视频是否正在播放
  autoplay: boolean;            // 当前的自动播放设置
  videoError: boolean;          // 视频加载是否失败
  videoLoaded: boolean;         // 视频是否已加载
  aspectRatio: number;          // 计算出的照片纵横比
  isLongPressPlaying: boolean;  // 是否因长按而播放
}
```

## 🎯 工作原理

### 桌面端交互
- **悬停在徽章上**: 悬停在 LIVE 徽章上时自动播放视频(如果启用了自动播放)
- **移开鼠标**: 视频停止并返回照片
- **点击徽章**: 打开下拉菜单以切换自动播放设置

### 移动端交互
- **长按**: 按住照片播放视频
- **释放**: 视频停止并返回照片
- **短按**: 触发 `onClick` 回调而不播放视频
- **触觉反馈**: 在支持的设备上提供震动反馈(如果启用)

### 加载行为
- **标准加载**: 视频随组件立即加载
- **懒加载**: 仅当查看器进入视口时才加载视频
- **进度指示器**: 视觉反馈在 LIVE 徽章中显示加载进度
- **错误恢复**: 失败加载的自动重试机制

## 🎨 自定义

### 样式配置

```javascript
const viewer = new LivePhotoViewer({
  photoSrc: "photo.jpg",
  videoSrc: "video.mp4",
  container: document.getElementById("container"),
  
  // 容器样式
  width: "100%",
  height: "auto",
  borderRadius: "16px",
  theme: "dark",
  
  // 图片自定义
  imageCustomization: {
    styles: {
      objectFit: "cover",
      filter: "brightness(1.1)",
    },
    attributes: {
      alt: "我的实时照片",
      loading: "lazy",
      draggable: "false",
    },
  },
  
  // 视频自定义
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

### 自定义 CSS

可以使用 CSS 覆盖默认样式:

```css
/* 容器 */
.live-photo-container {
  border: 2px solid #4F46E5;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 徽章 */
.live-photo-badge {
  background: rgba(0, 0, 0, 0.8) !important;
  backdrop-filter: blur(10px);
}

/* 播放状态 */
.live-photo-container.playing {
  transform: scale(1.02);
  transition: transform 0.3s ease;
}

/* 下拉菜单 */
.dropdown-menu {
  background: rgba(255, 255, 255, 0.95);
}
```

## 🔧 浏览器支持

- ✅ Chrome (最新版)
- ✅ Firefox (最新版)
- ✅ Safari (最新版)
- ✅ Edge (最新版)
- ✅ 移动浏览器 (iOS Safari, Chrome Mobile)

### 要求
- 支持 ES6+ 的现代浏览器
- 支持 `IntersectionObserver`(用于懒加载)
- 支持 `Promise` 和 `async/await`

## 📋 最佳实践

1. **优化媒体文件**
   - 使用压缩的图片格式(JPEG、WebP)
   - 使用短视频片段(建议 2-3 秒)
   - 考虑使用自适应比特率视频以获得更好的性能

2. **使用懒加载**
   - 为首屏以下的内容启用 `lazyLoadVideo: true`
   - 提高初始页面加载性能

3. **优雅地处理错误**
   - 始终实现 `onError` 回调
   - 为加载失败提供备用 UI

4. **清理资源**
   - 移除查看器时调用 `destroy()` 方法
   - 在 SPA(单页应用)中特别重要

5. **响应式设计**
   - 使用相对单位(`%`、`vh`、`vw`)实现响应式尺寸
   - 为您的宽高比设置适当的 `objectFit` 值

## 🐛 故障排除

### 移动端视频无法播放
- 确保视频具有 `muted` 属性(组件自动设置)
- 检查视频格式是否受支持(推荐 MP4 H.264)
- 验证是否设置了 `playsInline`(组件自动设置)

### 视频无法加载
- 检查视频 URL 是否可访问且启用了 CORS
- 验证视频文件未损坏
- 检查浏览器控制台的具体错误
- 尝试增加 `retryAttempts` 选项

### 性能问题
- 为一个页面上的多个查看器启用 `lazyLoadVideo`
- 优化视频文件大小和格式
- 考虑使用更短的视频片段

### 自动播放不工作
- 验证选项中设置了 `autoplay: true`
- 检查视频是否静音(浏览器要求自动播放必须静音)
- 桌面端:确保您悬停在徽章上
- 移动端:改用长按(自动播放工作方式不同)

## 🔧 开发

```bash
# 安装依赖
pnpm install

# 开发模式(监听)
pnpm dev

# 生产构建
pnpm build

# 运行 playground
cd playground
pnpm dev
```

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎贡献!请随时提交 Pull Request。

1. Fork 仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 💖 支持

如果您觉得这个项目有帮助,请考虑:
- ⭐ 给仓库点星
- 🐛 报告 bug
- 💡 提出新功能建议
- 📖 改进文档

## 📬 联系方式

- 作者: Icey Wu
- 邮箱: 3128006406@qq.com
- GitHub: [@IceyWu](https://github.com/iceywu)

## 🙏 致谢

灵感来自 Apple 在 iOS 设备上的 Live Photos 功能。

---

用 ❤️ 制作,作者 [Icey Wu](https://github.com/iceywu)

## � 使用示例

### 原生 JavaScript

[查看完整 HTML 示例](./demo/html-demo.html)

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Photo 演示</title>
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
            alt: "美丽的实时照片",
            loading: "lazy",
          },
        },
        videoCustomization: {
          styles: {
            objectFit: "cover",
          },
        },
        // 事件回调
        onPhotoLoad: () => console.log("照片已加载"),
        onVideoLoad: () => console.log("视频已加载"),
        onProgress: (progress) => console.log(`加载中: ${progress}%`),
        onError: (error) => console.error("错误:", error),
        onClick: () => console.log("已点击!"),
      });

      // 通过编程方式控制播放
      // viewer.play();
      // viewer.pause();
      // viewer.stop();
      // viewer.toggle();
      
      // 获取当前状态
      // const state = viewer.getState();
      // console.log(state.isPlaying, state.autoplay);
    });
  </script>
</body>
</html>
```

### Vue 3 (组合式 API)

[查看完整 Vue 3 示例](./demo/vue3-demo.html)

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
          alt: "美丽的实时照片",
          loading: "lazy",
        },
      },
      videoCustomization: {
        styles: {
          objectFit: "cover",
        },
      },
      onPhotoLoad: () => console.log("照片已加载"),
      onVideoLoad: () => console.log("视频已加载"),
      onProgress: (progress) => console.log(`加载中: ${progress}%`),
      onError: (error) => console.error("错误:", error),
      onClick: () => console.log("已点击!"),
    });
  }
});

// 组件卸载时清理
onUnmounted(() => {
  if (viewerInstance.value) {
    viewerInstance.value.destroy();
  }
});

// 示例:控制方法
const play = () => viewerInstance.value?.play();
const pause = () => viewerInstance.value?.pause();
const toggle = () => viewerInstance.value?.toggle();
</script>
```

### React (TypeScript)

[查看完整 React 示例](./demo/react-demo.html)

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
            alt: "美丽的实时照片",
            loading: "lazy",
          },
        },
        videoCustomization: {
          styles: {
            objectFit: "cover",
          },
        },
        onPhotoLoad: () => console.log("照片已加载"),
        onVideoLoad: () => console.log("视频已加载"),
        onProgress: (progress) => console.log(`加载中: ${progress}%`),
        onError: (error) => console.error("错误:", error),
        onClick: () => console.log("已点击!"),
      });
    }

    // 卸载时清理
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  // 示例:控制方法
  const handlePlay = () => viewerRef.current?.play();
  const handlePause = () => viewerRef.current?.pause();
  const handleToggle = () => viewerRef.current?.toggle();

  return (
    <div>
      <div ref={containerRef}></div>
      <div>
        <button onClick={handlePlay}>播放</button>
        <button onClick={handlePause}>暂停</button>
        <button onClick={handleToggle}>切换</button>
      </div>
    </div>
  );
};

export default LivePhotoComponent;
```

### 高级用法

#### 使用 Intersection Observer 懒加载

```javascript
const viewer = new LivePhotoViewer({
  photoSrc: "photo.jpg",
  videoSrc: "video.mp4",
  container: document.getElementById("container"),
  lazyLoadVideo: true, // 仅当查看器进入视口时才加载视频
  onLoadStart: () => {
    console.log("视频开始加载");
  },
  onProgress: (progress) => {
    console.log(`视频缓冲中: ${progress}%`);
  },
});
```

#### 自定义错误处理

```javascript
const viewer = new LivePhotoViewer({
  photoSrc: "photo.jpg",
  videoSrc: "video.mp4",
  container: document.getElementById("container"),
  retryAttempts: 5, // 失败时重试 5 次
  onError: (error) => {
    switch (error.type) {
      case 'VIDEO_LOAD_ERROR':
        console.error("视频加载失败:", error.message);
        // 显示备用 UI
        break;
      case 'PHOTO_LOAD_ERROR':
        console.error("照片加载失败:", error.message);
        break;
      case 'PLAYBACK_ERROR':
        console.error("播放失败:", error.message);
        break;
    }
  },
});
```

#### 状态订阅

```javascript
const viewer = new LivePhotoViewer({
  photoSrc: "photo.jpg",
  videoSrc: "video.mp4",
  container: document.getElementById("container"),
});

// 获取当前状态
const state = viewer.getState();
console.log(state.isPlaying); // false
console.log(state.autoplay);  // true

// 注意:对于响应式状态更新,可以轮询 getState()
// 或使用事件回调
```

#### 响应式尺寸

```javascript
const viewer = new LivePhotoViewer({
  photoSrc: "photo.jpg",
  videoSrc: "video.mp4",
  container: document.getElementById("container"),
  width: "100%",      // 响应式宽度
  height: "50vh",     // 视口高度的 50%
  borderRadius: "1rem",
  imageCustomization: {
    styles: {
      objectFit: "cover",  // 保持宽高比
    },
  },
});
```
