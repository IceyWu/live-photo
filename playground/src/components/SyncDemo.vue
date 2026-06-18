<script setup lang="ts">
import { LivePhotoViewer, createMemoryStore } from '../../../src/index';
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { DEMO_SOURCE } from '../sources';
import CodeBlock from './CodeBlock.vue';

const groupA = ref<HTMLElement | null>(null);
const groupB = ref<HTMLElement | null>(null);
const indep = ref<HTMLElement | null>(null);

const sharedStore = createMemoryStore({ autoplay: true, muted: true });
const storeE = ref<HTMLElement | null>(null);
const storeF = ref<HTMLElement | null>(null);

let viewers: LivePhotoViewer[] = [];
function mount(el: HTMLElement | null, extra: Record<string, unknown>) {
  if (!el) return;
  viewers.push(new LivePhotoViewer({
    ...DEMO_SOURCE,
    container: el,
    width: '100%',
    height: '100%',
    borderRadius: 8,
    ...extra,
  } as ConstructorParameters<typeof LivePhotoViewer>[0]));
}

onMounted(async () => {
  await nextTick();
  mount(groupA.value, { syncGroup: 'demo' });
  mount(groupB.value, { syncGroup: 'demo' });
  mount(indep.value, {});
  mount(storeE.value, { preferencesStore: sharedStore });
  mount(storeF.value, { preferencesStore: sharedStore });
});
onUnmounted(() => { viewers.forEach(v => v.destroy()); viewers = []; });

const groupCode = `new LivePhotoViewer({ ...opts, syncGroup: 'demo' })
new LivePhotoViewer({ ...opts, syncGroup: 'demo' })
// 任一切换 autoplay/muted，另一个实时同步`;

const storeCode = `import { createMemoryStore } from 'live-photo'

const store = createMemoryStore({ autoplay: true, muted: true })
new LivePhotoViewer({ ...opts, preferencesStore: store })
// store.set({ muted: false }) 可从外部驱动`;
</script>

<template>
  <section id="sync" class="sec">
    <div class="container">
      <h2 class="sec-title">偏好同步</h2>

      <div class="block">
        <h3 class="block-title">syncGroup — A、B 同组联动，C 独立</h3>
        <div class="demos">
          <div class="demo-cell"><span class="lbl">A</span><div class="sq" ref="groupA"></div></div>
          <div class="demo-cell"><span class="lbl">B</span><div class="sq" ref="groupB"></div></div>
          <div class="demo-cell"><span class="lbl">C</span><div class="sq" ref="indep"></div></div>
        </div>
        <CodeBlock :code="groupCode" />
      </div>

      <div class="block">
        <h3 class="block-title">preferencesStore — 共享自定义 store</h3>
        <div class="store-btns">
          <button class="btn btn-ghost" @click="sharedStore.set({ muted: true })">静音</button>
          <button class="btn btn-ghost" @click="sharedStore.set({ muted: false })">取消静音</button>
          <button class="btn btn-ghost" @click="sharedStore.set({ autoplay: false })">关自动播放</button>
        </div>
        <div class="demos">
          <div class="demo-cell"><span class="lbl">E</span><div class="sq" ref="storeE"></div></div>
          <div class="demo-cell"><span class="lbl">F</span><div class="sq" ref="storeF"></div></div>
        </div>
        <CodeBlock :code="storeCode" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.sec { padding: 80px 0; }
.sec-title { font-size: 20px; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 28px; }

.block {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
}
.block + .block { margin-top: 20px; }
.block-title { font-size: 15px; font-weight: 500; margin-bottom: 16px; color: var(--text-muted); }

.demos { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; }
.demo-cell { display: flex; flex-direction: column; gap: 6px; }
.lbl { font-family: var(--mono); font-size: 12px; color: var(--text-dim); }
.sq { width: 160px; height: 160px; overflow: hidden; border-radius: 8px; border: 1px solid var(--border); }

.store-btns { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }

@media (max-width: 768px) {
  .sec { padding: 56px 0; }
  .sq { width: 140px; height: 140px; }
}
</style>
