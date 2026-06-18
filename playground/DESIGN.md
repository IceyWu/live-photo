# DESIGN.md — live-photo playground

## Visual Theme & Atmosphere

摄影暗房的观看环境。界面本身退后,让实况照片成为唯一的视觉主角。
整体感受是「安静、沉浸、工具感」——像一个摄影师的工作台,不像一个 SaaS 产品的推广页。

密度中等偏高,信息紧凑但不拥挤。没有装饰性元素(无渐变、无光晕、无 illustration)。
排版留白代替分割线,节奏靠 demo 实物本身打断。

## Color Palette

只有一个强调色,其余全部是灰阶。

| Token | Hex | Role |
|-------|-----|------|
| `canvas` | #09090b | 页面底色,接近纯黑但带微暖 |
| `surface` | #131316 | 卡片/面板底色,一级抬升 |
| `surface-2` | #1c1c21 | 控件区域/代码块底色,二级抬升 |
| `border` | #27272a | 唯一边框色,1px hairline |
| `text` | #fafafa | 主文字 |
| `text-muted` | #a1a1aa | 次要文字、标签 |
| `text-dim` | #52525b | 辅助信息、placeholder |
| `accent` | #646cff | 唯一强调色——用于:primary 按钮、链接 hover、焦点环 |
| `accent-hover` | #7c83ff | accent 的 hover 态 |

禁止引入第二个彩色。success/error 等语义色只在事件日志里出现,不进入 UI chrome。

## Typography

单一字族,不切换。

- **Family**: `Inter, system-ui, -apple-system, sans-serif`
- **Mono**: `'JetBrains Mono', ui-monospace, monospace`

| Level | Size | Weight | Letter-spacing | Use |
|-------|------|--------|----------------|-----|
| display | clamp(32px, 5vw, 48px) | 700 | -0.03em | 页面唯一的大标题(最多出现 1 次) |
| heading | 20px | 600 | -0.02em | 区块标题 |
| body | 15px | 400 | -0.01em | 正文、控件标签 |
| small | 13px | 400 | 0 | 代码、辅助文字 |
| mono | 13px | 400 | 0 | 代码块、事件日志 |

display 标题只允许出现一次(页面顶部)。区块标题用 heading,不用更大的。

## Layout

- 最大内容宽度: 1040px
- 内边距: clamp(16px, 4vw, 32px)
- 区块间距: 80px(移动端 56px)
- 卡片内边距: 20px
- 没有「hero」概念。页面直接以一个全宽 Live Photo demo 开始(无文字覆盖),然后滚动进入功能区块。

### Grid

- 功能区块: 单列或 1:1 两列(demo 左 + 控制/代码 右)
- 同步演示: flex wrap, 每个 demo 固定 160px 方形
- 移动端: 一律单列,demo 宽度 100%

## Depth & Elevation

不使用 box-shadow。层次完全靠 surface 色阶 + 1px border 传达。

| Level | Background | Border | Use |
|-------|-----------|--------|-----|
| 0 | canvas | 无 | 页面底 |
| 1 | surface | 1px border | 主卡片 |
| 2 | surface-2 | 无 | 代码块、控件组内部 |

## Components

### 按钮(只有两种)

- **Primary**: bg accent, text #fff, padding 8px 16px, border-radius 8px, font-weight 500
- **Ghost**: bg transparent, border 1px border, text text-muted, padding 8px 16px, border-radius 8px

hover 时 primary → accent-hover; ghost → border 变 accent, text 变 accent。
没有第三种按钮。没有圆角 pill 按钮。

### 卡片(只有一种)

bg surface, border 1px border, border-radius 12px, padding 20px。
内部不再嵌套卡片。

### 代码块

bg surface-2, border-radius 8px, padding 14px 16px, font mono。
顶部一行: 左侧语言标签(text-dim, small), 右侧复制按钮(ghost 样式, small)。

### 控件行

一行 = label(mono, text-muted, 左) + 控件(右对齐)。
行间用 border-bottom 1px border 分隔。
行高 40px。

### 导航

高度 48px, bg canvas, 底部 1px border。
左: logo.svg 20px + 项目名(body weight 600)。
右: 文字链接(text-muted, hover → accent)。不要按钮形态的导航项。
移动端: 只保留 logo + 一个 GitHub 图标链接。

## Do's

- 让 Live Photo demo 实物占据视觉主导,UI chrome 退后
- 用 border 分隔,不用色块/阴影
- 代码片段紧贴 demo,让人复制即用
- 控件面板紧凑,一屏能看完所有参数
- display 标题只出现一次

## Don'ts

- 不用渐变(包括文字渐变)
- 不用 pill 形状按钮
- 不用大写 eyebrow 标签
- 不用 `.section--soft` 之类的交替背景
- 不用装饰性 tag/badge
- 不出现超过一个强调色
- 不做「英雄区」(hero section)——直接展示产品
