/**
 * These vars are available in the index.html, globally
 * You could write a config.js defining these vars for your infra.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
global.LCK_SETTINGS = {
  API_URL: null, // we don't have to fetch API data. By setting to null, we are sure there will be no mistake.
  HOME_BACKGROUND_IMAGE_URL: '',
  PAGE_DATABASE_BACKGROUND_IMAGE_URL: '/themes/locokit/img/logokit-grayscale.png',
  PAGE_404_BACKGROUND_IMAGE_URL: '/themes/locokit/img/logokit-grayscale.png',
  LOGO_BG_WHITE_URL: '/themes/locokit/img/logo.svg',
  LOGO_BG_PRIMARY_URL: '/themes/locokit/img/logo-white.svg',
  LOGO_MOBILE_URL: '/themes/locokit/img/logo-mobile.svg',
  STORAGE_KEY: 'lck-auth-storybook',
  SENTRY_DSN: null
}
global.LCK_VERSION = '0.0.4'
