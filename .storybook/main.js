const path = require('path')

module.exports = {
  stories: ['../src/**/*.stories.@(js|ts|mdx)'],
  // stories: [
    // '../src/components/store/DataTable/DataTable.stories.@(js|ts|mdx)',
  //   '../src/components/store/ViewColumnButton/ViewColumnButton.stories.@(js|ts|mdx)',
    // '../src/components/store/ViewButton/ViewButton.stories.@(js|ts|mdx)',
    // '../src/components/store/FilterButton/FilterButton.stories.@(js|ts|mdx)',
  //   '../src/components/ui/AutoComplete/AutoComplete.stories.@(js|ts|mdx)',
  //   '../src/components/ui/OverlayPanel/OverlayPanel.stories.@(js|ts|mdx)',
  //   '../src/components/ui/MultiSelect/MultiSelect.stories.@(js|ts|mdx)',
  //   '../src/components/ui/DropdownButton/DropdownButton.stories.@(js|ts|mdx)',
  //   '../src/components/ui/OverlayPanel/OverlayPanel.stories.@(js|ts|mdx)',
  //   '../src/views/routes/workspace/admin/process/ProcessListing.stories.@(js|ts|mdx)',
  // ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    // Make whatever fine-grained changes you need

    /**
     * first remove the png rule
     */
    config.module.rules = config.module.rules.map(rule => {
      if (rule.test.toString().includes('png')) {
        const test = rule.test.toString().replace('png|', '').replace(/\//g, '')
        return { ...rule, test: new RegExp(test) }
      } else {
        return rule
      }
    })

    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    /**
     * load png files directly for AsyncImage story
     */
    config.module.rules.push({
      test: /\.(png)(\?.*)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 100000,
        },
      }],
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
