declare const LCK_SETTINGS: {
  API_URL: string;
  LOCALSTORAGE_KEY: string;
  SENTRY_DSN: string;
  SENTRY_ENV: string;
  /**
   * URL for attachments.
   * Generally a prefix like '/storage' or a full URL like 'https://locokit.io/storage'
   */
  STORAGE_URL: string;
}

declare const LCK_THEME: {
  HOME_BACKGROUND_IMAGE_URL: string;
  PAGE_DATABASE_BACKGROUND_IMAGE_URL: string;
  PAGE_404_BACKGROUND_IMAGE_URL: string;
  LOGO_BG_WHITE_URL: string;
  LOGO_BG_PRIMARY_URL: string;
  LOGO_MOBILE_URL: string;
}

declare const LCK_VERSION: string
