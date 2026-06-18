import { LivePhotoViewer } from './LivePhotoViewer';
import type { LivePhotoOptions } from '../types';

/**
 * 默认扫描选择器。带有该属性的元素会被自动初始化为 LivePhotoViewer。
 */
export const AUTO_INIT_SELECTOR = '[data-live-photo]';

/**
 * 幂等标记。已初始化的元素会被打上该属性，重复调用 autoInit 时跳过。
 */
const INITIALIZED_ATTR = 'data-live-photo-initialized';

/**
 * 把已创建的实例挂到元素上，方便后续手动 destroy / 调试。
 */
const INSTANCE_KEY = '__livePhotoViewer';

interface HostElement extends HTMLElement {
  [INSTANCE_KEY]?: LivePhotoViewer;
}

/**
 * 把形如 "true"/"false"/""（属性存在但无值）解析为布尔值。
 * 属性不存在时返回 undefined，交给库的默认值处理。
 */
function parseBool(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  // 声明式写法里 `data-autoplay`（无值）视为 true
  if (value === '' || value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  return undefined;
}

function parseNumber(value: string | undefined): number | undefined {
  if (value === undefined || value.trim() === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * width/height/borderRadius 支持 number | string。
 * 纯数字字符串转成 number（这样库会自动补 'px'），否则原样保留（如 "100%"、"2rem"）。
 */
function parseDimension(value: string | undefined): number | string | undefined {
  if (value === undefined || value.trim() === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

function parseTheme(value: string | undefined): LivePhotoOptions['theme'] {
  return value === 'light' || value === 'dark' || value === 'auto' ? value : undefined;
}

function parsePreload(value: string | undefined): LivePhotoOptions['preload'] {
  return value === 'auto' || value === 'metadata' || value === 'none' ? value : undefined;
}

/**
 * 只保留值不为 undefined 的键，避免覆盖库内部默认值。
 */
function compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out as Partial<T>;
}

/**
 * 从单个元素的 data-* 属性构建 LivePhotoOptions。
 * 缺少 photoSrc / videoSrc 时返回 null（由调用方跳过该元素）。
 */
function buildOptions(el: HTMLElement): LivePhotoOptions | null {
  const d = el.dataset;

  const photoSrc = d.photoSrc;
  const videoSrc = d.videoSrc;
  if (!photoSrc || !videoSrc) return null;

  // 声明式默认开启懒加载，避免一页多个实例时同时发起视频请求。
  // 显式写了 data-lazy-load-video 时以用户值为准。
  const lazyLoadVideo = parseBool(d.lazyLoadVideo) ?? true;

  // 未显式指定尺寸时填充宿主元素（作者通常已用 style 给宿主定好尺寸）。
  const width = parseDimension(d.width) ?? '100%';
  const height = parseDimension(d.height) ?? '100%';

  return {
    photoSrc,
    videoSrc,
    container: el,
    width,
    height,
    lazyLoadVideo,
    // storageKey 默认不设置，避免多个实例共用同一份偏好而互相串改；
    // 需要持久化时由作者显式写 data-storage-key。
    ...compact({
      autoplay: parseBool(d.autoplay),
      muted: parseBool(d.muted),
      showMuteButton: parseBool(d.showMuteButton),
      enableVibration: parseBool(d.enableVibration),
      staticBadgeIcon: parseBool(d.staticBadgeIcon),
      longPressDelay: parseNumber(d.longPressDelay),
      retryAttempts: parseNumber(d.retryAttempts),
      borderRadius: parseDimension(d.borderRadius),
      locale: d.locale,
      storageKey: d.storageKey,
      theme: parseTheme(d.theme),
      preload: parsePreload(d.preload),
    }),
  };
}

/**
 * 扫描 DOM，把所有带 `data-live-photo` 的元素初始化为 LivePhotoViewer。
 *
 * 特性：
 * - SSR 安全：没有 document 时直接返回空数组。
 * - 幂等：已初始化的元素会被跳过，可安全重复调用（动态内容、HMR）。
 * - 单元素容错：某个元素配置出错只会被跳过并 warn，不影响其它元素。
 *
 * @param root 扫描根节点，默认 document。可传入某个容器只初始化其子树。
 * @param selector 自定义选择器，默认 `[data-live-photo]`。
 * @returns 本次新创建的 LivePhotoViewer 实例数组。
 */
export function autoInit(
  root: ParentNode = typeof document !== 'undefined' ? document : (undefined as unknown as ParentNode),
  selector: string = AUTO_INIT_SELECTOR
): LivePhotoViewer[] {
  if (typeof document === 'undefined' || !root) return [];

  const created: LivePhotoViewer[] = [];
  const elements = Array.from(root.querySelectorAll<HostElement>(selector));

  for (const el of elements) {
    // 幂等：已初始化则跳过
    if (el.hasAttribute(INITIALIZED_ATTR) || el[INSTANCE_KEY]) continue;

    try {
      const options = buildOptions(el);
      if (!options) {
        console.warn(
          '[live-photo] autoInit skipped an element missing data-photo-src or data-video-src:',
          el
        );
        continue;
      }

      const viewer = new LivePhotoViewer(options);
      el[INSTANCE_KEY] = viewer;
      el.setAttribute(INITIALIZED_ATTR, 'true');
      created.push(viewer);
    } catch (err) {
      console.warn('[live-photo] autoInit failed to initialize an element:', el, err);
    }
  }

  return created;
}
