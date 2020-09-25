process.env.VUE_APP_VERSION = require('./package.json').version

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
  configureWebpack: {
    devtool: 'source-map'
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
