import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
      // 端口号
      port: 3366,
      host: "0.0.0.0",
    },
})
