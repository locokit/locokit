process.env.VUE_APP_VERSION = require('./package.json').version

// eslint-disable-next-line @typescript-eslint/no-var-requires
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  publicPath: '',
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  pwa: {
    workboxOptions: {
      importWorkboxFrom: 'local',
      skipWaiting: true,
      exclude: [
        /index\.html$/,
        /config\.js$/,
        /.*\.map$/
      ]
    }
  },
  configureWebpack: {
    devtool: 'source-map',
    plugins: [
      new MonacoWebpackPlugin({
        languages: [],
        features: []
      })
    ]

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
  }
}
