import Synthesis from './Synthesis'

export default {
  title: 'components/visualize/Synthesis',
  component: Synthesis
}

export const withPropsStory = (args, { argTypes }) => {
  return {
    components: { Synthesis },
    props: Object.keys(argTypes),
    template: '<Synthesis :title="title" :result="result" :noResult="noResult" />'
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
