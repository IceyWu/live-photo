# 实况照片提取

`extractFromLivePhoto` 从 iOS 实况照片文件（HEIC/MOV 合并格式）中提取独立的图片和视频。

## 基础用法

```js
import { extractFromLivePhoto } from 'live-photo';

const input = document.querySelector('input[type="file"]');

input.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const result = await extractFromLivePhoto(file);

  if (!result) {
    console.error('不是有效的实况照片文件');
    return;
  }

  const { photoUrl, videoUrl, revoke } = result;

  // 直接用于 LivePhotoViewer
  const viewer = new LivePhotoViewer({
    photoSrc: photoUrl,
    videoSrc: videoUrl,
    container: document.getElementById('container'),
  });

  // 不再使用时释放内存
  // revoke();
});
```

## 返回值

```ts
interface ExtractResult {
  photoBlob: Blob;    // JPEG 图片 Blob
  photoUrl: string;   // 图片的 Object URL
  videoBlob: Blob;    // MP4 视频 Blob
  videoUrl: string;   // 视频的 Object URL
  revoke(): void;     // 释放两个 Object URL（幂等）
}
```

## 下载提取的文件

```js
const result = await extractFromLivePhoto(file);
if (!result) return;

const { photoBlob, videoBlob, revoke } = result;

// 下载图片
const photoLink = document.createElement('a');
photoLink.href = URL.createObjectURL(photoBlob);
photoLink.download = 'photo.jpg';
photoLink.click();

// 下载视频
const videoLink = document.createElement('a');
videoLink.href = URL.createObjectURL(videoBlob);
videoLink.download = 'video.mp4';
videoLink.click();

revoke();
```

## Vue 3 示例

```vue
<template>
  <input type="file" accept=".heic,.heif,.jpg,.jpeg" @change="onFile" />
  <div v-if="urls" ref="el" style="width: 400px; height: 400px;" />
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { extractFromLivePhoto, LivePhotoViewer } from 'live-photo';

const el = ref<HTMLElement | null>(null);
const urls = ref<{ photo: string; video: string } | null>(null);
let viewer: LivePhotoViewer | null = null;
let revokeUrls: (() => void) | null = null;

async function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const result = await extractFromLivePhoto(file);
  if (!result) return;

  revokeUrls?.();
  revokeUrls = result.revoke;
  urls.value = { photo: result.photoUrl, video: result.videoUrl };
}

watch([el, urls], ([container, src]) => {
  if (!container || !src) return;
  viewer?.destroy();
  viewer = new LivePhotoViewer({
    photoSrc: src.photo,
    videoSrc: src.video,
    container,
    autoplay: true,
  });
});

onUnmounted(() => {
  viewer?.destroy();
  revokeUrls?.();
});
</script>
```

## 注意事项

- 传入的 `file` 必须是 iOS 实况照片（HEIC/MOV 合并格式），普通 JPEG / MP4 会返回 `null`
- Object URL 不使用后应调用 `revoke()` 释放，否则会造成内存泄漏
- `revoke()` 可以安全地多次调用（幂等）
