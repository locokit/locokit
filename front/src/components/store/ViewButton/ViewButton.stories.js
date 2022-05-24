import ViewButton from './ViewButton'

export default {
  title: 'components/store/View/ViewButton',
  component: ViewButton,
}

const createViews = (nbr) => {
  const data = []
  for (let i = 1; i <= nbr; i++) {
    data.push({
      id: i,
      text: `View ${i}`,
      locked: i === nbr,
    })
  }
  return data
}

const Template = (args, { argTypes }) => ({
  components: { ViewButton },
  props: Object.keys(argTypes),
  template: '<ViewButton v-bind="$props" />',
})

export const DefaultStory = Template.bind({})
DefaultStory.storyName = 'default'

const TemplateWithRef = (args, { argTypes }) => ({
  components: { ViewButton },
  props: Object.keys(argTypes),
  template: '<ViewButton ref="vb" v-bind="$props" />',
  mounted () {
    this.$refs.vb.$el.querySelector('button').click()
  },
})

export const OverlayOpenedStory = TemplateWithRef.bind({})
OverlayOpenedStory.storyName = 'overlay opened'
OverlayOpenedStory.args = {
  waitForSelector: '.p-overlaypanel',
}

export const OverlayOpenedStoryWithViews = TemplateWithRef.bind({})
OverlayOpenedStoryWithViews.storyName = 'overlay opened with views'
OverlayOpenedStoryWithViews.args = {
  waitForSelector: '.p-overlaypanel',
  views: createViews(3),
  value: '1',
}

export const OverlayOpenedStoryWithManyViews = TemplateWithRef.bind({})
OverlayOpenedStoryWithManyViews.storyName = 'overlay opened with many views'
OverlayOpenedStoryWithManyViews.args = {
  waitForSelector: '.p-overlaypanel',
  views: createViews(12),
  value: '1',
}
