// vite.config.js
import vue from '@vitejs/plugin-vue'
// import './src/index.css'

export default {
  build: {
    lib: {
      name: '@locokit/designsystem',
    },
  },
  plugins: [vue()],
}
