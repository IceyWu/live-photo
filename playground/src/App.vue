<script setup lang="ts">
import { LivePhotoViewer } from '../../src/index';
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { DEMO_SOURCE, REPO_URL } from './sources';
import PlayerSection from './components/PlayerSection.vue';
import SyncDemo from './components/SyncDemo.vue';
import ExtractDemo from './components/ExtractDemo.vue';

const openingRef = ref<HTMLElement | null>(null);
let openingViewer: LivePhotoViewer | null = null;

onMounted(async () => {
  await nextTick();
  if (!openingRef.value) return;
  openingViewer = new LivePhotoViewer({
    ...DEMO_SOURCE,
    container: openingRef.value,
    width: '100%',
    height: '100%',
    borderRadius: 0,
    autoplay: true,
  });
});

onUnmounted(() => openingViewer?.destroy());
</script>

<template>
  <nav class="nav">
    <div class="container nav-inner">
      <a class="brand" href="#">
        <img src="/logo.svg" alt="" class="brand-logo" />
        <span>live-photo</span>
      </a>
      <div class="nav-links">
        <a href="#player">体验</a>
        <a href="#sync">同步</a>
        <a href="#extract">提取</a>
        <a :href="REPO_URL" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </div>
  </nav>

  <!-- Opening: full-width Live Photo, no text overlay -->
  <section class="opening">
    <div class="opening-frame" ref="openingRef"></div>
  </section>

  <main>
    <PlayerSection />
    <SyncDemo />
    <ExtractDemo />
  </main>

  <footer class="ft">
    <div class="container ft-inner">
      <span>MIT © <a :href="REPO_URL" target="_blank">Icey Wu</a></span>
      <a :href="REPO_URL" target="_blank">GitHub</a>
    </div>
  </footer>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  height: 48px;
  background: var(--canvas);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
  color: var(--text);
}
.brand:hover { color: var(--text); }
.brand-logo { width: 20px; height: 20px; }
.nav-links { display: flex; gap: clamp(14px, 3vw, 24px); font-size: 14px; }

.opening {
  width: 100%;
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 32px clamp(16px, 4vw, 32px) 0;
}
.opening-frame {
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.ft { border-top: 1px solid var(--border); margin-top: 80px; }
.ft-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px clamp(16px, 4vw, 32px);
  font-size: 13px;
  color: var(--text-dim);
}

@media (max-width: 640px) {
  .nav-links a:not(:last-child) { display: none; }
  .opening-frame { aspect-ratio: 4 / 5; }
}
</style>
