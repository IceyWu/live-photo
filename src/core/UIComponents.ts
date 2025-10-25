import type { LivePhotoOptions, ElementCustomization } from '../types';
import { arrowIcon, createProgressLiveIcon } from './icons';

export class UIComponents {
  public static createContainer(options: LivePhotoOptions): HTMLElement {
    const container = document.createElement('div');
    container.className = 'live-photo-container';
    
    if (options.width) {
      const width = typeof options.width === 'number' ? `${options.width}px` : options.width;
      container.style.width = width;
    }
    
    if (options.height) {
      const height = typeof options.height === 'number' ? `${options.height}px` : options.height;
      container.style.height = height;
    }

    if (!options.width && !options.height) {
      container.style.width = '300px';
      container.style.height = '300px';
    }

    // Apply theme
    if (options.theme) {
      container.setAttribute('data-theme', options.theme);
    }

    // Apply borderRadius to container
    if (options.borderRadius) {
      const borderRadius = typeof options.borderRadius === 'number' 
        ? `${options.borderRadius}px` 
        : options.borderRadius;
      container.style.borderRadius = borderRadius;
    }
    
    return container;
  }

  public static createPhoto(
    src: string,
    customization?: ElementCustomization
  ): HTMLImageElement {
    const photo = new Image();
    photo.src = src;
    photo.className = 'live-photo-image';

    if (customization) {
      UIComponents.applyCustomization(photo, customization);
    }

    UIComponents.preventDefaultBehaviors(photo);
    return photo;
  }

  public static createVideo(
    src: string,
    lazyLoad: boolean,
    customization?: ElementCustomization
  ): HTMLVideoElement {
    const video = document.createElement('video');
    video.loop = false;
    video.muted = true;
    video.playsInline = true;
    video.className = 'live-photo-video';

    if (!lazyLoad) {
      video.src = src;
    }

    if (customization) {
      UIComponents.applyCustomization(video, customization);
    }

    UIComponents.preventDefaultBehaviors(video);
    return video;
  }

  public static createBadge(autoplay: boolean): HTMLDivElement {
    const badge = document.createElement('div');
    badge.className = 'live-photo-badge';
    UIComponents.updateBadgeContent(badge, 100, autoplay);
    return badge;
  }

  public static updateBadgeContent(
    badge: HTMLDivElement,
    progress: number,
    autoplay: boolean
  ): void {
    badge.innerHTML = `
      ${createProgressLiveIcon(progress, !autoplay)}
      <span class="live-text">LIVE</span>
      <span class="chevron">${arrowIcon}</span>
    `;
  }

  public static createProgressBar(): HTMLDivElement {
    const progressBar = document.createElement('div');
    progressBar.className = 'live-photo-progress';
    return progressBar;
  }

  public static createDropMenu(autoplay: boolean): HTMLDivElement {
    const menu = document.createElement('div');
    menu.className = 'dropdown-menu';
    
    const button = document.createElement('button');
    button.id = 'toggle-autoplay';
    button.textContent = autoplay ? '关闭自动播放' : '开启自动播放';
    
    menu.appendChild(button);
    return menu;
  }

  private static applyCustomization(
    element: HTMLElement,
    customization: ElementCustomization
  ): void {
    if (customization.styles) {
      Object.assign(element.style, customization.styles);
    }

    if (customization.attributes) {
      Object.entries(customization.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }
  }

  private static preventDefaultBehaviors(element: HTMLElement): void {
    element.style.userSelect = 'none';
    element.style.touchAction = 'manipulation';
    
    const preventDefault = (e: Event) => e.preventDefault();
    
    ['touchstart', 'mousedown', 'selectstart', 'touchmove', 'touchend'].forEach(event => {
      element.addEventListener(event, preventDefault);
    });
  }
}
