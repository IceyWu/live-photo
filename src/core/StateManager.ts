import type { LivePhotoState } from '../types';

export class StateManager {
  private state: LivePhotoState;
  private listeners: Set<(state: LivePhotoState) => void>;

  constructor(initialState: Partial<LivePhotoState> = {}) {
    this.state = {
      isPlaying: false,
      autoplay: true,
      videoError: false,
      videoLoaded: false,
      aspectRatio: 1,
      isLongPressPlaying: false,
      ...initialState,
    };
    this.listeners = new Set();
  }

  public getState(): Readonly<LivePhotoState> {
    return Object.freeze({ ...this.state });
  }

  public setState(updates: Partial<LivePhotoState>): void {
    this.state = { ...this.state, ...updates };
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
