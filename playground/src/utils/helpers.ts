/**
 * 清理 URL 资源
 */
export function revokeUrls(...urls: string[]) {
  urls.forEach(url => url && URL.revokeObjectURL(url))
}

/**
 * 下载 Blob 文件
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
