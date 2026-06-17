---
"live-photo": minor
---

重构与新特性

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
