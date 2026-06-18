/**
 * CDN / UMD 专用入口。
 *
 * 与 `index.ts` 的区别：在浏览器环境下会在 DOM 就绪后自动调用一次
 * `autoInit()`，扫描页面里所有 `[data-live-photo]` 元素并渲染。
 *
 * ESM / CJS 入口（index.ts）保持「导入无副作用」，框架用户不受影响。
 */
import { autoInit } from './core/autoInit';

export * from './index';

if (typeof document !== 'undefined') {
  const run = () => autoInit();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
}
