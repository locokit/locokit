import { fileURLToPath } from 'node:url'
import colors from 'tailwindcss/colors'

const srcDir = fileURLToPath(new URL('../', import.meta.url))
const locokitDesignSystemDir = fileURLToPath(
  new URL('../../../designsystem/src/components', import.meta.url),
)

/** @type {import('tailwindcss').Config} */
export default {
  content: [srcDir + '/**/*.vue', locokitDesignSystemDir + '/**/*.vue'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-lighten': 'var(--color-primary-lighten)',
        'primary-light': 'var(--color-primary-light)',
        'primary-dark': 'var(--color-primary-dark)',
        secondary: 'var(--color-secondary)',
        'secondary-lighten': 'var(--color-secondary-lighten)',
        'secondary-light': 'var(--color-secondary-light)',
        'secondary-dark': 'var(--color-secondary-dark)',
        error: colors.red['500'],
        // 'oyster-bay': 'var(--color-oyster-bay)',
        theme: {
          DEFAULT: 'var(--theme-bg-color)',
          hover: 'var(--theme-bg-color-hover)',
          text: 'var(--theme-text-color)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
