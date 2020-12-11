/**
 * These vars are available in the index.html, globally
 * You could write a config.js defining these vars for your infra.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
global.LCK_SETTINGS = {
  API_URL: null, // we don't have to fetch API data. By setting to null, we are sure there will be no mistake.
  HOME_BACKGROUND_IMAGE_URL: '/img/bg-intro.jpg',
  PAGE_404_BACKGROUND_IMAGE_URL: '/img/page-construction-vlogistique.png',
  LOGO_BG_WHITE_URL: '/img/logo-bg-white.png',
  LOGO_BG_PRIMARY_URL: '/img/logo-bg-primary.png',
  LOGO_MOBILE_URL: '/img/vlo-logo-mobile.png',
  STORAGE_KEY: 'lck-auth-storybook',
  SENTRY_DSN: null
}
global.LCK_VERSION = '0.0.4'
