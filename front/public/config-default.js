/**
 * These vars are available in the index.html, globally
 * You could write a config.js defining these vars for your infra.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LCK_SETTINGS = {
  API_URL: document.location.href.replace(/\/$/, ''),
  LOCALSTORAGE_KEY: 'lck-auth',
  SENTRY_DSN: '',
  SENTRY_ENV: '',
  STORAGE_PATH: document.location.href + '/storage',
}
