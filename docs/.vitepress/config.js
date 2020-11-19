module.exports = {
  title: 'LocoKit documentation',
  description: 'Documentation of the Low-Code Kit platform, store, share, visualize your data',
  base: process.env.BASE_URL ? process.env.BASE_URL : '',
  themeConfig: {
    author: 'Mathieu DARTIGUES',
    sidebar: [{
      link: '/',
      text: 'Home'
    }, {
      text: 'Admin manual',
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
      text: 'User manual',
      link: '/user-manual/',
      children: [{
        link: '/user-manual/admin/users',
        text: 'User management'
      }]
    }, {
      link: '/roadmap',
      text: 'Roadmap'
    }, {
      link: '/storybook',
      text: 'Storybook'
    }],
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Storybook Front', link: 'http://lck-storybook.surge.sh' },
      { text: 'Repo gitlab', link: 'https://gitlab.com/locokit/' },
    ],
  },
}

