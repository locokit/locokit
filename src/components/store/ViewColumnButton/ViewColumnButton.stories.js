/* eslint-disable @typescript-eslint/camelcase */
import ViewColumnButton from './ViewColumnButton'

export default {
  title: 'components/store/View/ViewColumnButton',
  component: ViewColumnButton
}

export const defaultStory = () => (
  {
    components: { ViewColumnButton },
    template: '<ViewColumnButton />'
  }
)

defaultStory.storyName = 'default'

export const disabledStory = () => (
  {
    components: { ViewColumnButton },
    template: '<ViewColumnButton :disabled="true" />'
  }
)

disabledStory.storyName = 'disabled'

const value = [
  'e40fd54c-f330-48e3-8f32-6e0a7939b0ed',
  'a20915a9-0420-4bbe-be12-b73f81829a69',
  '3d5681a5-9242-40a7-9e4c-21a6cbd5b5f4',
  '9bd06fa9-a221-4c1e-ad86-01687dbd3364'
]
const columns = [{
  id: 'e6c04798-93a8-4b3e-a3bd-42833cf0c3f6',
  text: 'First name',
  position: 0
}, {
  id: '9bd06fa9-a221-4c1e-ad86-01687dbd3364',
  text: 'Tel',
  position: 1
}, {
  id: 'a20915a9-0420-4bbe-be12-b73f81829a69',
  text: 'Last name',
  position: 2
}, {
  id: 'e40fd54c-f330-48e3-8f32-6e0a7939b0ed',
  text: 'e-mail',
  position: 3
}, {
  id: '3d5681a5-9242-40a7-9e4c-21a6cbd5b5f4',
  text: 'User',
  position: 4
}]

export const withValueAndColumnsStory = () => (
  {
    components: { ViewColumnButton },
    data () {
      return {
        value,
        columns
      }
    },
    template: `
      <ViewColumnButton
        ref="vcb"
        :value="value"
        :columns="columns"
      />
    `,
    mounted () {
      this.$refs.vcb.$el.querySelector('button').click()
    }

  }
)

withValueAndColumnsStory.storyName = 'with value and columns'
withValueAndColumnsStory.args = { timeoutBeforeScreenshot: 1000 }
