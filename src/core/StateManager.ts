import type { LivePhotoState } from '../types';

export class StateManager {
  private state: LivePhotoState;
  private listeners: Set<(state: LivePhotoState) => void>;
  // 缓存上一次冻结的快照，state 未变化时直接复用，避免频繁分配对象
  private cachedSnapshot?: Readonly<LivePhotoState>;

  constructor(initialState: Partial<LivePhotoState> = {}) {
    this.state = {
      isPlaying: false,
      autoplay: true,
      videoError: false,
      videoLoaded: false,
      isLongPressPlaying: false,
      muted: true,
      ...initialState,
    };
    this.listeners = new Set();
  }

  public getState(): Readonly<LivePhotoState> {
    if (!this.cachedSnapshot) {
      this.cachedSnapshot = Object.freeze({ ...this.state });
    }
    return this.cachedSnapshot;
  }

  public setState(updates: Partial<LivePhotoState>): void {
    // 脏检查：所有字段都没变则跳过
    const hasChange = (Object.keys(updates) as (keyof LivePhotoState)[])
      .some(k => this.state[k] !== updates[k]);
    if (!hasChange) return;
    this.state = { ...this.state, ...updates };
    this.cachedSnapshot = undefined; // 使缓存失效
    this.notifyListeners();
  }

  public subscribe(listener: (state: LivePhotoState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const currentState = this.getState();
    this.listeners.forEach(listener => listener(currentState));
  }

  public destroy(): void {
    this.listeners.clear();
  }
}
