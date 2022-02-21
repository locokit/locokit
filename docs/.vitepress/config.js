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

  markdown: {
    toc: { includeLevel: [1, 2] },
  },
  themeConfig: {
    author: 'Mathieu DARTIGUES',

    editLinks: true,

    algolia: {
      apiKey: '3105e30092957574fc3729f68ef8dbc5',
      indexName: 'locokit'
    },

    nav: [
      { text: 'Guide', link: '/what-is-locokit' },
      { text: 'GitHub', link: 'https://github.com/locokit/locokit' },
      { text: 'Docker', link: 'https://hub.docker.com/r/locokit/locokit/tags' },
      { text: 'About us', link: 'about-us.html' },
    ],

    sidebar: [{
      text: 'Introduction',
      children: [{
        text: 'What is LocoKit ?',
        link: 'what-is-locokit.html'
      }, {
        text: 'Getting started',
        link: 'getting-started.html'
      }]
    }, {
      text: 'Concepts',
      children: [{
        text: 'Key features',
        link: 'concepts/key-features.html'
      }, {
        text: 'Field types',
        link: 'concepts/field-types.html'
      }, {
        text: 'Block types',
        link: 'concepts/block-types.html'
      }]
    }, {
      text: 'Advanced',
      children: [{
        text: 'User / group management',
        link: 'advanced/user-group-management.html'
      }, {
        text: 'Environment variables',
        link: 'advanced/env-vars.html'
      }, {
        text: 'Theme',
        link: 'advanced/theme.html'
      }, {
        text: 'Formula',
        link: 'advanced/formula.html'
      }]
    }]
  },
}

