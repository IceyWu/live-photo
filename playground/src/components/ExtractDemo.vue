<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { extractFromLivePhoto, LivePhotoViewer } from '../../../src/index'
import type { ExtractResult } from '../../../src/index'
import { revokeUrls, downloadBlob } from '../utils/helpers'

const fileInput = ref<HTMLInputElement | null>(null)
const extractResult = ref<ExtractResult | null>(null)
const isProcessing = ref(false)
const error = ref<string>('')
const containerRef = ref<HTMLElement | null>(null)
let viewer: LivePhotoViewer | null = null

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // 清理之前的资源
  if (extractResult.value) {
    revokeUrls(extractResult.value.photoUrl, extractResult.value.videoUrl)
  }
  if (viewer) {
    viewer.destroy()
    viewer = null
  }
  
  extractResult.value = null
  error.value = ''
  isProcessing.value = true
  
  try {
    const result = await extractFromLivePhoto(file)
    
    if (!result) {
      error.value = '无法提取实况照片，请确保文件格式正确'
      return
    }
    
    extractResult.value = result
    
    // 等待 DOM 更新后再创建 LivePhotoViewer 实例
    await nextTick()
    
    if (containerRef.value) {
      viewer = new LivePhotoViewer({
        photoSrc: result.photoUrl,
        videoSrc: result.videoUrl,
        container: containerRef.value,
        height: '100%',
        onError: (err) => {
          console.error('播放错误:', err)
        }
      })
    }
  } catch (err) {
    error.value = '处理文件时出错'
    console.error(err)
  } finally {
    isProcessing.value = false
  }
}

const handleDownload = (type: 'photo' | 'video') => {
  if (!extractResult.value) return
  
  const blob = type === 'photo' ? extractResult.value.photoBlob : extractResult.value.videoBlob
  const ext = type === 'photo' ? 'jpg' : 'mp4'
  downloadBlob(blob, `livephoto-${type}.${ext}`)
}

const triggerFileInput = () => {
  fileInput.value?.click()
}
</script>

<template>
  <div class="extract-demo">
    <div class="upload-section">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        style="display: none"
      />
      
      <button @click="triggerFileInput" class="upload-btn" :disabled="isProcessing">
        {{ isProcessing ? '处理中...' : '选择实况照片' }}
      </button>
      
      <p class="hint">支持 iPhone 实况照片（Live Photo）</p>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="extractResult" class="result-section">
      <div class="preview-container" ref="containerRef"></div>
      
      <div class="actions">
        <button @click="handleDownload('photo')" class="action-btn">
          下载图片
        </button>
        <button @click="handleDownload('video')" class="action-btn">
          下载视频
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.extract-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.upload-section {
  text-align: center;
  padding: 40px 20px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  background: #fafafa;
}

.upload-btn {
  padding: 12px 32px;
  font-size: 16px;
  background: #646cff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.upload-btn:hover:not(:disabled) {
  background: #535bf2;
}

.upload-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.hint {
  margin-top: 12px;
  color: #666;
  font-size: 14px;
}

.error-message {
  margin-top: 20px;
  padding: 12px;
  background: #fee;
  color: #c33;
  border-radius: 6px;
  text-align: center;
}

.result-section {
  margin-top: 30px;
}

.preview-container {
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
}

.action-btn {
  padding: 10px 24px;
  font-size: 14px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.action-btn:hover {
  background: #33a06f;
}
</style>
