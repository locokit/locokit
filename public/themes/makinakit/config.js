/**
 * These vars are available in the index.html, globally
 * You could write a config.js defining these vars for your infra.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LCK_SETTINGS = {
  // API_URL: 'http://localhost:8000/api',
  // API_URL: 'http://localhost:3030',
  API_URL: 'https://staging-v-logistique-lck.makina-corpus.net/api',
  HOME_BACKGROUND_IMAGE_URL: '',
  PAGE_DATABASE_BACKGROUND_IMAGE_URL: '/themes/makinakit/img/MC_grayscale.png',
  PAGE_404_BACKGROUND_IMAGE_URL: '/themes/makinakit/img/MC_grayscale.png',
  LOGO_BG_WHITE_URL: '/themes/makinakit/img/MC_Logo_Horizontal_Quadri.svg',
  LOGO_BG_PRIMARY_URL: '/themes/makinakit/img/MC_Logo_Horizontal_Blanc.svg',
  LOGO_MOBILE_URL: '/themes/makinakit/img/MC_Logo_Vertical_Quadri.svg',
  STORAGE_KEY: 'lck-auth',
  SENTRY_DSN: 'https://b217f3673c9c417c82ada33ccf87a57e@sentry.makina-corpus.net/92',
  SENTRY_ENV: 'local'
}
