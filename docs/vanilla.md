# Vanilla JavaScript

## 基础用法

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Photo</title>
  <script src="https://fastly.jsdelivr.net/npm/live-photo@latest"></script>
  <style>
    #container { width: 400px; height: 400px; }
  </style>
</head>
<body>
  <div id="container"></div>
  <script>
    const viewer = new LivePhotoViewer({
      photoSrc: 'https://example.com/photo.jpg',
      videoSrc: 'https://example.com/video.mp4',
      container: document.getElementById('container'),
      autoplay: true,
      borderRadius: 12,
      theme: 'auto',
    });
  </script>
</body>
</html>
```

## API 控制

```js
// 播放控制
viewer.play();
viewer.pause();
viewer.stop();
viewer.toggle();

// 音频
viewer.setMuted(false);
viewer.toggleMute();

// 获取状态
const state = viewer.getState();
console.log(state.isPlaying, state.muted, state.autoplay);

// 销毁（务必在移除 DOM 前调用）
viewer.destroy();
```

## 监听事件

```js
const viewer = new LivePhotoViewer({
  photoSrc: '...',
  videoSrc: '...',
  container: document.getElementById('container'),

  onLoadStart: () => console.log('开始加载'),
  onLoadProgress: (loaded, total) => console.log(`${(loaded / total * 100).toFixed(0)}%`),
  onPhotoLoad: (event, photo) => console.log(`图片 ${photo.naturalWidth}×${photo.naturalHeight}`),
  onVideoLoad: (duration, event, video) => console.log(`时长 ${duration.toFixed(2)}s`),
  onCanPlay: (event, video) => console.log('可以播放'),
  onProgress: (progress) => console.log(`缓冲 ${progress}%`),
  onEnded: () => console.log('播放结束'),
  onClick: (event) => console.log('点击'),
  onMutedChange: (muted) => console.log('静音:', muted),
  onError: (error) => console.error(error.type, error.message),
});
```

## 懒加载

```js
const viewer = new LivePhotoViewer({
  photoSrc: '...',
  videoSrc: '...',
  container: document.getElementById('container'),
  lazyLoadVideo: true, // 进入视口后才加载视频
  onLoadStart: () => console.log('视频开始加载'),
});
```

## 错误处理与重试

```js
const viewer = new LivePhotoViewer({
  photoSrc: '...',
  videoSrc: '...',
  container: document.getElementById('container'),
  retryAttempts: 5, // 最多重试 5 次（指数退避）
  onError: (error, event) => {
    switch (error.type) {
      case 'VIDEO_LOAD_ERROR':
        // 视频加载失败
        break;
      case 'PHOTO_LOAD_ERROR':
        // 图片加载失败
        break;
      case 'PLAYBACK_ERROR':
        // 播放失败
        break;
    }
  },
});
```

## 持久化用户偏好

```js
// 设置 storageKey 后，静音和自动播放设置会自动存入 localStorage
const viewer = new LivePhotoViewer({
  photoSrc: '...',
  videoSrc: '...',
  container: document.getElementById('container'),
  storageKey: 'my-live-photo',
});
```

## 自定义元素样式

```js
const viewer = new LivePhotoViewer({
  photoSrc: '...',
  videoSrc: '...',
  container: document.getElementById('container'),
  imageCustomization: {
    styles: { objectFit: 'cover', filter: 'brightness(1.05)' },
    attributes: { alt: '实况照片', loading: 'lazy' },
  },
  videoCustomization: {
    styles: { objectFit: 'cover' },
  },
});
```
