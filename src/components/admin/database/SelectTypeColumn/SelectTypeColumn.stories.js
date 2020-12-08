import SelectTypeColumn from './SelectTypeColumn'

export default {
  title: 'components/admin/database/SelectTypeColumn',
  component: SelectTypeColumn
}

export const createStory = () => (
  {
    components: { SelectTypeColumn },
    template: '<SelectTypeColumn />'
  }
)

createStory.storyName = 'Create'

export const updateStory = () => (
  {
    components: { SelectTypeColumn },
    data () {
      return {
        columnToHandle: {
          settings: {
            values: {
              "1":
                {
                  label: "Type 1",
                  color: "#FFFFFF",
                  backgroundColor: "#000000",
                  position: 1
                },
              "2":
                {
                  label: "Type 2",
                  color: "#000000",
                  backgroundColor: "#FFFFFF",
                  position: 2
                }
            },
            default: "2"
          }
        }
      }
    },
    template: `
      <SelectTypeColumn
        :columnToHandle="columnToHandle"
      />
    `
  }
)

updateStory.storyName = 'Update'
