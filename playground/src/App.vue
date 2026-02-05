<script setup lang="ts">
import { LivePhotoViewer } from "../../src/index";
import { ref, watch, nextTick, onUnmounted } from "vue";
import ExtractDemo from "./components/ExtractDemo.vue";

const demoSource = {
  photoSrc:
    "https://nest-js.oss-accelerate.aliyuncs.com/nestTest/1/1735895958950.jpg",
  videoSrc:
    "https://nest-js.oss-accelerate.aliyuncs.com/nestTest/1/1735895959622.mp4",
};
const containerRef = ref<HTMLElement | null>(null);
const activeTab = ref<'viewer' | 'extract'>('viewer');
let viewer: LivePhotoViewer | null = null;

const initViewer = async () => {
  await nextTick();
  if (containerRef.value) {
    // 如果已存在 viewer，先销毁
    if (viewer) {
      viewer.destroy();
      viewer = null;
    }
    
    viewer = new LivePhotoViewer({
      photoSrc: demoSource.photoSrc,
      videoSrc: demoSource.videoSrc,
      container: containerRef.value,
      height: "100%",
      onProgress: (progress, event, video) => {
        console.log(`视频加载进度: ${progress}%`, { event, video });
      },
      onCanPlay: (event, video) => {
        console.log("onCanPlay", { event, video });
      },
      onEnded: (event, video) => {
        console.log("onEnded", { event, video });
      },
      onPhotoLoad: (event, photo) => {
        console.log("onPhotoLoad", { event, photo });
      },
      onVideoLoad: (duration, event, video) => {
        console.log("onVideoLoad - 视频总时长:", duration, "秒", { event, video });
      },
      onError: (error, event) => {
        console.log("onError", { error, event });
      },
    });
  }
};

watch(activeTab, async (newTab) => {
  if (newTab === 'viewer') {
    await initViewer();
  } else {
    // 切换到其他标签页时销毁 viewer
    if (viewer) {
      viewer.destroy();
      viewer = null;
    }
  }
}, { immediate: true });

onUnmounted(() => {
  if (viewer) {
    viewer.destroy();
  }
});
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Live Photo Playground</h1>
      <nav class="tabs">
        <button 
          :class="['tab', { active: activeTab === 'viewer' }]"
          @click="activeTab = 'viewer'"
        >
          播放器演示
        </button>
        <button 
          :class="['tab', { active: activeTab === 'extract' }]"
          @click="activeTab = 'extract'"
        >
          实况提取
        </button>
      </nav>
    </header>

    <main class="content">
      <ExtractDemo v-if="activeTab === 'extract'" />
      <div v-if="activeTab === 'viewer'" class="viewer-demo">
        <div class="viewer-container" ref="containerRef"></div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
}

.header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.header h1 {
  margin: 0 0 20px 0;
  font-size: 28px;
  text-align: center;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.tab {
  padding: 8px 20px;
  font-size: 14px;
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.tab:hover {
  border-color: #646cff;
  color: #646cff;
}

.tab.active {
  background: #646cff;
  color: white;
  border-color: #646cff;
}

.content {
  padding: 20px;
}

.viewer-demo {
  max-width: 800px;
  margin: 0 auto;
}

.viewer-container {
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
}
</style>
