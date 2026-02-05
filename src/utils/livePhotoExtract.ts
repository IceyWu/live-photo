/**
 * 实况照片提取 - 平衡版本（性能与可靠性）
 */

export interface ExtractResult {
  photoBlob: Blob
  photoUrl: string
  videoBlob: Blob
  videoUrl: string
}

/**
 * 快速字节查找（从后往前，针对实况照片优化）
 */
function findBytesFromEnd(arr: Uint8Array, b0: number, b1: number, b2: number, b3: number): number {
  // 从后往前搜索，实况照片的视频通常在后半部分
  for (let i = arr.length - 4; i >= 0; i--) {
    if (arr[i] === b0 && arr[i + 1] === b1 && arr[i + 2] === b2 && arr[i + 3] === b3) {
      return i
    }
  }
  return -1
}

/**
 * 快速验证 MP4 结构（检查前 8KB）
 */
function hasValidMp4(arr: Uint8Array): boolean {
  const checkLen = Math.min(arr.length, 8192)
  
  // 查找 moov 或 mdat（0x6D6F6F76 或 0x6D646174）
  for (let i = 0; i < checkLen - 3; i++) {
    const byte = arr[i]
    if (byte === 0x6D) { // 'm'
      const next = arr[i + 1]
      if (next === 0x6F) { // 'o'
        if (arr[i + 2] === 0x6F && arr[i + 3] === 0x76) return true // 'moov'
      } else if (next === 0x64) { // 'd'
        if (arr[i + 2] === 0x61 && arr[i + 3] === 0x74) return true // 'mdat'
      }
    }
  }
  
  return false
}

/**
 * 从实况照片文件中提取视频和图片
 */
export async function extractFromLivePhoto(file: File): Promise<ExtractResult | null> {
  try {
    const buffer = new Uint8Array(await file.arrayBuffer())
    
    // 查找 'ftyp' (0x66747970)
    const ftypPos = findBytesFromEnd(buffer, 0x66, 0x74, 0x79, 0x70)
    if (ftypPos === -1) return null
    
    // MP4 box 前 4 字节是 size，所以实际起始位置是 ftypPos - 4
    const mp4Start = Math.max(0, ftypPos - 4)
    
    // 验证 MP4 结构
    if (!hasValidMp4(buffer.subarray(mp4Start))) {
      return null
    }
    
    // 创建 Blob 和 URL
    const photoBlob = new Blob([buffer.subarray(0, mp4Start)], { type: 'image/jpeg' })
    const videoBlob = new Blob([buffer.subarray(mp4Start)], { type: 'video/mp4' })
    
    return {
      photoBlob,
      photoUrl: URL.createObjectURL(photoBlob),
      videoBlob,
      videoUrl: URL.createObjectURL(videoBlob)
    }
  } catch {
    return null
  }
}
