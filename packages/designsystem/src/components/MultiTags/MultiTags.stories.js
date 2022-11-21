import MultiTags from './MultiTags'

export default {
  title: 'components/MultiTags/MultiTags',
  component: MultiTags,
  decorators: [
    () => ({ template: '<div style="margin: 1em;"><story /></div>' }),
  ],
}

const options = [
  {
    label: 'First tag',
    color: '#484848',
    backgroundColor: '#fffbc2',
  },
  {
    label: 'Second tag',
    color: '#484848',
    backgroundColor: '#ffedc3',
  },
  {
    label: 'Third tag',
    color: '#484848',
    backgroundColor: '#ffe1d2',
  },
]

export const defaultStory = () => ({
  components: {
    MultiTags,
  },
  data() {
    return {
      options,
    }
  },
  template: '<MultiTags :options=options />',
  methods: {},
})
defaultStory.storyName = 'with three tags'
