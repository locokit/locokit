/* eslint-disable @typescript-eslint/camelcase */
import UpdateContainerForm from './UpdateContainerForm.vue'

export default {
  title: 'components/visualize/UpdateContainerForm',
  component: UpdateContainerForm
}

const newContainer = {
  text: '',
  display_title: false,
  displayed_in_navbar: false,
  elevation: false,
  anchor_label: '',
  anchor_icon: '',
  anchor_icon_class: ''

}

export const newBlockStory = () => ({
  components: { UpdateContainerForm },
  data () {
    return {
      container: newContainer
    }
  },
  template: '<UpdateContainerForm :container="container" />'
})
