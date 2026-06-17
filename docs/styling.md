# 样式定制

## CSS 变量

覆盖 `:root` 或具体容器上的 CSS 变量即可修改主题：

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

## 主题

内置三种主题，通过 `theme` 选项或 `data-theme` 属性设置：

```js
new LivePhotoViewer({ theme: 'dark', ... });
// 'light' | 'dark' | 'auto'（跟随系统）
```

## 局部覆盖 CSS

```css
/* 容器 */
.live-photo-container {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* 徽标 */
.live-photo-badge {
  left: 8px;
  top: 8px;
}

/* 播放状态 */
.live-photo-container.playing {
  /* 自定义播放时的容器样式 */
}

/* 下拉菜单 */
.dropdown-menu {
  min-width: 160px;
}
```

## 图片 / 视频元素定制

通过 `imageCustomization` 和 `videoCustomization` 直接修改 `<img>` / `<video>` 的样式和属性：

```js
new LivePhotoViewer({
  photoSrc: '...',
  videoSrc: '...',
  container: el,
  imageCustomization: {
    styles: {
      objectFit: 'contain',       // 默认 cover
      filter: 'brightness(1.1)',
    },
    attributes: {
      alt: '我的实况照片',
      loading: 'lazy',
      draggable: 'false',
    },
  },
  videoCustomization: {
    styles: {
      objectFit: 'contain',
    },
  },
});
```

## 响应式尺寸

```js
new LivePhotoViewer({
  photoSrc: '...',
  videoSrc: '...',
  container: el,
  width: '100%',   // 相对单位，宽度跟随父容器
  height: '60vw',  // 高度跟随视口宽度
  borderRadius: '1rem',
});
```

只设置一边时，另一边会根据图片原始比例自动计算：

```js
// 只设宽度，高度自动按比例计算
new LivePhotoViewer({ width: 400, container: el, ... });

// 只设高度，宽度自动按比例计算
new LivePhotoViewer({ height: 400, container: el, ... });
```
