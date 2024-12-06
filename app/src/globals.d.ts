declare const LCK_SETTINGS: {
  // the URL of LocoKit API
  API_URL: string;
  // the auth token of the current logged user
  LOCALSTORAGE_KEY_AUTH_TOKEN: string;
  // the auth user data
  LOCALSTORAGE_KEY_AUTH_USER: string;

  SENTRY_DSN: string;
  SENTRY_ENV: string;
  /**
   * URL for attachments.
   * Generally a prefix like '/storage' or a full URL like 'https://locokit.io/storage'
   */
  STORAGE_URL: string;
}
