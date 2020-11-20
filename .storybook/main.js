const path = require('path')

module.exports = {
  stories: ['../src/**/*.stories.@(js|ts|mdx)'],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    config.resolve.alias = {
      'vue$': 'vue/dist/vue.esm.js',
      '@/services/lck-api/definitions': path.resolve(__dirname, "../src/services/lck-api/definitions"),
      '@/services/lck-api': path.resolve(__dirname, "../src/services/lck-api/__mocks__"),
      '@': path.resolve(__dirname, "../src/")
    }
    // Return the altered config
    return config;
  },
  addons: [
    '@storybook/addon-essentials',
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
