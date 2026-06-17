import type { LivePhotoOptions, ElementCustomization, LivePhotoLabels } from '../types';
import { arrowIcon, createProgressLiveIcon, volumeOnIcon, volumeOffIcon, autoplayOnIcon, autoplayOffIcon } from './icons';

// ─── 容器 ─────────────────────────────────────────────────────────────────────

export function createContainer(options: LivePhotoOptions): HTMLElement {
  const container = document.createElement('div');
  container.className = 'live-photo-container';

  if (options.width) {
    container.style.width = typeof options.width === 'number' ? `${options.width}px` : options.width;
  }
  if (options.height) {
    container.style.height = typeof options.height === 'number' ? `${options.height}px` : options.height;
  }
  if (!options.width && !options.height) {
    container.style.width = '300px';
    container.style.height = '300px';
  }
  if (options.theme) {
    container.setAttribute('data-theme', options.theme);
  }
  if (options.borderRadius) {
    container.style.borderRadius = typeof options.borderRadius === 'number'
      ? `${options.borderRadius}px`
      : options.borderRadius;
  }

  return container;
}

// ─── 图片 ─────────────────────────────────────────────────────────────────────

export function createPhoto(
  src: string,
  customization?: ElementCustomization
): { element: HTMLImageElement; cleanup: () => void } {
  const photo = new Image();
  photo.src = src;
  photo.className = 'live-photo-image';

  if (customization) applyCustomization(photo, customization);

  const cleanup = attachPreventDefaults(photo);
  return { element: photo, cleanup };
}

// ─── 视频 ─────────────────────────────────────────────────────────────────────

export function createVideo(
  customization?: ElementCustomization,
  muted: boolean = true,
  preload: 'auto' | 'metadata' | 'none' = 'metadata'
): { element: HTMLVideoElement; cleanup: () => void } {
  const video = document.createElement('video');
  video.loop = false;
  video.muted = muted;
  video.playsInline = true;
  video.preload = preload;
  video.className = 'live-photo-video';
  // src 由 VideoLoader 统一设置（支持重试），此处不赋值

  if (customization) applyCustomization(video, customization);

  const cleanup = attachPreventDefaults(video);
  return { element: video, cleanup };
}

// ─── 徽标 ─────────────────────────────────────────────────────────────────────

export function createBadge(
  autoplay: boolean,
  staticIcon: boolean = false,
  liveText: string = 'LIVE'
): HTMLDivElement {
  const badge = document.createElement('div');
  badge.className = 'live-photo-badge';
  badge.setAttribute('role', 'button');
  badge.setAttribute('tabindex', '0');
  badge.setAttribute('aria-haspopup', 'menu');
  badge.setAttribute('aria-expanded', 'false');
  badge.setAttribute('aria-label', liveText);
  updateBadgeContent(badge, 100, autoplay, staticIcon, liveText);
  return badge;
}

export function updateBadgeContent(
  badge: HTMLDivElement,
  progress: number,
  autoplay: boolean,
  staticIcon: boolean = false,
  liveText: string = 'LIVE'
): void {
  const showSlash = staticIcon ? false : !autoplay;
  badge.innerHTML = `
    ${createProgressLiveIcon(progress, showSlash)}
    <span class="live-text">${liveText}</span>
    <span class="chevron">${arrowIcon}</span>
  `;
}

// ─── 进度条 / 遮罩 ────────────────────────────────────────────────────────────

export function createProgressBar(): HTMLDivElement {
  const progressBar = document.createElement('div');
  progressBar.className = 'live-photo-progress';
  return progressBar;
}

export function createOverlay(): HTMLDivElement {
  const overlay = document.createElement('div');
  overlay.className = 'live-photo-overlay';
  return overlay;
}

// ─── 下拉菜单 ─────────────────────────────────────────────────────────────────

export function createDropMenu(
  autoplay: boolean,
  options?: { muted?: boolean; showMuteButton?: boolean; labels: LivePhotoLabels }
): HTMLDivElement {
  const menu = document.createElement('div');
  menu.className = 'dropdown-menu';
  menu.setAttribute('role', 'menu');

  const labels = options?.labels;

  const button = document.createElement('button');
  button.id = 'toggle-autoplay';
  button.className = 'live-photo-menu-item';
  button.type = 'button';
  button.setAttribute('role', 'menuitem');
  button.innerHTML = getMenuItemContent(
    autoplay ? autoplayOnIcon : autoplayOffIcon,
    autoplay ? labels!.disableAutoplay : labels!.enableAutoplay
  );
  menu.appendChild(button);

  if (options?.showMuteButton !== false) {
    const muted = options?.muted ?? true;
    const muteButton = document.createElement('button');
    muteButton.id = 'toggle-mute';
    muteButton.className = 'live-photo-menu-item';
    muteButton.type = 'button';
    muteButton.setAttribute('role', 'menuitem');
    muteButton.innerHTML = getMenuItemContent(
      muted ? volumeOffIcon : volumeOnIcon,
      muted ? labels!.unmute : labels!.mute
    );
    menu.appendChild(muteButton);
  }

  return menu;
}

export function updateAutoplayButton(
  menu: HTMLDivElement,
  autoplay: boolean,
  labels: LivePhotoLabels
): void {
  const button = menu.querySelector<HTMLElement>('#toggle-autoplay');
  if (button) {
    const label = autoplay ? labels.disableAutoplay : labels.enableAutoplay;
    button.setAttribute('aria-label', label);
    button.innerHTML = getMenuItemContent(
      autoplay ? autoplayOnIcon : autoplayOffIcon,
      label
    );
  }
}

export function updateMuteButton(
  menu: HTMLDivElement,
  muted: boolean,
  labels: LivePhotoLabels
): void {
  const muteButton = menu.querySelector<HTMLElement>('#toggle-mute');
  if (muteButton) {
    const label = muted ? labels.unmute : labels.mute;
    muteButton.setAttribute('aria-label', label);
    muteButton.innerHTML = getMenuItemContent(
      muted ? volumeOffIcon : volumeOnIcon,
      label
    );
  }
}

// ─── 私有工具 ─────────────────────────────────────────────────────────────────

function getMenuItemContent(icon: string, text: string): string {
  return `
    <span class="menu-item-icon">${icon}</span>
    <span class="menu-item-text">${text}</span>
  `;
}

function applyCustomization(element: HTMLElement, customization: ElementCustomization): void {
  if (customization.styles) {
    Object.assign(element.style, customization.styles);
  }
  if (customization.attributes) {
    Object.entries(customization.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
}

/**
 * 1. 阻止默认行为并返回 cleanup 函数，供 destroy 时清理。
 */
function attachPreventDefaults(element: HTMLElement): () => void {
  const preventDefault = (e: Event) => e.preventDefault();
  element.style.userSelect = 'none';
  element.style.touchAction = 'manipulation';
  const events = ['touchstart', 'mousedown', 'selectstart', 'touchmove', 'touchend'] as const;
  events.forEach(ev => element.addEventListener(ev, preventDefault));
  return () => events.forEach(ev => element.removeEventListener(ev, preventDefault));
}

// UIComponents 命名空间已废弃，请直接使用各导出函数。
// 保留空对象仅防止残余 import 语句编译报错，下一个大版本将移除。
/** @deprecated 请直接 import 各函数，例如 `import { createBadge } from './UIComponents'` */
export const UIComponents = {} as never;
