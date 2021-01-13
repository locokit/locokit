import UpdateContainerSidebar from './UpdateContainerSidebar.vue'

export default {
  title: 'components/visualize/UpdateContainerSidebar',
  component: UpdateContainerSidebar
}

const emptyContainer = {
  id: 'containerID',
  text: 'my container',
  blocks: []
}

const notEmptyContainer = {
  ...emptyContainer,
  blocks: [
    { title: 'my first block', type: 'Paragraph' },
    { title: 'my second block', type: 'Media' }
  ]
}

export const creatingContainerStory = () => ({
  components: { UpdateContainerSidebar },
  template: '<UpdateContainerSidebar :showSidebar="true" />'
})

creatingContainerStory.storyName = 'when creating a container'

export const updatingAnEmptyContainerStory = () => ({
  components: { UpdateContainerSidebar },
  data () {
    return {
      container: emptyContainer
    }
  },
  template: '<UpdateContainerSidebar :container="container" :showSidebar="true" />'
})

updatingAnEmptyContainerStory.storyName = 'when updating an empty container'

export const submittingAnEmptyContainerStory = () => ({
  components: { UpdateContainerSidebar },
  data () {
    return {
      container: emptyContainer
    }
  },
  template: '<UpdateContainerSidebar :container="container" :submitting="true" :showSidebar="true" />'
})

submittingAnEmptyContainerStory.storyName = 'when submitting an empty container'

export const updatingNotEmptyContainerStory = () => ({
  components: { UpdateContainerSidebar },
  data () {
    return {
      container: notEmptyContainer
    }
  },
  template: '<UpdateContainerSidebar :container="container" :showSidebar="true" />'
})

updatingNotEmptyContainerStory.storyName = 'when updating a not empty container'
