import LckAsyncImage from './AsyncImage.vue'

export default {
  title: 'components/ui/AsyncImage',
  component: LckAsyncImage,
  parameters: {
    docs: {
      description: `
        AsyncImage component allows us to load an image asynchronously,
        making fetch calls to GET an image protected by authentication, for example.
      `
    }
  }
}

export const defaultStory = () => (
  {
    components: {
      LckAsyncImage
    },
    template: `
    <div style="width: 200px; height: 50px; max-height: 50px; display: flex; justify-content: center; color: var(--primary-color)">
      <lck-async-image src="/themes/locokit/img/logokit-grayscale.png" />
    </div>`
  }
)

defaultStory.storyName = 'default'

export const loadingStory = () => (
  {
    components: {
      LckAsyncImage
    },
    template: `
    <div style="width: 200px; height: 50px; max-height: 50px; display: flex; justify-content: center; color: var(--primary-color)">
      <lck-async-image src="wait-some-time" ref="lai" />
    </div>`,
    mounted () {
      this.$refs.lai.loading = true
    }
  }
)

loadingStory.storyName = 'loading'

export const errorStory = () => (
  {
    components: {
      LckAsyncImage
    },
    template: `
    <div style="width: 200px; height: 50px; max-height: 50px; display: flex; justify-content: center; color: var(--primary-color)">
      <lck-async-image src="bad-src" ref="lai" />
    </div>`
  }
)

errorStory.storyName = 'error'

export const noImage = () => (
  {
    components: {
      LckAsyncImage
    },
    template: `
    <div style="width: 200px; height: 50px; max-height: 50px; display: flex; justify-content: center; color: var(--primary-color)">
      <lck-async-image />
    </div>`
  }
)

noImage.storyName = 'no image'
