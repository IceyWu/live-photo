<script setup lang="ts">
import { LivePhotoViewer } from "../../src/index";
import { ref, onMounted } from "vue";
const demoSource = {
  photoSrc:
    "https://nest-js.oss-accelerate.aliyuncs.com/nestTest/1/1733058160256.JPEG",
  videoSrc:
    "https://nest-js.oss-accelerate.aliyuncs.com/nestTest/1/1733058160657.MOV",
};
const containerRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (containerRef.value) {
    const palyer = new LivePhotoViewer({
      photoSrc: demoSource.photoSrc,
      videoSrc: demoSource.videoSrc,
      container: containerRef.value,
      width: 300,
      height: 300,
      autoplay: false,
      onCanPlay: () => {
        console.log("onCanPlay");
      },
      onEnded: () => {
        console.log("onEnded");
      },

      onPhotoLoad: () => {
        console.log("onPhotoLoad");
      },
      onVideoLoad: () => {
        console.log("onVideoLoad");
      },
      onError: (e) => {
        console.log("onError", e);
      },
    });
    console.log("🎉-----palyer-----", palyer);
    // palyer.play();
  }
});
</script>

<template>
  <div ref="containerRef"></div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
