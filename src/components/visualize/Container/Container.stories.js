import Container from './Container'

export default {
  title: 'Container',
  component: Container
}

export const ContainerStoryWithoutProps = () => ({
  components: { Container },
  template: '<Container />'
})

ContainerStoryWithoutProps.storyName = 'Container without props'

export const ContainerStoryWithoutBlocks = () => ({
  components: { Container },
  data () {
    return {
      container: {
        text: 'Container 1'
      }
    }
  },
  template: '<Container :container="container" />'
})

ContainerStoryWithoutBlocks.storyName = 'Container without blocks'

export const ContainerStoryWithProps = () => ({
  components: { Container },
  data () {
    return {
      container: {
        text: 'Container 1',
        block: [{
          id: 1,
          text: 'Block 1',
          type: 'Paragraph'
        }]
      }
    }
  },
  template: '<Container :container="container" />'
})

ContainerStoryWithProps.storyName = 'Container with expected props'
