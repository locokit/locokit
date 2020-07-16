const path = require('path')

module.exports = {
  stories: ['../src/**/*.stories.@(js|mdx)'],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    config.resolve.alias = {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, "../src/")
    }
    // Return the altered config
    return config;
  },
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    {
      name: '@storybook/addon-docs',
      options: {
        vueDocgenOptions: {
          alias: {
            '@': path.resolve(__dirname, '../src/'),
          },
        },
      },
    }
  ]
};
