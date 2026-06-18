# 偏好同步与持久化

`autoplay` 和 `muted` 可以在多个实例间共享，也可以持久化 —— 全部通过统一的 `PreferencesStore` 抽象实现。

## 同页面实时共享

给实例设置相同的分组名，任意一个切换自动播放或静音，分组内其它实例会实时同步。未加分组的实例保持独立。

```js
new LivePhotoViewer({ photoSrc, videoSrc, container, syncGroup: 'gallery' });
// 声明式：data-sync-group="gallery"
```

## 持久化（并跨标签页同步）

设置 `storageKey` 后，偏好会保存到 `localStorage`，并通过 `storage` 事件同步到其它同源标签页。

```js
new LivePhotoViewer({ photoSrc, videoSrc, container, storageKey: 'home' });
```

与 `syncGroup` 同时使用即可获得「同页面同步 + 持久化 + 跨标签页」。

## 自定义存储

传入任意实现了 `PreferencesStore` 的对象。把同一个 store 传给多个实例即可让它们共享状态。优先级高于 `syncGroup` / `storageKey`。

```ts
import { LivePhotoViewer, createMemoryStore } from 'live-photo';

const store = createMemoryStore({ autoplay: false, muted: true });
new LivePhotoViewer({ photoSrc, videoSrc, container, preferencesStore: store });
```

内置辅助函数：

| 函数 | 说明 |
|------|------|
| `createMemoryStore(initial?)` | 内存存储，用于同页面实时同步 |
| `getSharedStore(name)` | 按名称获取共享内存存储（`syncGroup` 背后用的就是它） |
| `createStorageStore(key)` | localStorage 存储（持久化 + 跨标签页同步） |

## PreferencesStore 接口

```ts
interface LivePhotoPrefs {
  autoplay?: boolean;
  muted?: boolean;
}

interface PreferencesStore {
  get(): LivePhotoPrefs;
  set(patch: LivePhotoPrefs): void;
  subscribe(listener: (prefs: LivePhotoPrefs) => void): () => void;
}
```

## 优先级

实例最终采用的 `autoplay` / `muted`：

1. 若 store 已有值（来自其它实例或 localStorage），以 store 为准；
2. 否则用本次传入的选项（或默认值），并由首个实例写回 store 作为初始值。
