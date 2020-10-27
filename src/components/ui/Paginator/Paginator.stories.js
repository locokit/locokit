import Paginator from './Paginator'

export default {
  title: 'components/ui/Paginator',
  component: Paginator
}

export const defaultStory = () => (
  {
    components: { Paginator },
    template: '<Paginator />'
  }
)

defaultStory.storyName = 'default'

export const withProps = () => (
  {
    components: { Paginator },
    data () {
      return {
        rows: 20,
        skip: 0,
        totalRecords: 100
      }
    },
    methods: {
      onUpdateContent (pageIndexToGo) {
        this.skip = pageIndexToGo * this.rows
      }
    },
    template: `<Paginator
      :rows="rows"
      :skip="skip"
      :totalRecords="totalRecords"
      @update-content="onUpdateContent"
    />`
  }
)

withProps.storyName = 'with props'
