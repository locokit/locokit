import { TAILWIND_COLORS } from '@locokit/definitions'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/@locokit/vue-components/dist/**/*.js',
  ],
  theme: {
    extend: {
      colors: TAILWIND_COLORS,
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /bg-slate-(100|200|300|400|500|600|700|800|900)/,
    },
  ],
}
