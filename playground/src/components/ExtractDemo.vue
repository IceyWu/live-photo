<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { extractFromLivePhoto, LivePhotoViewer } from '../../../src/index';
import type { ExtractResult } from '../../../src/index';
import { revokeUrls, downloadBlob } from '../utils/helpers';
import CodeBlock from './CodeBlock.vue';

const fileInput = ref<HTMLInputElement | null>(null);
const result = ref<ExtractResult | null>(null);
const processing = ref(false);
const error = ref('');
const previewRef = ref<HTMLElement | null>(null);
let viewer: LivePhotoViewer | null = null;

async function handleFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (result.value) revokeUrls(result.value.photoUrl, result.value.videoUrl);
  if (viewer) { viewer.destroy(); viewer = null; }
  result.value = null;
  error.value = '';
  processing.value = true;
  try {
    const r = await extractFromLivePhoto(file);
    if (!r) { error.value = '无法提取，请确保文件格式正确'; return; }
    result.value = r;
    await nextTick();
    if (previewRef.value) {
      viewer = new LivePhotoViewer({
        photoSrc: r.photoUrl,
        videoSrc: r.videoUrl,
        container: previewRef.value,
        width: '100%',
        height: '100%',
        borderRadius: 8,
      });
    }
  } catch { error.value = '处理出错'; }
  finally { processing.value = false; }
}

function dl(type: 'photo' | 'video') {
  if (!result.value) return;
  downloadBlob(type === 'photo' ? result.value.photoBlob : result.value.videoBlob, `livephoto-${type}.${type === 'photo' ? 'jpg' : 'mp4'}`);
}

const code = `import { extractFromLivePhoto } from 'live-photo'

const result = await extractFromLivePhoto(file)
// result.photoBlob / result.videoBlob
// result.photoUrl / result.videoUrl`;
</script>

<template>
  <section id="extract" class="sec">
    <div class="container">
      <h2 class="sec-title">实况提取</h2>

      <div class="card">
        <div class="pick">
          <input ref="fileInput" type="file" accept="image/*" @change="handleFile" hidden />
          <button class="btn btn-primary" :disabled="processing" @click="fileInput?.click()">
            {{ processing ? '处理中…' : '选择实况照片' }}
          </button>
          <span class="hint">支持荣耀、小米等机型的 Live Photo 文件</span>
          <p v-if="error" class="err">{{ error }}</p>
        </div>

        <div v-if="result" class="result">
          <div class="preview" ref="previewRef"></div>
          <div class="dl-row">
            <button class="btn btn-ghost" @click="dl('photo')">下载图片</button>
            <button class="btn btn-ghost" @click="dl('video')">下载视频</button>
          </div>
        </div>

        <CodeBlock :code="code" style="margin-top: 16px;" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.sec { padding: 80px 0; }
.sec-title { font-size: 20px; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 28px; }

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
}

.pick { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.hint { font-size: 13px; color: var(--text-dim); }
.err { margin: 8px 0 0; font-size: 13px; color: #f87171; }

.result { margin-top: 16px; }
.preview {
  width: 100%;
  max-width: 300px;
  aspect-ratio: 4/5;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid var(--border);
}
.dl-row { display: flex; gap: 8px; margin-top: 12px; }

@media (max-width: 768px) {
  .sec { padding: 56px 0; }
}
</style>
