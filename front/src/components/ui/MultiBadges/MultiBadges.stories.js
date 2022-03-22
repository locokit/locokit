import MultiBadges from './MultiBadges'

export default {
  title: 'components/ui/MultiBadges',
  component: MultiBadges,
  decorators: [() => ({ template: '<div style="margin: 1em;"><story /></div>' })],
}

const options = [
  {
    label: 'First badge',
    color: '#484848',
    backgroundColor: '#fffbc2',
  },
  {
    label: 'Second badge',
    color: '#484848',
    backgroundColor: '#ffedc3',
  },
  {
    label: 'Third badge',
    color: '#484848',
    backgroundColor: '#ffe1d2',
  },
]

export const defaultStory = () => ({
  components: {
    MultiBadges,
  },
  data () {
    return {
      options,
    }
  },
  template: '<MultiBadges :options=options />',
  methods: { },
})
defaultStory.storyName = 'with three badges'
