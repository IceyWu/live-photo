# Changelog

## 0.1.0

### Minor Changes

- f14d773: 重构与新特性

  - 重构 UIComponents 为独立导出函数，支持 tree-shaking
  - 新增 i18n 国际化支持（内置 zh-CN / en，支持自定义 locale 和 labels 覆盖）
  - 新增 storageKey 持久化用户偏好（autoplay / muted）
  - 新增 muted / showMuteButton / onMutedChange 音频控制
  - 新增 onClick 回调，桌面端和移动端统一触发
  - 新增 setMuted / toggleMute 公开 API
  - VideoLoader 支持重试（指数退避）和取消机制
  - StateManager 新增脏检查和快照缓存，减少无效更新
  - destroy() 幂等保护，销毁后调用公开 API 静默忽略
  - autoplay 等待图片加载完成后再触发
  - 修复悬停播放与下拉菜单的鼠标移入冲突
  - CSS 新增 auto 主题（跟随系统深色/浅色模式）
  - 进度条加载完成后自动隐藏
  - 新增完整文档（docs/）和更新 README

## v0.0.50

[compare changes](https://github.com/iceywu/live-photo/compare/v0.0.49...v0.0.50)

### 🚀 Enhancements

- 更新 README 文件，增强组件描述并添加在线示例链接 ([836a955](https://github.com/iceywu/live-photo/commit/836a955))
- **extract:** Add livePhotoExtract utility function for Live Photo file extraction ([b0999e1](https://github.com/iceywu/live-photo/commit/b0999e1))

### 💅 Refactors

- **core:** Remove unused VideoLoader dependency and LivePhotoError type import ([05826a3](https://github.com/iceywu/live-photo/commit/05826a3))

### 📖 Documentation

- **playground:** Update Live Photo support hint with tested device models ([b59e028](https://github.com/iceywu/live-photo/commit/b59e028))

### ❤️ Contributors

- IceyWu ([@Life-Palette](https://github.com/Life-Palette))

## v0.0.49

[compare changes](https://github.com/iceywu/live-photo/compare/v0.0.48...v0.0.49)

### 🚀 Enhancements

- 更新事件回调以返回原始事件对象和相关元素，增强事件信息访问 ([fa91f0a](https://github.com/iceywu/live-photo/commit/fa91f0a))

### 🏡 Chore

- **release:** V0.0.48 ([0f1c4da](https://github.com/iceywu/live-photo/commit/0f1c4da))

### ❤️ Contributors

- IceyWu ([@Life-Palette](https://github.com/Life-Palette))

## v0.0.48

[compare changes](https://github.com/iceywu/live-photo/compare/v0.0.47...v0.0.48)

### 🚀 Enhancements

- 添加 staticBadgeIcon 选项以控制徽章图标的静态状态 ([139ce7e](https://github.com/iceywu/live-photo/commit/139ce7e))

### 🏡 Chore

- **release:** V0.0.47 ([f28ccc9](https://github.com/iceywu/live-photo/commit/f28ccc9))

### ❤️ Contributors

- IceyWu ([@Life-Palette](https://github.com/Life-Palette))

## v0.0.47

[compare changes](https://github.com/iceywu/live-photo/compare/v0.0.46...v0.0.47)

### 🚀 Enhancements

- 添加长按延迟和短按点击回调，优化用户交互体验 ([0943b89](https://github.com/iceywu/live-photo/commit/0943b89))
- Implement EventManager for centralized event handling ([dd71597](https://github.com/iceywu/live-photo/commit/dd71597))
- Enhance LivePhotoViewer with borderRadius customization ([46ddbb1](https://github.com/iceywu/live-photo/commit/46ddbb1))
- 添加视频覆盖层以防止阻塞滚动并优化触摸事件处理 ([5f84688](https://github.com/iceywu/live-photo/commit/5f84688))
- 更新事件处理逻辑以支持自动播放状态，优化下拉菜单显示 ([9c903b7](https://github.com/iceywu/live-photo/commit/9c903b7))

### 💅 Refactors

- 移除不必要的配置项，简化 rollup 配置文件 ([77ed7ce](https://github.com/iceywu/live-photo/commit/77ed7ce))

### 📖 Documentation

- Update ([3835fbb](https://github.com/iceywu/live-photo/commit/3835fbb))

### 🏡 Chore

- **release:** V0.0.46 ([d8e2dc5](https://github.com/iceywu/live-photo/commit/d8e2dc5))

### ❤️ Contributors

- IceyWu ([@Life-Palette](https://github.com/Life-Palette))

## v0.0.46

[compare changes](https://github.com/iceywu/live-photo/compare/v0.0.45...v0.0.46)

### 🚀 Enhancements

- 更新 LivePhotoViewer 组件，支持宽度和高度为字符串类型 ([7b87225](https://github.com/iceywu/live-photo/commit/7b87225))
- 更新 LivePhotoViewer 组件，支持动态容器尺寸调整和自适应宽高比 ([38e5fa1](https://github.com/iceywu/live-photo/commit/38e5fa1))

### 🩹 Fixes

- 优化移动端长按播放逻辑，以及 iphone 设备长按导致图片选中问题 ([f6106f8](https://github.com/iceywu/live-photo/commit/f6106f8))

### 🏡 Chore

- **release:** V0.0.45 ([8589cd2](https://github.com/iceywu/live-photo/commit/8589cd2))

### ❤️ Contributors

- IceyWu ([@Life-Palette](http://github.com/Life-Palette))

## v0.0.45

[compare changes](https://github.com/iceywu/live-photo/compare/v0.0.44...v0.0.45)

### 🚀 Enhancements

- 更新 LivePhotoViewer 组件，支持宽度和高度为字符串类型 ([7b87225](https://github.com/iceywu/live-photo/commit/7b87225))
- 更新 LivePhotoViewer 组件，支持动态容器尺寸调整和自适应宽高比 ([38e5fa1](https://github.com/iceywu/live-photo/commit/38e5fa1))

### ❤️ Contributors

- IceyWu ([@Life-Palette](http://github.com/Life-Palette))

## v0.0.44

[compare changes](https://github.com/iceywu/live-photo/compare/v0.0.43...v0.0.44)

### 🚀 Enhancements

- 优化 LivePhotoViewer 组件，增强性能和用户交互体验 ([574d0d5](https://github.com/iceywu/live-photo/commit/574d0d5))
- 添加视频延迟加载和进度显示功能，优化用户体验 ([ccf224f](https://github.com/iceywu/live-photo/commit/ccf224f))
- 更新 LivePhotoViewer 组件，添加自动播放控制和进度图标显示功能 ([ca3e613](https://github.com/iceywu/live-photo/commit/ca3e613))
- 更新 README 文件，添加 lazyLoadVideo 参数和 onProgress 回调，增强配置选项说明 ([ce80cd5](https://github.com/iceywu/live-photo/commit/ce80cd5))
- 添加图片和视频自定义配置选项，优化用户体验 ([bdee36c](https://github.com/iceywu/live-photo/commit/bdee36c))

### ❤️ Contributors

- IceyWu ([@Life-Palette](http://github.com/Life-Palette))

## v0.0.43

[compare changes](https://github.com/iceywu/live-photo/compare/v0.0.42...v0.0.43)

### 🚀 Enhancements

- 新增 playground ([8aaf730](https://github.com/iceywu/live-photo/commit/8aaf730))
- 优化 LivePhotoViewer 组件的触摸交互，添加触摸事件处理，增强动画效果 ([a6ce36e](https://github.com/iceywu/live-photo/commit/a6ce36e))
- 更新 LivePhotoViewer 组件，添加触摸事件处理，优化视频播放控制和用户选择行为 ([879e013](https://github.com/iceywu/live-photo/commit/879e013))
- 添加下拉菜单以控制自动播放功能，优化交互体验 ([cf6b5e1](https://github.com/iceywu/live-photo/commit/cf6b5e1))

### 🏡 Chore

- **release:** V0.0.42 ([ad29ac2](https://github.com/iceywu/live-photo/commit/ad29ac2))

### ❤️ Contributors

- IceyWu ([@Life-Palette](http://github.com/Life-Palette))

## v0.0.42

[compare changes](https://github.com/iceywu/live-photo/compare/v0.0.4...v0.0.42)

### 🚀 Enhancements

- 添加自动播放功能和事件回调，优化 LivePhotoViewer 组件交互 ([005e76a](https://github.com/iceywu/live-photo/commit/005e76a))
- 添加图标支持，优化 LivePhotoViewer 组件的状态显示和交互 ([c541e5b](https://github.com/iceywu/live-photo/commit/c541e5b))
- 更新图标尺寸，添加中文 README 文件，优化英文 README 内容 ([69ae87b](https://github.com/iceywu/live-photo/commit/69ae87b))

### 🩹 Fixes

- 修复 dom 重复添加 ([a748c89](https://github.com/iceywu/live-photo/commit/a748c89))

### ❤️ Contributors

- IceyWu ([@Life-Palette](http://github.com/Life-Palette))

## v0.0.4

[compare changes](https://github.com/iceywu/live-photo/compare/v0.0.3...v0.0.4)

### 🚀 Enhancements

- 更新 LivePhotoViewer 组件样式和功能，添加交互式徽章和下拉菜单 ([2a974e8](https://github.com/iceywu/live-photo/commit/2a974e8))

### ❤️ Contributors

- IceyWu ([@Life-Palette](http://github.com/Life-Palette))

## v0.0.3

[compare changes](https://github.com/iceywu/live-photo/compare/v0.0.2...v0.0.3)

### 📖 Documentation

- 更新 README，修改示例链接并调整组件名称 ([dd896bc](https://github.com/iceywu/live-photo/commit/dd896bc))

### ❤️ Contributors

- IceyWu ([@Life-Palette](http://github.com/Life-Palette))

## v0.0.2

### 🚀 Enhancements

- Init ([373d535](https://github.com/live-photo/commit/373d535))

### 📖 Documentation

- 更新 README 和示例文件，添加 Vue 3 和 React 示例 ([f2d1ba8](https://github.com/live-photo/commit/f2d1ba8))

### ❤️ Contributors

- IceyWu ([@Life-Palette](http://github.com/Life-Palette))
