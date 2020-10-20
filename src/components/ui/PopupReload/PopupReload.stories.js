import PopupReload from './PopupReload'
// import { action } from '@storybook/addon-actions'

export default {
  title: 'components/ui/PopupReload',
  component: PopupReload
}

export const defaultStory = () => ({
  components: { PopupReload },
  data () {
    return {
      displayPopup: true
    }
  },
  template: `
    <PopupReload
      v-if="displayPopup"
      @cancel="displayPopup = false"
    />
  `
})

defaultStory.storyName = 'default'
