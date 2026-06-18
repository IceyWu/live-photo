import type { LivePhotoPrefs, PreferencesStore } from '../types';
import { loadPrefs, savePrefs, prefsStorageKey } from '../utils/storage';

type Listener = (prefs: LivePhotoPrefs) => void;

/**
 * 内存偏好存储。把同一个实例传给多个 viewer，即可让它们在同页面内实时同步。
 * `set` 带脏检查：只有值真正变化时才通知订阅者，因此天然不会产生回环。
 */
export function createMemoryStore(initial: LivePhotoPrefs = {}): PreferencesStore {
  let prefs: LivePhotoPrefs = {
    ...(initial.autoplay !== undefined ? { autoplay: initial.autoplay } : {}),
    ...(initial.muted !== undefined ? { muted: initial.muted } : {}),
  };
  const listeners = new Set<Listener>();

  return {
    get: () => ({ ...prefs }),
    set(patch) {
      let changed = false;
      const next: LivePhotoPrefs = { ...prefs };
      if (patch.autoplay !== undefined && patch.autoplay !== prefs.autoplay) {
        next.autoplay = patch.autoplay;
        changed = true;
      }
      if (patch.muted !== undefined && patch.muted !== prefs.muted) {
        next.muted = patch.muted;
        changed = true;
      }
      if (!changed) return;
      prefs = next;
      const snapshot = { ...prefs };
      listeners.forEach(listener => listener(snapshot));
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

/**
 * 给一个内存 store 叠加 localStorage 持久化与跨标签页同步：
 * - 写入时落盘；
 * - 监听 storage 事件，把其它标签页的变更推回 store（不再落盘，避免回环）。
 */
function withPersistence(base: PreferencesStore, storageKey: string): PreferencesStore {
  const store: PreferencesStore = {
    get: () => base.get(),
    set(patch) {
      base.set(patch);
      savePrefs(storageKey, base.get());
    },
    subscribe: listener => base.subscribe(listener),
  };

  if (typeof window !== 'undefined') {
    const fullKey = prefsStorageKey(storageKey);
    window.addEventListener('storage', event => {
      if (event.key === fullKey) base.set(loadPrefs(storageKey));
    });
  }

  return store;
}

// ─── 缓存：同一标识只构造一份 store，保证多个 viewer 命中同一个实例 ──────────────

const sharedStores = new Map<string, PreferencesStore>();
const storageStores = new Map<string, PreferencesStore>();
const combinedStores = new Map<string, PreferencesStore>();

/** 按名称获取（或惰性创建）一个共享内存 store，用于同页面实时同步。*/
export function getSharedStore(name: string): PreferencesStore {
  let store = sharedStores.get(name);
  if (!store) {
    store = createMemoryStore();
    sharedStores.set(name, store);
  }
  return store;
}

/** 按 storageKey 获取（或惰性创建）一个持久化 store（持久化 + 跨标签页同步）。*/
export function createStorageStore(storageKey: string): PreferencesStore {
  let store = storageStores.get(storageKey);
  if (!store) {
    store = withPersistence(createMemoryStore(loadPrefs(storageKey)), storageKey);
    storageStores.set(storageKey, store);
  }
  return store;
}

/** 同页面共享 + 持久化 + 跨标签页同步（syncGroup 与 storageKey 同时设置时使用）。*/
function getSharedPersistentStore(name: string, storageKey: string): PreferencesStore {
  const cacheKey = `${name}\u0000${storageKey}`;
  let store = combinedStores.get(cacheKey);
  if (!store) {
    store = withPersistence(createMemoryStore(loadPrefs(storageKey)), storageKey);
    combinedStores.set(cacheKey, store);
  }
  return store;
}

/**
 * 根据选项解析出要使用的 store。优先级：显式 store > 分组+持久化 > 分组 > 持久化。
 * 都没有时返回 undefined，由调用方退化为「实例私有内存 store」。
 */
export function resolvePreferencesStore(opts: {
  preferencesStore?: PreferencesStore;
  syncGroup?: string;
  storageKey?: string;
}): PreferencesStore | undefined {
  if (opts.preferencesStore) return opts.preferencesStore;
  if (opts.syncGroup && opts.storageKey) return getSharedPersistentStore(opts.syncGroup, opts.storageKey);
  if (opts.syncGroup) return getSharedStore(opts.syncGroup);
  if (opts.storageKey) return createStorageStore(opts.storageKey);
  return undefined;
}
