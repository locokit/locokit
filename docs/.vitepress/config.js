module.exports = {
  title: 'LocoKit documentation',
  description: 'Documentation of the Low-Code Kit platform, store, share, visualize your data',
  base: process.env.BASE_URL ? process.env.BASE_URL : '',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'LocoKit platform',
      description: 'open source platform with Database Management as a Spreadsheet and an App Builder'
    }
  },
  themeConfig: {
    author: 'Mathieu DARTIGUES',

    algolia: {
      apiKey: '3105e30092957574fc3729f68ef8dbc5',
      indexName: 'locokit'
    },

    locales: {
      // English
      '/': {
        label: 'English',
        selectText: 'Languages',
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Storybook', link: 'http://lck-storybook.surge.sh' },
          { text: 'GitHub', link: 'https://github.com/locokit/locokit' },
          { text: 'Docker', link: 'https://hub.docker.com/r/locokit/locokit/tags' },
        ],
        sidebar: [{
          text: 'Introduction',
          link: 'introduction.html'
        }, {
          text: 'Getting started',
          link: 'getting-started.html'
        }, {
          text: 'Concepts',
          children: [{
            text: 'Key features',
            link: 'concepts/key-features.html'
          }, {
            text: 'Column types',
            link: 'concepts/column-types.html'
          }, {
            text: 'Block types',
            link: 'concepts/block-types.html'
          }, {
            text: 'Permissions',
            link: 'concepts/permissions.html'
          }]
        }, {
          text: 'Advanced',
          children: [{
            text: 'User / group management',
            link: 'advanced/user-group-management.html'
          }, {
            text: 'Docker environment variables',
            link: 'advanced/docker-env.html'
          }, {
            text: 'Theme',
            link: 'advanced/theme.html'
          }, {
            text: 'Deployment in production',
            link: 'advanced/deployment.html'
          }]
        // }, {
        //   text: 'Use cases',
        //   children: [{
        //     text: 'Event management',
        //     link: 'usecases/event-management.html'
        //   }, {
        //     text: 'Logistic',
        //     link: 'usecases/logistic.html'
        //   }]
        }]
      }
    }
  },
}

