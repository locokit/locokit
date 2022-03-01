// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
// process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  publicPath: '/',
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
  pwa: {
    workboxOptions: {
      importWorkboxFrom: 'local',
      skipWaiting: true,
      exclude: [
        /index\.html$/,
        /config\.js$/,
        /.*\.map$/,
      ],
    },
  },
  configureWebpack: {
    devtool: 'source-map',
    entry: {
      // Package each language's worker and give these filenames in `getWorkerUrl`
      'editor.worker': 'monaco-editor-core/esm/vs/editor/editor.worker.js',
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  },
  chainWebpack: config => {
    /**
     * Remove minification of index.html file
     */
    config
      .plugin('html')
      .tap(args => {
        args[0].minify = false
        /* new args to pass to html-webpack-plugin's constructor */
        return args
      })
  },
}
