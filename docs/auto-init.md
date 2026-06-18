# 声明式用法（自动初始化）

> **`autoInit` 和 `new LivePhotoViewer()` 是二选一的两种用法，不是先后关系。**
>
> - **命令式**：自己 `new LivePhotoViewer({ photoSrc, videoSrc, container })`。这样就完成了，**不需要也不要再调用 `autoInit()`**。
> - **声明式**：不写 `new`，改为在 HTML 元素上写 `data-live-photo` 等属性，由 `autoInit()` 替你扫描并创建实例。
>
> 换句话说，`autoInit()` 的作用就是「替你执行 `new`」。只有在用声明式属性写法时才会用到它。

## 声明式：CDN 引入

通过 CDN script 标签引入时，DOM 就绪后会**自动**初始化所有带 `data-live-photo` 的元素，连 `autoInit()` 都不用手写：

```html
<script src="https://fastly.jsdelivr.net/npm/live-photo@latest"></script>

<div
  data-live-photo
  data-photo-src="photo.jpg"
  data-video-src="video.mp4"
  style="width: 320px; height: 320px"
></div>
```

## 声明式：打包项目中手动调用一次

在打包项目里（用 `import` 的方式），ESM/CJS 入口刻意保持无副作用（不会自动扫描 DOM），所以需要你**自己调用一次** `autoInit()` 去扫描那些 `data-live-photo` 元素。注意：这里调用的仍然是声明式写法的入口，**不是配合 `new` 使用**。

```js
import { autoInit } from 'live-photo';

autoInit();            // 扫描整个 document 里的 data-live-photo 元素
autoInit(myContainer); // 只扫描某个子树
```

> 如果你用的是命令式 `new LivePhotoViewer(...)`，请忽略本节——你不需要 `autoInit()`。

## 特性

- **幂等**：已初始化的元素会被打上 `data-live-photo-initialized` 标记并跳过，可安全重复调用（动态内容、HMR）。
- **单元素容错**：缺 `data-photo-src`/`data-video-src` 的元素只会被跳过并在控制台告警，不影响其它元素渲染。
- **默认懒加载**：声明式实例默认开启 `lazyLoadVideo`，避免一页多个实例同时拉取视频。
- **自动尺寸**：未指定 `data-width`/`data-height` 时，播放器会填满宿主元素（通常已用 `style` 定好尺寸）。

## 属性对照

每个配置项都有对应的 `data-*`（短横线命名），常用如下：

| 属性 | 配置项 |
|------|--------|
| `data-photo-src` | `photoSrc`（必填） |
| `data-video-src` | `videoSrc`（必填） |
| `data-autoplay` | `autoplay` |
| `data-muted` | `muted` |
| `data-width` / `data-height` | `width` / `height` |
| `data-lazy-load-video` | `lazyLoadVideo`（默认 `true`） |
| `data-long-press-delay` | `longPressDelay` |
| `data-border-radius` | `borderRadius` |
| `data-theme` | `theme` |
| `data-preload` | `preload` |
| `data-locale` | `locale` |
| `data-retry-attempts` | `retryAttempts` |
| `data-enable-vibration` | `enableVibration` |
| `data-static-badge-icon` | `staticBadgeIcon` |
| `data-show-mute-button` | `showMuteButton` |
| `data-storage-key` | `storageKey` |
| `data-sync-group` | `syncGroup` |

布尔型属性写 `"false"`/`"0"` 为假，`"true"`/`"1"`/空值为真。

简写：布尔型 `data-sync` 会加入名为 `default` 的共享分组（等价于 `data-sync-group="default"`）。
