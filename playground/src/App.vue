<script setup lang="ts">
import { LivePhotoViewer } from "../../src/index";
import { ref, watch, nextTick, onUnmounted, reactive } from "vue";
import ExtractDemo from "./components/ExtractDemo.vue";

// ─── 可配置参数 ───────────────────────────────────────────────────────────────

const config = reactive({
  // Behavior
  autoplay: true,
  lazyLoadVideo: false,
  longPressDelay: 300,
  // Audio
  muted: true,
  showMuteButton: true,
  // Styling
  borderRadius: 8,
  theme: 'auto' as 'light' | 'dark' | 'auto',
  // Loading
  preload: 'metadata' as 'auto' | 'metadata' | 'none',
  retryAttempts: 3,
  // Badge
  staticBadgeIcon: false,
  enableVibration: true,
  // i18n
  locale: 'zh-CN',
  // Persistence
  storageKey: 'live-photo-playground',
});

// ─── 事件日志 ─────────────────────────────────────────────────────────────────

interface EventLog {
  id: number;
  time: string;
  name: string;
  params: Record<string, string | number | boolean | undefined>;
}

let logIdSeq = 0;
const logs = ref<EventLog[]>([]);
const MAX_LOGS = 100;

function addLog(name: string, params: Record<string, string | number | boolean | undefined>) {
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
  logs.value.unshift({ id: logIdSeq++, time, name, params });
  if (logs.value.length > MAX_LOGS) logs.value.length = MAX_LOGS;
}

function clearLogs() { logs.value = []; }

function formatParam(val: unknown): string {
  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val instanceof HTMLElement) return `<${val.tagName.toLowerCase()}${val.id ? '#' + val.id : ''}>`;
  if (val instanceof Event) return `Event(${val.type})`;
  if (typeof val === 'object') {
    try { return JSON.stringify(val, null, 0); } catch { return String(val); }
  }
  return String(val);
}

// ─── Viewer ───────────────────────────────────────────────────────────────────

const demoSource = {
  photoSrc: "https://lpalette.oss-accelerate.aliyuncs.com/go_oss/prod/mkIo6X4FryYKOcUzuz4Kew/2026-06-15/3c14973c-bfbb-4d8b-9296-d3be902e3171.jpeg",
  videoSrc: "https://lpalette.oss-accelerate.aliyuncs.com/go_oss/prod/mkIo6X4FryYKOcUzuz4Kew/2026-06-15/2936e9fc-fa45-4249-8f31-359133ec1bea.mov",
};

const containerRef = ref<HTMLElement | null>(null);
const activeTab = ref<'viewer' | 'extract'>('viewer');
let viewer: LivePhotoViewer | null = null;

const initViewer = async () => {
  await nextTick();
  if (!containerRef.value) return;
  if (viewer) { viewer.destroy(); viewer = null; }

  viewer = new LivePhotoViewer({
    photoSrc: demoSource.photoSrc,
    videoSrc: demoSource.videoSrc,
    container: containerRef.value,
    height: "100%",
    // 可配置参数
    autoplay: config.autoplay,
    lazyLoadVideo: config.lazyLoadVideo,
    longPressDelay: config.longPressDelay,
    muted: config.muted,
    showMuteButton: config.showMuteButton,
    borderRadius: config.borderRadius,
    theme: config.theme,
    preload: config.preload,
    retryAttempts: config.retryAttempts,
    staticBadgeIcon: config.staticBadgeIcon,
    enableVibration: config.enableVibration,
    locale: config.locale,
    storageKey: config.storageKey || undefined,
    // 回调
    onProgress: (progress, event, video) => {
      addLog('onProgress', { progress: `${progress}%`, duration: video.duration?.toFixed(2) + 's', buffered: video.buffered.length > 0 ? (video.buffered.end(0) / video.duration * 100).toFixed(1) + '%' : '—', event: formatParam(event) });
    },
    onCanPlay: (event, video) => {
      addLog('onCanPlay', { readyState: video.readyState, duration: video.duration?.toFixed(2) + 's', videoWidth: video.videoWidth, videoHeight: video.videoHeight, event: formatParam(event) });
    },
    onEnded: (event, video) => {
      addLog('onEnded', { currentTime: video.currentTime?.toFixed(2) + 's', event: formatParam(event) });
    },
    onPhotoLoad: (event, photo) => {
      addLog('onPhotoLoad', { naturalWidth: photo.naturalWidth, naturalHeight: photo.naturalHeight, src: photo.src.split('/').pop(), event: formatParam(event) });
    },
    onVideoLoad: (duration, event, video) => {
      addLog('onVideoLoad', { duration: duration.toFixed(2) + 's', videoWidth: video.videoWidth, videoHeight: video.videoHeight, event: formatParam(event) });
    },
    onLoadStart: () => { addLog('onLoadStart', {}); },
    onLoadProgress: (loaded, total) => {
      addLog('onLoadProgress', { loaded: loaded.toFixed(2) + 's', total: total?.toFixed(2) + 's', percent: total ? (loaded / total * 100).toFixed(1) + '%' : '—' });
    },
    onMutedChange: (muted, video) => {
      addLog('onMutedChange', { muted, volume: video.volume });
    },
    onClick: (event) => {
      addLog('onClick', { type: event.type, target: formatParam(event.target) });
    },
    onError: (error, event) => {
      addLog('onError', { type: error.type, message: error.message, originalError: error.originalError?.message, event: formatParam(event) });
    },
  });
};

// 参数变更后重新初始化
function applyConfig() { initViewer(); }

watch(activeTab, async (newTab) => {
  if (newTab === 'viewer') { await initViewer(); }
  else { viewer?.destroy(); viewer = null; }
}, { immediate: true });

onUnmounted(() => { viewer?.destroy(); });
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Live Photo Playground</h1>
      <nav class="tabs">
        <button :class="['tab', { active: activeTab === 'viewer' }]" @click="activeTab = 'viewer'">播放器演示</button>
        <button :class="['tab', { active: activeTab === 'extract' }]" @click="activeTab = 'extract'">实况提取</button>
      </nav>
    </header>

    <main class="content">
      <ExtractDemo v-if="activeTab === 'extract'" />

      <div v-if="activeTab === 'viewer'" class="viewer-layout">

        <!-- 左：播放器 + 事件日志 -->
        <div class="viewer-main">
          <div class="viewer-container" ref="containerRef"></div>

          <div class="event-panel">
            <div class="event-panel-header">
              <span class="event-panel-title">事件日志 <span class="log-count">{{ logs.length }}</span></span>
              <button class="clear-btn" @click="clearLogs">清空</button>
            </div>
            <div class="event-list">
              <div v-if="logs.length === 0" class="event-empty">等待事件触发...</div>
              <div v-for="log in logs" :key="log.id" class="event-item">
                <span class="event-time">{{ log.time }}</span>
                <span class="event-name" :class="log.name">{{ log.name }}</span>
                <div class="event-params">
                  <template v-for="(val, key) in log.params" :key="key">
                    <span class="param-key">{{ key }}</span>
                    <span class="param-val">{{ val }}</span>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右：参数配置面板 -->
        <div class="config-panel">
          <div class="config-panel-header">
            <span>参数配置</span>
            <button class="apply-btn" @click="applyConfig">应用并重载</button>
          </div>

          <div class="config-body">

            <div class="config-section">
              <div class="section-title">行为</div>

              <label class="config-row">
                <span class="config-label">autoplay</span>
                <input type="checkbox" v-model="config.autoplay" />
                <span class="config-val">{{ config.autoplay }}</span>
              </label>

              <label class="config-row">
                <span class="config-label">lazyLoadVideo</span>
                <input type="checkbox" v-model="config.lazyLoadVideo" />
                <span class="config-val">{{ config.lazyLoadVideo }}</span>
              </label>

              <label class="config-row">
                <span class="config-label">longPressDelay</span>
                <input type="range" min="0" max="1000" step="50" v-model.number="config.longPressDelay" />
                <span class="config-val">{{ config.longPressDelay }}ms</span>
              </label>

              <label class="config-row">
                <span class="config-label">enableVibration</span>
                <input type="checkbox" v-model="config.enableVibration" />
                <span class="config-val">{{ config.enableVibration }}</span>
              </label>
            </div>

            <div class="config-section">
              <div class="section-title">音频</div>

              <label class="config-row">
                <span class="config-label">muted</span>
                <input type="checkbox" v-model="config.muted" />
                <span class="config-val">{{ config.muted }}</span>
              </label>

              <label class="config-row">
                <span class="config-label">showMuteButton</span>
                <input type="checkbox" v-model="config.showMuteButton" />
                <span class="config-val">{{ config.showMuteButton }}</span>
              </label>
            </div>

            <div class="config-section">
              <div class="section-title">样式</div>

              <label class="config-row">
                <span class="config-label">borderRadius</span>
                <input type="range" min="0" max="50" step="1" v-model.number="config.borderRadius" />
                <span class="config-val">{{ config.borderRadius }}px</span>
              </label>

              <label class="config-row">
                <span class="config-label">theme</span>
                <select v-model="config.theme">
                  <option value="auto">auto</option>
                  <option value="light">light</option>
                  <option value="dark">dark</option>
                </select>
                <span class="config-val">{{ config.theme }}</span>
              </label>

              <label class="config-row">
                <span class="config-label">staticBadgeIcon</span>
                <input type="checkbox" v-model="config.staticBadgeIcon" />
                <span class="config-val">{{ config.staticBadgeIcon }}</span>
              </label>
            </div>

            <div class="config-section">
              <div class="section-title">加载</div>

              <label class="config-row">
                <span class="config-label">preload</span>
                <select v-model="config.preload">
                  <option value="auto">auto</option>
                  <option value="metadata">metadata</option>
                  <option value="none">none</option>
                </select>
                <span class="config-val">{{ config.preload }}</span>
              </label>

              <label class="config-row">
                <span class="config-label">retryAttempts</span>
                <input type="range" min="1" max="10" step="1" v-model.number="config.retryAttempts" />
                <span class="config-val">{{ config.retryAttempts }}</span>
              </label>
            </div>

            <div class="config-section">
              <div class="section-title">国际化</div>

              <label class="config-row">
                <span class="config-label">locale</span>
                <select v-model="config.locale">
                  <option value="zh-CN">zh-CN</option>
                  <option value="en">en</option>
                </select>
                <span class="config-val">{{ config.locale }}</span>
              </label>
            </div>

            <div class="config-section">
              <div class="section-title">持久化</div>

              <label class="config-row">
                <span class="config-label">storageKey</span>
                <input type="text" v-model="config.storageKey" placeholder="留空则不持久化" />
                <span class="config-val">{{ config.storageKey || '—' }}</span>
              </label>
            </div>

          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app { min-height: 100vh; }

.header {
  padding: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.header h1 { margin: 0 0 16px; font-size: 24px; text-align: center; }

.tabs { display: flex; justify-content: center; gap: 8px; }
.tab {
  padding: 8px 20px; font-size: 14px;
  background: transparent; border: 1px solid rgba(255,255,255,0.2);
  border-radius: 6px; cursor: pointer; transition: all 0.2s;
}
.tab:hover { border-color: #646cff; color: #646cff; }
.tab.active { background: #646cff; color: white; border-color: #646cff; }

.content { padding: 20px; }

/* ─── 两栏布局 ─── */
.viewer-layout {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 20px;
  align-items: start;
}

.viewer-main { display: flex; flex-direction: column; gap: 16px; }

.viewer-container {
  height: 400px;
  overflow: hidden;
}

/* ─── 事件面板 ─── */
.event-panel {
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255,255,255,0.03);
}
.event-panel-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255,255,255,0.06);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.event-panel-title {
  font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.7);
  display: flex; align-items: center; gap: 6px;
}
.log-count {
  background: #646cff; color: #fff;
  font-size: 11px; font-weight: 700;
  padding: 1px 6px; border-radius: 10px; min-width: 18px; text-align: center;
}
.clear-btn {
  font-size: 12px; padding: 3px 10px;
  border: 1px solid rgba(255,255,255,0.2); border-radius: 4px;
  background: transparent; color: rgba(255,255,255,0.5); cursor: pointer;
}
.clear-btn:hover { border-color: rgba(255,255,255,0.4); color: rgba(255,255,255,0.8); }

.event-list {
  height: 220px; overflow-y: auto;
  font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px;
}
.event-empty {
  display: flex; align-items: center; justify-content: center;
  height: 100%; color: rgba(255,255,255,0.25); font-size: 13px;
}
.event-item {
  display: grid; grid-template-columns: 90px 130px 1fr;
  align-items: baseline; gap: 8px;
  padding: 5px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.event-item:hover { background: rgba(255,255,255,0.04); }
.event-item:last-child { border-bottom: none; }
.event-time { color: rgba(255,255,255,0.3); font-size: 11px; white-space: nowrap; }
.event-name { font-weight: 600; white-space: nowrap; color: #a5f3a5; }
.event-name.onError { color: #f87171; }
.event-name.onProgress { color: #93c5fd; }
.event-name.onLoadProgress { color: #93c5fd; }
.event-name.onCanPlay { color: #6ee7b7; }
.event-name.onVideoLoad { color: #6ee7b7; }
.event-name.onPhotoLoad { color: #d9f99d; }
.event-name.onEnded { color: #fcd34d; }
.event-name.onLoadStart { color: #c4b5fd; }
.event-name.onMutedChange { color: #fbcfe8; }
.event-name.onClick { color: #fdba74; }
.event-params {
  display: flex; flex-wrap: wrap; gap: 4px 10px;
  color: rgba(255,255,255,0.55);
}
.param-key { color: rgba(255,255,255,0.35); }
.param-key::after { content: ':'; }
.param-val {
  color: rgba(255,255,255,0.7);
  max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

/* ─── 配置面板 ─── */
.config-panel {
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255,255,255,0.03);
  position: sticky;
  top: 20px;
}
.config-panel-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255,255,255,0.06);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.7);
}
.apply-btn {
  font-size: 12px; padding: 4px 12px;
  background: #646cff; color: #fff;
  border: none; border-radius: 4px; cursor: pointer;
  transition: opacity 0.2s;
}
.apply-btn:hover { opacity: 0.85; }

.config-body {
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  padding: 4px 0;
}

.config-section { padding: 8px 0 4px; }
.config-section + .config-section { border-top: 1px solid rgba(255,255,255,0.06); }

.section-title {
  font-size: 11px; font-weight: 700; letter-spacing: 0.05em;
  color: rgba(255,255,255,0.3); text-transform: uppercase;
  padding: 4px 12px 6px;
}

.config-row {
  display: grid;
  grid-template-columns: 110px auto 1fr;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s;
}
.config-row:hover { background: rgba(255,255,255,0.04); }

.config-label {
  font-size: 12px; font-family: 'SF Mono', 'Fira Code', monospace;
  color: rgba(255,255,255,0.6); white-space: nowrap;
}

.config-row input[type="checkbox"] { width: 14px; height: 14px; cursor: pointer; accent-color: #646cff; }
.config-row input[type="range"] { width: 80px; accent-color: #646cff; cursor: pointer; }
.config-row input[type="text"] {
  width: 80px; font-size: 12px;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
  border-radius: 4px; color: rgba(255,255,255,0.8); padding: 2px 6px;
}
.config-row select {
  font-size: 12px; background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15); border-radius: 4px;
  color: rgba(255,255,255,0.8); padding: 2px 4px; cursor: pointer;
}

.config-val {
  font-size: 11px; font-family: 'SF Mono', 'Fira Code', monospace;
  color: #646cff; white-space: nowrap;
}

/* ─── 浅色主题 ─── */
@media (prefers-color-scheme: light) {
  .header { border-color: rgba(0,0,0,0.1); }
  .tab { border-color: rgba(0,0,0,0.2); }
  .event-panel, .config-panel { border-color: rgba(0,0,0,0.1); background: rgba(0,0,0,0.02); }
  .event-panel-header, .config-panel-header { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.08); }
  .event-panel-title, .config-panel-header { color: rgba(0,0,0,0.6); }
  .clear-btn { border-color: rgba(0,0,0,0.2); color: rgba(0,0,0,0.45); }
  .clear-btn:hover { border-color: rgba(0,0,0,0.4); color: rgba(0,0,0,0.7); }
  .event-empty { color: rgba(0,0,0,0.25); }
  .event-item { border-color: rgba(0,0,0,0.05); }
  .event-item:hover { background: rgba(0,0,0,0.03); }
  .event-time { color: rgba(0,0,0,0.35); }
  .event-name { color: #15803d; }
  .event-name.onError { color: #dc2626; }
  .event-name.onProgress, .event-name.onLoadProgress { color: #2563eb; }
  .event-name.onCanPlay, .event-name.onVideoLoad { color: #059669; }
  .event-name.onPhotoLoad { color: #65a30d; }
  .event-name.onEnded { color: #d97706; }
  .event-name.onLoadStart { color: #7c3aed; }
  .event-name.onMutedChange { color: #db2777; }
  .event-name.onClick { color: #ea580c; }
  .event-params { color: rgba(0,0,0,0.5); }
  .param-key { color: rgba(0,0,0,0.35); }
  .param-val { color: rgba(0,0,0,0.7); }
  .section-title { color: rgba(0,0,0,0.3); }
  .config-label { color: rgba(0,0,0,0.6); }
  .config-section + .config-section { border-color: rgba(0,0,0,0.06); }
  .config-row:hover { background: rgba(0,0,0,0.03); }
  .config-row input[type="text"],
  .config-row select {
    background: rgba(0,0,0,0.05);
    border-color: rgba(0,0,0,0.15);
    color: rgba(0,0,0,0.8);
  }
}
</style>
