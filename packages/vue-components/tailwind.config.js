import { TAILWIND_COLORS } from '@locokit/definitions'
import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./{components,layouts,stories}/**/*.{ts,vue,mdx}'],
  theme: {
    extend: {
      colors: {
        ...TAILWIND_COLORS,
        error: colors.red,
        success: colors.emerald,
        warning: colors.amber,
      },
    },
  },
  plugins: [require('tailwindcss-primeui')],
  safelist: [
    {
      pattern: /slate-(100|200|300|400|500|600|700|800|900)/,
    },
  ],
}
