import UpdateSidebar from './UpdateSidebar.vue'

export default {
  title: 'components/visualize/UpdateSidebar',
  component: UpdateSidebar
}

const emptyPage = {
  id: 'pageID',
  text: 'my page',
  containers: []
}

const notEmptyPage = {
  ...emptyPage,
  containers: [
    { id: 'containerID', title: 'my container', displayed_in_navbar: false },
  ]
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
  components: { UpdateSidebar },
  data () {
    return {
      page: emptyPage
    }
  },
  template: '<UpdateSidebar :page="page" :showSidebar="true" />'
})

creatingContainerStory.storyName = 'when display page'
creatingContainerStory.args = {
  waitForSelector: '.p-sidebar'
}

export const updatingAnEmptyContainerStory = () => ({
  components: { UpdateSidebar },
  data () {
    return {
      container: emptyContainer,
      page: notEmptyPage
    }
  },
  template: '<UpdateSidebar :page="page" :container="container" :showSidebar="true" />'
})

updatingAnEmptyContainerStory.storyName = 'when updating an empty container'
updatingAnEmptyContainerStory.args = {
  waitForSelector: '.p-sidebar'
}

export const submittingAnEmptyContainerStory = () => ({
  components: { UpdateSidebar },
  data () {
    return {
      container: emptyContainer,
      page: notEmptyPage
    }
  },
  template: '<UpdateSidebar :page="page"  :container="container" :submitting="true" :showSidebar="true" />'
})

submittingAnEmptyContainerStory.storyName = 'when submitting an empty container'
submittingAnEmptyContainerStory.args = {
  waitForSelector: '.p-sidebar'
}

export const updatingNotEmptyContainerStory = () => ({
  components: { UpdateSidebar },
  data () {
    return {
      container: notEmptyContainer,
      page: notEmptyPage
    }
  },
  template: '<UpdateSidebar :page="page" :container="container" :showSidebar="true" />'
})

updatingNotEmptyContainerStory.storyName = 'when updating a not empty container'
updatingNotEmptyContainerStory.args = {
  waitForSelector: '.p-sidebar'
}

export const creatingBlockStory = () => ({
  components: { UpdateSidebar },
  data () {
    return {
      container: notEmptyContainer,
      page: notEmptyPage,
      block: { id: 'temp' }
    }
  },
  template: '<UpdateSidebar :page="page" :container="container" :showSidebar="true" :block="block" />'
})

creatingBlockStory.storyName = 'when creating a new block'
creatingBlockStory.args = {
  waitForSelector: '.p-sidebar'
}

export const updatingBlockStory = () => ({
  components: { UpdateSidebar },
  data () {
    return {
      container: notEmptyContainer,
      block: notEmptyContainer.blocks[2],
      page: notEmptyPage,
    }
  },
  template: '<UpdateSidebar :page="page" :container="container" :showSidebar="true" :block="block" />'
})

updatingBlockStory.storyName = 'when updating a block'
updatingBlockStory.args = {
  waitForSelector: '.p-sidebar'
}
