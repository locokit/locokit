import RelationBetweenTablesTypeColumn from './RelationBetweenTablesTypeColumn'

export default {
  title: 'components/admin/database/RelationBetweenTablesTypeColumn',
  component: RelationBetweenTablesTypeColumn
}

export const createStory = () => (
  {
    components: { RelationBetweenTablesTypeColumn },
    template: '<RelationBetweenTablesTypeColumn />'
  }
)

createStory.storyName = 'Create'
