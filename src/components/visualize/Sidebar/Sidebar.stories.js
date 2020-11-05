import Sidebar from './Sidebar'
import StoryRouter from 'storybook-vue-router'

export default {
  title: 'components/visualize/Sidebar',
  component: Sidebar,
  decorators: [
    StoryRouter()
  ]
}

const items = [{
  id: 1,
  label: 'First item',
  subitems: [{
    id: 1,
    label: 'First subitem',
    to: '/first-link'
  }, {
    id: 2,
    label: 'Second subitem',
    to: '/second-link'
  }]
}, {
  id: 2,
  label: 'Second item',
  subitems: [{
    id: 3,
    label: 'Third subitem',
    to: '/third-link'
  }, {
    id: 4,
    label: 'Fourth subitem',
    to: '/fourth-link'
  }]
}]

const items1 = [{
  id: 1,
  label: 'First item',
  subitems: [{
    id: 1,
    label: 'First subitem',
    to: '/first-link'
  }, {
    id: 2,
    label: 'Second subitem',
    to: '/second-link'
  }]
}, {
  id: 2,
  label: 'Second item',
  active: true,
  subitems: [{
    id: 3,
    label: 'Third subitem',
    to: '/third-link'
  }, {
    id: 4,
    label: 'Fourth subitem',
    to: '/fourth-link',
    active: true
  }]
}]

export const defaultStory = () => ({
  components: { Sidebar },
  template: '<Sidebar />'
})

defaultStory.storyName = 'default'

export const withPropsStory = () => ({
  components: { Sidebar },
  data () {
    return {
      items
    }
  },
  template: '<Sidebar :items="items" />'
})

withPropsStory.storyName = 'with props items'

export const withPropsAndSubItemActiveStory = () => ({
  components: { Sidebar },
  data () {
    return {
      items: items1
    }
  },
  template: '<Sidebar :items="items" />'
})

withPropsAndSubItemActiveStory.storyName = 'with props items and active'
