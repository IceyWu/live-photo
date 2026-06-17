interface PersistedPrefs {
  autoplay: boolean;
  muted: boolean;
}

const SUFFIX = ':live-photo-prefs';

export function loadPrefs(storageKey: string): Partial<PersistedPrefs> {
  try {
    const raw = localStorage.getItem(`${storageKey}${SUFFIX}`);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<PersistedPrefs>;
  } catch {
    return {};
  }
}

export function savePrefs(storageKey: string, prefs: Partial<PersistedPrefs>): void {
  try {
    localStorage.setItem(`${storageKey}${SUFFIX}`, JSON.stringify(prefs));
  } catch {
    // localStorage 不可用时静默失败（隐身模式等）
  }
}
