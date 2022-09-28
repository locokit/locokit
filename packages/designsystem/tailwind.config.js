const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{vue,js,ts,jsx,tsx}'],
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
      },
    },
  },
  plugins: [],
}
