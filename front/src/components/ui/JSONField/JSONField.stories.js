/* eslint-disable @typescript-eslint/camelcase */
import JSONField from './JSONField.vue'

export default {
  title: 'components/ui/JSONField',
  component: JSONField,
}

export const defaultStory = () => {
  return {
    components: { JSONField },
    template: '<JSONField :value="{ \'a\': 1, \'b\': 2 }" />',
  }
}

defaultStory.storyName = 'default story'
