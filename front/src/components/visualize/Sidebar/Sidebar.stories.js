import Sidebar from './Sidebar'
import StoryRouter from '../../../../.storybook/storyRouterDecorator.js'

export default {
  title: 'components/visualize/Sidebar',
  component: Sidebar,
  decorators: [
    StoryRouter({ initialEntry: '/2-2' }),
  ],
}

const items = [{
  id: '1',
  label: 'First item',
  subitems: [{
    id: '1-1',
    label: 'First subitem',
    to: '/first-link',
  }, {
    id: '1-2',
    label: 'Second subitem',
    to: '/second-link',
  }],
}, {
  id: '2',
  label: 'Second item',
  subitems: [{
    id: '2-1',
    label: 'Third subitem',
    to: '/third-link',
  }, {
    id: '2-2',
    label: 'Fourth subitem',
    to: '/fourth-link',
  }],
}]

// Active item is supported by vue-router not sidebar
// Accordion opens according to the router's params: pageId if it exists else it is the first one

const Template = (args, { argTypes }) => ({
  components: { Sidebar },
  props: Object.keys(argTypes),
  template: '<Sidebar v-bind="$props" />',
})

export const DefaultStory = Template.bind({})
DefaultStory.storyName = 'default'

export const WithPropsStory = Template.bind({})
WithPropsStory.args = {
  items,
}
WithPropsStory.storyName = 'with props items'

export const WithEditionAndPropsStory = Template.bind({})
WithEditionAndPropsStory.args = {
  items: items,
  displayEditActions: true,
}
WithEditionAndPropsStory.storyName = 'with edition and props items'
