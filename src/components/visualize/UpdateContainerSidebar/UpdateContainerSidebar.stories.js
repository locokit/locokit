import UpdateContainerSidebar from './UpdateContainerSidebar.vue'
import { crudModeWithTextarea } from '@/components/store/DataTable/DataTable.stories';

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
    { id: '1', title: 'my first block', type: 'Paragraph' },
    { id: '2', title: 'my second block', type: 'Media' },
    { id: '3', title: 'my third block', type: 'Unknown' }
  ]
}

export const creatingContainerStory = () => ({
  components: { UpdateContainerSidebar },
  template: '<UpdateContainerSidebar :showSidebar="true" />'
})

creatingContainerStory.storyName = 'when creating a container'
creatingContainerStory.args = { timeoutBeforeScreenshot: 1500 }

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
updatingAnEmptyContainerStory.args = { timeoutBeforeScreenshot: 1500 }

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
submittingAnEmptyContainerStory.args = { timeoutBeforeScreenshot: 1500 }

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
updatingNotEmptyContainerStory.args = { timeoutBeforeScreenshot: 1500 }

export const creatingBlockStory = () => ({
  components: { UpdateContainerSidebar },
  data () {
    return {
      container: notEmptyContainer,
      block: { id: '' }
    }
  },
  template: '<UpdateContainerSidebar :container="container" :showSidebar="true" :block="block" />'
})

creatingBlockStory.storyName = 'when creating a new block'
creatingBlockStory.args = { timeoutBeforeScreenshot: 1500 }

export const updatingBlockStory = () => ({
  components: { UpdateContainerSidebar },
  data () {
    return {
      container: notEmptyContainer,
      block: notEmptyContainer.blocks[2]
    }
  },
  template: '<UpdateContainerSidebar :container="container" :showSidebar="true" :block="block" />'
})

updatingBlockStory.storyName = 'when updating a block'
updatingBlockStory.args = { timeoutBeforeScreenshot: 1500 }
