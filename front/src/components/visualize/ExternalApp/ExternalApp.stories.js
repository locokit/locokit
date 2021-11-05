import ExternalApp from './ExternalApp'

export default {
  title: 'components/visualize/ExternalApp',
  component: ExternalApp,
}
export const defaultStory = () => (
  {
    components: { ExternalApp },
    template: '<ExternalApp />',
  }
)

defaultStory.storyName = 'default'

const blockExternalApp = {
  id: 1,
  title: 'My ExternalApp\'s block',
  type: 'ExternalApp',
  settings: {
    parts: [{
      type: 'String',
      string: 'https://',
    }, {
      type: 'Source',
      id: 'first-source',
      fieldId: 'id',
    }, {
      type: 'Source',
      id: 'second-source',
      fieldId: '72205f2e-a9cc-4e30-82ba-6f1f6e357e0c',
    }, {
      type: 'String',
      string: '.io',
    }],
  },
  content: {
    'first-source': {
      id: 'demo.',
    },
    'second-source': {
      data: {
        '72205f2e-a9cc-4e30-82ba-6f1f6e357e0c': 'locokit',
      },
    },
  },
}

export const withParts = (args, { argTypes }) => (
  {
    components: { ExternalApp },
    props: Object.keys(argTypes),
    template: '<ExternalApp v-bind="block" />',
  }
)

withParts.storyName = 'with parts in settings'
withParts.args = {
  block: blockExternalApp,
}
