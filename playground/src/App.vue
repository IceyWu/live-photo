<script setup lang="ts">
import { LivePhotoViewer } from "../../src/index";
import { ref, onMounted } from "vue";
const demoSource = {
  photoSrc:
    "https://nest-js.oss-accelerate.aliyuncs.com/nestTest/1/1735895958950.jpg",
  videoSrc:
    "https://nest-js.oss-accelerate.aliyuncs.com/nestTest/1/1735895959622.mp4",
};
const containerRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (containerRef.value) {
    const palyer = new LivePhotoViewer({
      photoSrc: demoSource.photoSrc,
      videoSrc: demoSource.videoSrc,
      container: containerRef.value,
      // width: "100%",
      height: "100%",
      // width: "30vw",
      // height: "30vw",
      // autoplay: false,
      // lazyLoadVideo: true, // 启用延迟加载
      // imageCustomization: {
      //   styles: {
      //     objectFit: "cover",
      //     borderRadius: "8px",
      //     filter: "brightness(1.1)",
      //   },
      //   attributes: {
      //     alt: "Live Photo",
      //     loading: "lazy",
      //   },
      // },
      // videoCustomization: {
      //   styles: {
      //     objectFit: "contain",
      //     borderRadius: "8px",
      //   },
      //   attributes: {
      //     preload: "metadata",
      //     controlsList: "nodownload",
      //   },
      // },
      onProgress: (progress) => {
        console.log(`视频加载进度: ${progress}%`);
      },
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
  <div>
    <div style="height: 40vh" ref="containerRef"></div>
  </div>
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
