module.exports = {
  title: 'LocoKit documentation',
  description: 'Documentation of the Low-Code Kit platform, store, share, visualize your data',
  base: process.env.BASE_URL ? process.env.BASE_URL : '',
  themeConfig: {
    author: 'Mathieu DARTIGUES',

    algolia: {
      apiKey: '3105e30092957574fc3729f68ef8dbc5',
      indexName: 'locokit'
    },
    // sidebar: {
    //   '/admin-manual/': [{
    //     text: 'Admin manual',
    //     children: [{
    //       link: '/admin-manual/auth',
    //       text: 'Authentication'
    //     }, {
    //       link: '/admin-manual/permissions',
    //       text: 'Permissions'
    //     }, {
    //       link: '/admin-manual/database',
    //       text: 'Database'
    //     }, {
    //       link: '/admin-manual/cicd',
    //       text: 'CI / CD'
    //     }, {
    //       link: '/admin-manual/configure',
    //       text: 'Configuration'
    //     }, {
    //       link: '/admin-manual/visualization',
    //       text: 'Visualization'
    //     }, {
    //       link: '/admin-manual/webhooks',
    //       text: 'Web hooks'
    //     }]
    //   }],
    //   '/developer-manual/': [{
    //     text: 'Developer manual',
    //     children: [{
    //       text: 'Front end',
    //       link: '/developer-manual/frontend'
    //     }, {
    //       text: 'Storybook',
    //       link: '/developer-manual/storybook'
    //     }, {
    //       text: 'Back end',
    //       link: '/developer-manual/backend'
    //     }]
    //   }]
    // },
    nav: [
      { text: 'Home', link: '/' },
      // { text: 'Manuals', items: [
      //   {
      //     text: 'Administrator',
      //     link: '/admin-manual/'
      //   },
      //   {
      //     text: 'Developer',
      //     link: '/developer-manual/'
      //   },
      //   {
      //     text: 'User',
      //     link: '/user-manual/'
      //   }
      // ]},
      { text: 'Storybook Front', link: 'http://lck-storybook.surge.sh' },
      { text: 'GitHub', link: 'https://github.com/locokit/locokit' },
      { text: 'Docker', link: 'https://hub.docker.com/r/locokit/locokit/tags' },
    ],
  },
}

