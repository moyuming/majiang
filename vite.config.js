import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

// https://vite.dev/config/
export default defineConfig({
  build: {
    // outDir: 'dist', // 默认值，可以省略
    // outDir: 'public', // 改为 public
    outDir: 'docs',   // 改为 docs（适合GitHub Pages）
    // outDir: 'output', // 改为 output
  },
  plugins: [vue()],
})
