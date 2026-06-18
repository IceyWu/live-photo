---
"live-photo": minor
---

新增声明式自动初始化与偏好同步重构

- 新增 `autoInit()` 声明式用法：带 `data-live-photo` 属性的元素在 DOM 就绪后自动渲染，CDN/UMD 构建自动执行，ESM/CJS 入口保持无副作用
- 新增 `PreferencesStore` 统一抽象：`autoplay` / `muted` 的跨实例同步与持久化统一为「换一个 store 实现」
  - `syncGroup` 选项：同名分组内的实例实时共享 autoplay/muted
  - `storageKey` 升级：持久化 + 跨标签页同步（通过 storage 事件）
  - `preferencesStore` 选项：可传入自定义 store，优先级最高
  - 内置 `createMemoryStore` / `getSharedStore` / `createStorageStore` 辅助函数
- Light 主题 badge 改进：新增 `--live-photo-badge-border` 和 `--live-photo-badge-shadow` CSS 变量，配合 backdrop-filter 提升浅色照片上的辨识度
- Rollup 构建拆分：ESM/CJS（无副作用）+ UMD（自动执行 autoInit）
- `package.json` 新增 `unpkg` / `jsdelivr` 字段指向 UMD 构建
