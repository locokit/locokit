/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

export default {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  plugins: [require('tailwindcss-primeui')],
  theme: {
    extend: {
      colors: {
        error: colors.red,
        success: colors.emerald,
        warning: colors.amber,
      }
    }
  }
}

// theme: {
//   extend: {
//     colors: {
//       primary: 'var(--primary-color)',
//       'primary-lighten': 'var(--primary-color-lighten)',
//       'primary-light': 'var(--primary-color-light)',
//       'primary-dark': 'var(--primary-color-dark)',
//       secondary: 'var(--secondary-color)',
//       'secondary-lighten': 'var(--secondary-color-lighten)',
//       'secondary-light': 'var(--secondary-color-light)',
//       'secondary-dark': 'var(--secondary-color-dark)',
//       lck: 'var(--text-color)',
//     },
//     borderRadius: {
//       lck: 'var(--border-radius)',
//     },
//   },
// },
