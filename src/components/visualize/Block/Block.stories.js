import Block from './Block'

export default {
  title: 'Block',
  component: Block
}
export const BlockBasicStory = () => ({
  components: { Block },
  template: '<Block />'
})

BlockBasicStory.storyName = 'Block base'

const blockTableView = {
  type: 'TableView'
}

export const BlockTVStory = () => ({
  components: { Block },
  data () {
    return {
      block: blockTableView
    }
  },
  template: '<Block :block="block" />'
})

BlockBasicStory.storyName = 'Block TableView'

// const blockTypeNotKnown = {
//   type: 'not known'
// }

// export const BlockTypeNotKnownStory = () => ({
//   components: { Block },
//   data () {
//     return {
//       block: blockTypeNotKnown
//     }
//   },
//   template: '<Block :block="block" />'
// })

// BlockTypeNotKnownStory.storyName = 'Block unknown'
