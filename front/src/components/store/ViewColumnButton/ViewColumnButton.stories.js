/* eslint-disable @typescript-eslint/camelcase */
import ViewColumnButton from './ViewColumnButton'

export default {
  title: 'components/store/View/ViewColumnButton',
  component: ViewColumnButton,
}

const Template = (args, { argTypes }) => ({
  components: { ViewColumnButton },
  props: Object.keys(argTypes),
  template: '<ViewColumnButton v-bind="$props" />',
})

export const DefaultStory = Template.bind({})
DefaultStory.storyName = 'default'

export const DisabledStory = Template.bind({})
DisabledStory.storyName = 'disabled'
DisabledStory.args = {
  disabled: true,
}

const createOptions = (nbr) => {
  const data = []
  for (let i = 1; i <= nbr; i++) {
    data.push({
      id: i.toString(),
      text: `Option ${i}`,
      postion: i,
    })
  }
  return data
}

const value = [
  '1',
  '2',
  '3',
  '4',
]

const TemplateWithRef = (args, { argTypes }) => ({
  components: { ViewColumnButton },
  props: Object.keys(argTypes),
  template: '<ViewColumnButton ref="vcb" v-bind="$props" />',
  async mounted () {
    await this.$refs.vcb.$el.querySelector('button').click()
  },
})

export const WithValueAndColumnsStory = TemplateWithRef.bind({})
WithValueAndColumnsStory.storyName = 'with value and columns'
WithValueAndColumnsStory.args = {
  waitForSelector: '.p-overlaypanel',
  value,
  columns: createOptions(5),
}

export const WithValueAndManyColumnsStory = TemplateWithRef.bind({})
WithValueAndManyColumnsStory.storyName = 'with value and columns'
WithValueAndManyColumnsStory.args = {
  waitForSelector: '.p-overlaypanel',
  value,
  columns: createOptions(12),
}
