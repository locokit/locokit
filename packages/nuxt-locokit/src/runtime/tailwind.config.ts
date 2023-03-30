import { fileURLToPath } from 'node:url'

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
        primary: 'var(--primary-color)',
        'primary-lighten': 'var(--primary-color-lighten)',
        'primary-light': 'var(--primary-color-light)',
        'primary-dark': 'var(--primary-color-dark)',
        secondary: 'var(--secondary-color)',
        'secondary-lighten': 'var(--secondary-color-lighten)',
        'secondary-light': 'var(--secondary-color-light)',
        'secondary-dark': 'var(--secondary-color-dark)',
        error: 'var(--color-error)',
        'error-lighten': 'var(--color-error-lighten)',
        'error-light': 'var(--color-error-light)',
        'error-dark': 'var(--color-error-dark)',
        success: 'var(--color-success)',
        'success-lighten': 'var(--color-success-lighten)',
        'success-light': 'var(--color-success-light)',
        'success-dark': 'var(--color-success-dark)',
        warning: 'var(--color-warning)',
        'warning-lighten': 'var(--color-warning-lighten)',
        'warning-light': 'var(--color-warning-light)',
        'warning-dark': 'var(--color-warning-dark)',
        lck: 'var(--text-color)',
      },
      borderRadius: {
        lck: 'var(--border-radius)',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
