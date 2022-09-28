export default {
  title: 'LocoKit',
  description:
    'Documentation of the Low-Code Kit platform, store, share, visualize your data',
  base: process.env.BASE_URL ? process.env.BASE_URL : '',
  themeConfig: {
    logo: '/logo.png',
    siteTitle: false,
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      {
        text: 'Notebook',
        items: [
          {
            text: 'Design',
            link: '/notebook/design/',
          },
          {
            text: 'Developer',
            link: '/notebook/developer/',
          },
        ],
      },
      { text: 'GitHub', link: 'https://github.com/locokit/locokit' },
      { text: 'Docker', link: 'https://hub.docker.com/r/locokit/locokit/tags' },
      { text: 'About us', link: 'about-us.html' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [{ text: 'Getting started', link: '/guide/getting-started' }],
        },
      ],
      '/notebook/': [
        {
          text: 'Notebook',
          items: [
            { text: 'Designer', link: '/notebook/design/' },
            {
              text: 'Developer',
              link: '/notebook/developer/',
              items: [
                {
                  text: 'Architecture',
                  link: '/notebook/developer/architecture',
                },
                { text: 'Engine', link: '/notebook/developer/engine' },
              ],
            },
          ],
        },
      ],
    },
  },
}
