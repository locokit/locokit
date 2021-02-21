import DropdownButton from './DropdownButton'
// import { action } from '@storybook/addon-actions'

export default {
  title: 'components/ui/DropdownButton',
  component: DropdownButton
}

export const defaultStory = () => ({
  components: { DropdownButton },
  template: '<DropdownButton />'
})

defaultStory.storyName = 'default'

const model = [{
  id: 0,
  label: 'Suggestion one',
  to: '/my-route/0'
}, {
  id: 1,
  label: 'Suggestion two',
  to: '/my-route/1'
}, {
  id: 2,
  label: 'Suggestion three',
  to: '/my-route/2'
}]

export const withModel = () => ({
  components: { DropdownButton },
  data () {
    return {
      model
    }
  },
  template: `
    <DropdownButton
      class="no-decoration-link p-mr-2"
      label="This is a dropdown button"
      :model="model"
    />
  `
})

withModel.storyName = 'with model'

export const dropdownOpenedWithModel = () => ({
  components: { DropdownButton },
  data () {
    return {
      model
    }
  },
  template: `
    <DropdownButton
      ref="db"
      class="no-decoration-link p-mr-2"
      label="This is a dropdown button"
      :model="model"
    />
  `,
  async mounted () {
    await this.$refs.db.$el.querySelector('button').click()
  }
})

dropdownOpenedWithModel.storyName = 'dropdown opened with model'
dropdownOpenedWithModel.args = {
  waitForSelector: '.p-menu-overlay'
}
