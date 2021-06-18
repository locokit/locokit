import HighlightField from './HighlightField'

export default {
  title: 'components/visualize/HighlightField',
  component: HighlightField
}

export const withPropsStory = (args, { argTypes }) => {
  return {
    components: { HighlightField },
    props: Object.keys(argTypes),
    template: '<HighlightField :title="title" :result="result" :noResult="noResult" />'
  }
}

withPropsStory.storyName = 'with props story'
withPropsStory.args = {
  title: 'Use of bike',
  result: '1 CO2 / Week',
  noResult: 'No result'
}
withPropsStory.argTypes = {
  title: {
    control: {
      type: 'text'
    }
  },
  result: {
    control: {
      type: 'text'
    }
  },
  noResult: {
    control: {
      type: 'text'
    }
  }
}
