interface PersistedPrefs {
  autoplay: boolean;
  muted: boolean;
}

const SUFFIX = ':live-photo-prefs';

/** 返回某个 storageKey 在 localStorage 中实际使用的完整键名（用于 storage 事件匹配）。*/
export function prefsStorageKey(storageKey: string): string {
  return `${storageKey}${SUFFIX}`;
}

export function loadPrefs(storageKey: string): Partial<PersistedPrefs> {
  try {
    const raw = localStorage.getItem(prefsStorageKey(storageKey));
    if (!raw) return {};
    return JSON.parse(raw) as Partial<PersistedPrefs>;
  } catch {
    return {};
  }
}

export function savePrefs(storageKey: string, prefs: Partial<PersistedPrefs>): void {
  try {
    localStorage.setItem(prefsStorageKey(storageKey), JSON.stringify(prefs));
  } catch {
    // localStorage 不可用时静默失败（隐身模式等）
  }
}
