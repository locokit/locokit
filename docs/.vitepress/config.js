module.exports = {
  title: 'LocoKit documentation',
  description: 'Documentation of the Low-Code Kit platform, store, share, visualize your data',
  themeConfig: {
    author: 'Mathieu DARTIGUES',
    search: true,
    sidebar: [{
      link: '/',
      text: 'Home'
    }, {
      text: 'Users and groups',
      link: '/admin-manual/',
      children: [{
        link: '/admin-manual/cicd',
        text: 'CI / CD'
      }, {
        link: '/admin-manual/configure',
        text: 'Configuration'
      }, {
        link: '/admin-manual/orchestration',
        text: 'Orchestration'
      }, {
        link: '/admin-manual/storage',
        text: 'Storage'
      }, {
        link: '/admin-manual/users-and-groups',
        text: 'Users and groups'
      }, {
        link: '/admin-manual/visualization',
        text: 'Visualization'
      }]
    }, {
      link: '/roadmap',
      text: 'Roadmap'
    }],
    nav: [
      { text: 'Home', link: '/' },
      { text: 'User manual', link: '/user-manual/' },
      { text: 'Admin manual', link: '/admin-manual/' },
      { text: 'Swagger API', link: '/swagger' },
      { text: 'Storybook Front', link: '/storybook' },
      { text: 'Repo gitlab', link: 'https://gitlab.com/locokit/' },
    ],
  },
}

