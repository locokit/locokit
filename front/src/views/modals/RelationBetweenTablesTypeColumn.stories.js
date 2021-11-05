import RelationBetweenTablesTypeColumn from './RelationBetweenTablesTypeColumn'

export default {
  title: 'views/modals/RelationBetweenTablesTypeColumn',
  component: RelationBetweenTablesTypeColumn,
}

export const defaultStory = () => (
  {
    components: { RelationBetweenTablesTypeColumn },
    template: `
      <div class="p-fluid">
        <RelationBetweenTablesTypeColumn />
      </div>
    `,
  }
)

defaultStory.storyName = 'default'
