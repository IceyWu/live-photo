<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps<{ code: string; lang?: string }>();
const copied = ref(false);
async function copy() {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1400);
  } catch {}
}
</script>

<template>
  <div class="cb">
    <div class="cb-bar">
      <span class="cb-lang">{{ lang ?? 'ts' }}</span>
      <button class="cb-copy" :class="{ ok: copied }" @click="copy">{{ copied ? 'copied' : 'copy' }}</button>
    </div>
    <pre><code>{{ code }}</code></pre>
  </div>
</template>

<style scoped>
.cb {
  background: var(--surface-2);
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.cb-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 14px;
  border-bottom: 1px solid var(--border);
}
.cb-lang {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-dim);
}
.cb-copy {
  font-size: 12px;
  color: var(--text-dim);
  padding: 2px 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  transition: all 0.15s;
}
.cb-copy:hover { color: var(--accent); border-color: var(--accent); }
.cb-copy.ok { color: #4ade80; border-color: #4ade80; }
pre { margin: 0; padding: 14px 16px; overflow-x: auto; }
code {
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.6;
  color: var(--text);
}
</style>
