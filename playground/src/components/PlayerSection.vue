<script setup lang="ts">
import { LivePhotoViewer } from '../../../src/index';
import { ref, reactive, computed, watch, onUnmounted, nextTick } from 'vue';
import { DEMO_SOURCE } from '../sources';
import CodeBlock from './CodeBlock.vue';

const opts = reactive({
  autoplay: true,
  lazyLoadVideo: false,
  longPressDelay: 300,
  enableVibration: true,
  muted: true,
  showMuteButton: true,
  borderRadius: 12,
  theme: 'auto' as 'light' | 'dark' | 'auto',
  staticBadgeIcon: false,
  preload: 'metadata' as 'auto' | 'metadata' | 'none',
  retryAttempts: 3,
  locale: 'zh-CN' as 'zh-CN' | 'en',
  storageKey: '',
});

const containerRef = ref<HTMLElement | null>(null);
let viewer: LivePhotoViewer | null = null;

interface LogItem { id: number; t: string; name: string; info: string }
const logs = ref<LogItem[]>([]);
const showLog = ref(false);
let seq = 0;
function log(name: string, info = '') {
  const d = new Date();
  const t = [d.getHours(), d.getMinutes(), d.getSeconds()].map(n => String(n).padStart(2, '0')).join(':');
  logs.value.unshift({ id: seq++, t, name, info });
  if (logs.value.length > 30) logs.value.length = 30;
}

async function init() {
  await nextTick();
  if (!containerRef.value) return;
  viewer?.destroy();
  viewer = new LivePhotoViewer({
    ...DEMO_SOURCE,
    container: containerRef.value,
    width: '100%',
    height: '100%',
    ...opts,
    storageKey: opts.storageKey || undefined,
    onPhotoLoad: () => log('photoLoad'),
    onCanPlay: (_e, v) => log('canPlay', `${v.videoWidth}×${v.videoHeight}`),
    onProgress: (p) => log('progress', `${p}%`),
    onEnded: () => log('ended'),
    onMutedChange: (m) => log('mutedChange', String(m)),
    onClick: () => log('click'),
    onError: (err) => log('error', err.message),
  });
}

watch(opts, () => init(), { deep: true });
init();
onUnmounted(() => viewer?.destroy());

const code = computed(() => {
  const lines = [
    `import { LivePhotoViewer } from 'live-photo'`,
    ``,
    `new LivePhotoViewer({`,
    `  photoSrc: 'photo.jpg',`,
    `  videoSrc: 'video.mp4',`,
    `  container: document.getElementById('app'),`,
  ];
  if (!opts.autoplay) lines.push(`  autoplay: false,`);
  if (!opts.muted) lines.push(`  muted: false,`);
  if (opts.lazyLoadVideo) lines.push(`  lazyLoadVideo: true,`);
  if (opts.longPressDelay !== 300) lines.push(`  longPressDelay: ${opts.longPressDelay},`);
  if (!opts.enableVibration) lines.push(`  enableVibration: false,`);
  if (!opts.showMuteButton) lines.push(`  showMuteButton: false,`);
  if (opts.borderRadius !== 12) lines.push(`  borderRadius: ${opts.borderRadius},`);
  if (opts.theme !== 'auto') lines.push(`  theme: '${opts.theme}',`);
  if (opts.staticBadgeIcon) lines.push(`  staticBadgeIcon: true,`);
  if (opts.preload !== 'metadata') lines.push(`  preload: '${opts.preload}',`);
  if (opts.retryAttempts !== 3) lines.push(`  retryAttempts: ${opts.retryAttempts},`);
  if (opts.locale !== 'zh-CN') lines.push(`  locale: '${opts.locale}',`);
  if (opts.storageKey) lines.push(`  storageKey: '${opts.storageKey}',`);
  lines.push(`})`);
  return lines.join('\n');
});
</script>

<template>
  <section id="player" class="sec">
    <div class="container">
      <h2 class="sec-title">在线体验</h2>

      <div class="grid">
        <div class="demo-card">
          <div class="demo-box" ref="containerRef"></div>
        </div>

        <div class="side">
          <!-- Controls -->
          <div class="ctrl-card">
            <div class="ctrl-row"><span>autoplay</span><input type="checkbox" v-model="opts.autoplay" /></div>
            <div class="ctrl-row"><span>muted</span><input type="checkbox" v-model="opts.muted" /></div>
            <div class="ctrl-row"><span>lazyLoadVideo</span><input type="checkbox" v-model="opts.lazyLoadVideo" /></div>
            <div class="ctrl-row"><span>showMuteButton</span><input type="checkbox" v-model="opts.showMuteButton" /></div>
            <div class="ctrl-row"><span>enableVibration</span><input type="checkbox" v-model="opts.enableVibration" /></div>
            <div class="ctrl-row"><span>staticBadgeIcon</span><input type="checkbox" v-model="opts.staticBadgeIcon" /></div>
            <div class="ctrl-row">
              <span>longPressDelay</span>
              <span class="ctrl-val"><input type="range" min="0" max="1000" step="50" v-model.number="opts.longPressDelay" />{{ opts.longPressDelay }}</span>
            </div>
            <div class="ctrl-row">
              <span>borderRadius</span>
              <span class="ctrl-val"><input type="range" min="0" max="40" step="1" v-model.number="opts.borderRadius" />{{ opts.borderRadius }}</span>
            </div>
            <div class="ctrl-row">
              <span>retryAttempts</span>
              <span class="ctrl-val"><input type="range" min="1" max="10" step="1" v-model.number="opts.retryAttempts" />{{ opts.retryAttempts }}</span>
            </div>
            <div class="ctrl-row"><span>theme</span><select v-model="opts.theme"><option>auto</option><option>light</option><option>dark</option></select></div>
            <div class="ctrl-row"><span>preload</span><select v-model="opts.preload"><option>auto</option><option>metadata</option><option>none</option></select></div>
            <div class="ctrl-row"><span>locale</span><select v-model="opts.locale"><option>zh-CN</option><option>en</option></select></div>
            <div class="ctrl-row"><span>storageKey</span><input type="text" v-model="opts.storageKey" placeholder="留空不持久化" /></div>
          </div>

          <CodeBlock :code="code" />
        </div>
      </div>

      <!-- Event log -->
      <div class="log-card">
        <button class="log-toggle" @click="showLog = !showLog">
          事件日志 ({{ logs.length }}) <span class="arrow" :class="{ open: showLog }">▾</span>
        </button>
        <div v-if="showLog" class="log-body">
          <div v-if="!logs.length" class="log-empty">与播放器交互试试</div>
          <div v-for="l in logs" :key="l.id" class="log-row">
            <span class="lt">{{ l.t }}</span>
            <span class="ln">{{ l.name }}</span>
            <span class="li">{{ l.info }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sec { padding: 80px 0; }
.sec-title { font-size: 20px; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 28px; }

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

.demo-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px;
}
.demo-box { width: 100%; aspect-ratio: 4/5; overflow: hidden; border-radius: 8px; }

.side { display: flex; flex-direction: column; gap: 16px; min-width: 0; }

.ctrl-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}
.ctrl-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 40px;
  padding: 0 16px;
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border);
}
.ctrl-row:last-child { border-bottom: none; }
.ctrl-val { display: inline-flex; align-items: center; gap: 8px; color: var(--accent); }
.ctrl-val input[type="range"] { width: 80px; }
.ctrl-row input[type="text"] { width: 120px; }

.log-card {
  margin-top: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}
.log-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
}
.arrow { transition: transform 0.2s; }
.arrow.open { transform: rotate(180deg); }
.log-body {
  max-height: 200px;
  overflow-y: auto;
  border-top: 1px solid var(--border);
  font-family: var(--mono);
  font-size: 12px;
}
.log-empty { padding: 20px; text-align: center; color: var(--text-dim); }
.log-row {
  display: grid;
  grid-template-columns: 60px 100px 1fr;
  gap: 8px;
  padding: 6px 16px;
  border-bottom: 1px solid var(--border);
}
.log-row:last-child { border-bottom: none; }
.lt { color: var(--text-dim); }
.ln { color: var(--accent); }
.li { color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

@media (max-width: 768px) {
  .sec { padding: 56px 0; }
  .grid { grid-template-columns: 1fr; }
  .demo-box { max-width: 320px; margin: 0 auto; }
  .log-row { grid-template-columns: 1fr; gap: 2px; }
}
</style>
