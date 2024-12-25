
# LivePhoto Viewer

一个简单易用的 Apple Live Photo 网页查看器组件。让您能够在网页上展示类似 iOS 实时照片的效果。

## ✨ 特性

- 🎯 零依赖，轻量级实现
- 📱 支持移动端和桌面端
- 🖼️ 支持图片和视频无缝切换
- 🎨 可自定义尺寸和样式
- 🚀 简单易用的API

## 📦 安装

```bash
npm install live-photo
or
pnpm add live-photo
or
yarn add live-photo
```

## 🚀 快速开始

```html
<script src="path/to/LivePhotoViewer.js"></script>
<div id="live-photo-container"></div>

<script>
  new LivePhotoViewer({
    photoSrc: "path/to/photo.jpg",
    videoSrc: "path/to/video.mov",
    container: document.getElementById("live-photo-container"),
    width: 300,
    height: 300
  });
</script>
```

## 📖 API

### 配置选项

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| photoSrc | string | 是 | 图片资源地址 |
| videoSrc | string | 是 | 视频资源地址 |
| container | HTMLElement | 是 | 容器DOM元素 |
| width | number | 否 | 查看器宽度(默认: 300px) |
| height | number | 否 | 查看器高度(默认: 300px) |

## 🔧 开发环境

- Bun
- 现代浏览器支持
