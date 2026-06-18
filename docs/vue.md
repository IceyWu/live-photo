# Vue 3

## 基础用法（Composition API）

```vue
<template>
  <div ref="el" style="width: 400px; height: 400px;" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { LivePhotoViewer } from 'live-photo';

const el = ref<HTMLElement | null>(null);
let viewer: LivePhotoViewer | null = null;

onMounted(() => {
  viewer = new LivePhotoViewer({
    photoSrc: 'https://lpalette.oss-accelerate.aliyuncs.com/go_oss/prod/mkIo6X4FryYKOcUzuz4Kew/2026-06-15/3c14973c-bfbb-4d8b-9296-d3be902e3171.jpeg',
    videoSrc: 'https://lpalette.oss-accelerate.aliyuncs.com/go_oss/prod/mkIo6X4FryYKOcUzuz4Kew/videos/trans/979bc89e-16c1-4a3a-b8c4-daa4837d575c/720p.mp4',
    container: el.value!,
    autoplay: true,
    height: 320,
    borderRadius: 12,
    theme: 'auto',
    onEnded: (event, video) => console.log('播放结束'),
    onError: (error) => console.error(error.message),
  });
});

onUnmounted(() => viewer?.destroy());
</script>
```

## 封装为可复用组件

```vue
<!-- LivePhoto.vue -->
<template>
  <div ref="el" :style="{ width, height }" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { LivePhotoViewer } from 'live-photo';
import type { LivePhotoOptions } from 'live-photo';

type Props = Omit<LivePhotoOptions, 'container'> & {
  width?: string;
  height?: string;
};

const props = withDefaults(defineProps<Props>(), {
  width: '300px',
  height: '300px',
});

const el = ref<HTMLElement | null>(null);
let viewer: LivePhotoViewer | null = null;

onMounted(() => {
  viewer = new LivePhotoViewer({ ...props, container: el.value! });
});

onUnmounted(() => viewer?.destroy());

// 暴露实例方法
defineExpose({
  play: () => viewer?.play(),
  pause: () => viewer?.pause(),
  stop: () => viewer?.stop(),
  toggle: () => viewer?.toggle(),
  getState: () => viewer?.getState(),
});
</script>
```

```vue
<!-- 使用封装组件 -->
<template>
  <LivePhoto
    ref="livePhoto"
    photo-src="https://lpalette.oss-accelerate.aliyuncs.com/go_oss/prod/mkIo6X4FryYKOcUzuz4Kew/2026-06-15/3c14973c-bfbb-4d8b-9296-d3be902e3171.jpeg"
    video-src="https://lpalette.oss-accelerate.aliyuncs.com/go_oss/prod/mkIo6X4FryYKOcUzuz4Kew/videos/trans/979bc89e-16c1-4a3a-b8c4-daa4837d575c/720p.mp4"
    width="400px"
    height="400px"
    :autoplay="true"
    :border-radius="12"
    @ended="onEnded"
  />
  <button @click="livePhoto?.toggle()">切换播放</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LivePhoto from './LivePhoto.vue';

const livePhoto = ref<InstanceType<typeof LivePhoto> | null>(null);
const onEnded = () => console.log('播放结束');
</script>
```

## 动态切换媒体源

```vue
<template>
  <div ref="el" style="width: 400px; height: 400px;" />
  <button @click="next">下一张</button>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { LivePhotoViewer } from 'live-photo';

const sources = [
  { photoSrc: 'photo1.jpg', videoSrc: 'video1.mp4' },
  { photoSrc: 'photo2.jpg', videoSrc: 'video2.mp4' },
];
let index = 0;

const el = ref<HTMLElement | null>(null);
let viewer: LivePhotoViewer | null = null;

function init() {
  viewer?.destroy();
  viewer = new LivePhotoViewer({
    ...sources[index],
    container: el.value!,
    autoplay: true,
  });
}

function next() {
  index = (index + 1) % sources.length;
  init();
}

onUnmounted(() => viewer?.destroy());
</script>
```
