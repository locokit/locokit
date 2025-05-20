const LCK_SETTINGS = {
  // the URL of LocoKit API
  API_URL: import.meta.env.VITE_API_URL,

  // the auth token of the current logged user
  LOCALSTORAGE_KEY_AUTH_TOKEN: import.meta.env.VITE_LOCALSTORAGE_KEY_AUTH_TOKEN,
  // the auth user data
  LOCALSTORAGE_KEY_AUTH_USER: import.meta.env.VITE_LOCALSTORAGE_KEY_AUTH_USER,

  /**
   * Sentry configuration
   * https://docs.sentry.io/platforms/javascript/guides/vue/
   */
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  SENTRY_ENV: import.meta.env.VITE_SENTRY_ENV,

  /**
   * URL for attachments.
   * Generally a prefix like '/storage' or a full URL like 'https://locokit.io/storage'
   */
  STORAGE_URL: import.meta.env.VITE_STORAGE_URL,

  /**
   * Portal configuration
   */
  PORTAL_NAME: import.meta.env.VITE_PORTAL_NAME,
  PORTAL_TITLE: import.meta.env.VITE_PORTAL_TITLE,
  PORTAL_FAVICON_SVG: import.meta.env.VITE_PORTAL_FAVICON_SVG,
  PORTAL_FAVICON_ICO: import.meta.env.VITE_PORTAL_FAVICON_ICO,

  /**
   * Images configuration
   */
  IMAGE_BG_HOME_URL: import.meta.env.VITE_IMAGE_BG_HOME_URL,
  IMAGE_BG_LOGO_URL: import.meta.env.VITE_IMAGE_BG_LOGO_URL,
  IMAGE_BG_ERROR_URL: import.meta.env.VITE_IMAGE_BG_ERROR_URL,
  IMAGE_LOGO_URL: import.meta.env.VITE_IMAGE_LOGO_URL,
  IMAGE_LOGO_MOBILE_URL: import.meta.env.VITE_IMAGE_LOGO_MOBILE_URL,
}
export default LCK_SETTINGS
