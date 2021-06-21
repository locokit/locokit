import UpdateBlockForm from './UpdateBlockForm.vue'
import { BLOCK_TYPE, MEDIA_TYPE } from '@locokit/lck-glossary'
export default {
  title: 'components/visualize/UpdateBlockForm',
  component: UpdateBlockForm
}

const newBlock = {
  id: ''
}
const unknownTypeBlock = {
  id: '1',
  title: 'my unknown block',
  type: 'UnknownTypeBlock'
}
const paragraphBlock = {
  id: '1',
  title: 'my paragraph block',
  type: BLOCK_TYPE.PARAGRAPH,
  settings: {
    content: 'The text to display.'
  }
}
const mediaBlock = {
  id: '1',
  title: 'my media block',
  type: BLOCK_TYPE.MEDIA,
  settings: {
    displayMode: MEDIA_TYPE.GALLERY,
    medias: [
      {
        name: 'Image',
        srcURL: '/img/img1.png',
        type: MEDIA_TYPE.IMAGE
      },
      {
        name: 'Video',
        srcURL: '/videos/video1.avi',
        type: MEDIA_TYPE.VIDEO
      }
    ]
  }
}
const kanbanBlock = {
  id: '1',
  title: 'my kanban block',
  type: BLOCK_TYPE.KANBAN_SET,
  settings: {}
}
const markdownBlock = {
  id: '1',
  title: 'my markdown block',
  type: BLOCK_TYPE.MARKDOWN,
  settings: {
    content: '<h1>The markdown to display.</h1>'
  }
}

const tableViewDefinition = {
  id: '123456',
  text: 'My view to display'
}

const relatedChapterPages = [
  { id: '1', text: 'Page 1' },
  { id: '2', text: 'Page 2' },
  { id: '3', text: 'Page 3' },
  { id: '4', text: 'Page 4' }
]

const tableSetBlock = {
  id: '1',
  title: 'my table view block',
  type: BLOCK_TYPE.TABLE_SET,
  settings: {
    id: '123456',
    exportAllowed: true,
    addAllowed: false,
    pageDetailId: '1'
  },
  definition: tableViewDefinition
}
const dataRecordBlock = {
  id: '1',
  title: 'my detail view block',
  type: BLOCK_TYPE.DATA_RECORD,
  settings: {
    content: 'The text to display.'
  },
  definition: tableViewDefinition
}

const mapBlock = {
  id: '1',
  title: 'my map block',
  type: BLOCK_TYPE.MAP_SET,
  settings: {
    sources: [
      {
        id: '123456',
        pageDetailId: '1'
      },
      {
        id: ''
      }
    ]
  },
  definition: { [tableViewDefinition.id]: tableViewDefinition }
}

export const newBlockStory = () => ({
  components: { UpdateBlockForm },
  data () {
    return {
      block: newBlock
    }
  },
  template: '<UpdateBlockForm :block="block" />'
})

export const unknownTypeBlockStory = () => ({
  components: { UpdateBlockForm },
  data () {
    return {
      block: unknownTypeBlock
    }
  },
  template: '<UpdateBlockForm :block="block" />'
})

export const paragraphBlockStory = () => ({
  components: { UpdateBlockForm },
  data () {
    return {
      block: paragraphBlock
    }
  },
  template: '<UpdateBlockForm :block="block" />'
})

export const mediaBlockStory = () => ({
  components: { UpdateBlockForm },
  data () {
    return {
      block: mediaBlock
    }
  },
  template: '<UpdateBlockForm :block="block" />'
})

export const markdownBlockStory = () => ({
  components: { UpdateBlockForm },
  data () {
    return {
      block: markdownBlock
    }
  },
  template: '<UpdateBlockForm :block="block" />'
})

export const kanbanBlockStory = () => ({
  components: { UpdateBlockForm },
  data () {
    return {
      block: kanbanBlock
    }
  },
  template: '<UpdateBlockForm :block="block" />'
})

export const tableSetBlockStory = () => ({
  components: { UpdateBlockForm },
  data () {
    return {
      block: tableSetBlock,
      relatedChapterPages: relatedChapterPages
    }
  },
  template: '<UpdateBlockForm :block="block" :relatedChapterPages="relatedChapterPages" />'
})

export const DataRecordBlockStory = () => ({
  components: { UpdateBlockForm },
  data () {
    return {
      block: dataRecordBlock
    }
  },
  template: '<UpdateBlockForm :block="block" />'
})

export const mapBlockStory = () => ({
  components: { UpdateBlockForm },
  data () {
    return {
      block: mapBlock,
      relatedChapterPages: relatedChapterPages
    }
  },
  template: '<UpdateBlockForm :block="block" :relatedChapterPages="relatedChapterPages" />'
})
