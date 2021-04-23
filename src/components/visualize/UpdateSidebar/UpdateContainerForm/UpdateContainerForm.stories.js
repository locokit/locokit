import UpdateContainerForm from './UpdateContainerForm.vue'

export default {
  title: 'components/visualize/UpdateContainerForm',
  component: UpdateContainerForm
}

const emptyContainer = {
  id: 'containerID',
  text: 'my container',
  blocks: []
}

const notEmptyContainer = {
  ...emptyContainer,
  blocks: [
    { id: '1', title: 'my first block', type: 'Paragraph' },
    { id: '2', title: 'my second block', type: 'Media' },
    { id: '3', title: 'my third block', type: 'Unknown' }
  ]
}

export const creatingContainerStory = () => ({
  components: { UpdateContainerForm },
  template: '<UpdateContainerForm :showSidebar="true" />'
})

creatingContainerStory.storyName = 'when creating a container'
creatingContainerStory.args = {
  waitForSelector: '.p-sidebar'
}

export const updatingAnEmptyContainerStory = () => ({
  components: { UpdateContainerForm },
  data () {
    return {
      container: emptyContainer
    }
  },
  template: '<UpdateContainerForm :container="container" :showSidebar="true" />'
})

updatingAnEmptyContainerStory.storyName = 'when updating an empty container'
updatingAnEmptyContainerStory.args = {
  waitForSelector: '.p-sidebar'
}

export const submittingAnEmptyContainerStory = () => ({
  components: { UpdateContainerForm },
  data () {
    return {
      container: emptyContainer
    }
  },
  template: '<UpdateContainerForm :container="container" :submitting="true" :showSidebar="true" />'
})

submittingAnEmptyContainerStory.storyName = 'when submitting an empty container'
submittingAnEmptyContainerStory.args = {
  waitForSelector: '.p-sidebar'
}

export const updatingNotEmptyContainerStory = () => ({
  components: { UpdateContainerForm },
  data () {
    return {
      container: notEmptyContainer
    }
  },
  template: '<UpdateContainerForm :container="container" :showSidebar="true" />'
})

updatingNotEmptyContainerStory.storyName = 'when updating a not empty container'
updatingNotEmptyContainerStory.args = {
  waitForSelector: '.p-sidebar'
}

export const creatingBlockStory = () => ({
  components: { UpdateContainerForm },
  data () {
    return {
      container: notEmptyContainer,
      block: { id: '' }
    }
  },
  template: '<UpdateContainerForm :container="container" :showSidebar="true" :block="block" />'
})

creatingBlockStory.storyName = 'when creating a new block'
creatingBlockStory.args = {
  waitForSelector: '.p-sidebar'
}

export const updatingBlockStory = () => ({
  components: { UpdateContainerForm },
  data () {
    return {
      container: notEmptyContainer,
      block: notEmptyContainer.blocks[2]
    }
  },
  template: '<UpdateContainerForm :container="container" :showSidebar="true" :block="block" />'
})

updatingBlockStory.storyName = 'when updating a block'
updatingBlockStory.args = {
  waitForSelector: '.p-sidebar'
}
