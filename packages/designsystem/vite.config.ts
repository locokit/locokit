// vite.config.js
import vue from '@vitejs/plugin-vue'
// import './src/index.css'

export default {
  build: {
    lib: {
      entry: 'src/components/auth/lck-login.vue',
      name: '@locokit/designsystem',
    },
  },
  plugins: [vue()],
}
