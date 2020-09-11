<template>
  <div class="p-mx-auto">
    <header class="p-my-4 lck-color-title p-ml-1">
      {{ $t('pages.databaseSchema.title')}}
    </header>
    <canvas ref="schema"></canvas>
  </div>
</template>

<script>
import lckClient from '@/services/lck-api'
import nomnoml from 'nomnoml'

export default {
  name: 'DatabaseSchema',
  methods: {
    createSource (tables) {
      const sourceStyle = ['#fill: #ffffff', '#direction: right', '#ranker: longest-path']
      const sourceTable = []
      const sourceRelation = []
      tables.forEach(table => {
        if (table && table.id && table.text) {
          const columns = []
          table.columns.forEach(column => {
            if (column) {
              if (column.text) {
                columns.push(`${column.text + (column.column_type_id ? ': ' + column.column_type_id : '')}`)
              }
              if (column.settings && column.settings.tableId) {
                const relationTable = tables.find(table => table.id === column.settings.tableId)
                if (relationTable && relationTable.text) {
                  sourceRelation.push(`[${table.text}]-[${relationTable.text}]`)
                }
              }
            }
          })
          sourceTable.push(`[${table.text + (columns.length ? '|' + columns.join('|') : '')}]`)
        }
      })
      return sourceStyle.concat(sourceTable).concat(sourceRelation).join('\n')
    }
  },
  async mounted () {
    // eslint-disable-next-line no-undef
    const tablesWithColumns = await lckClient.service('table').find({
      query: { $eager: '[columns]' }
    })
    if (tablesWithColumns && tablesWithColumns.data) {
      nomnoml.draw(this.$refs.schema, this.createSource(tablesWithColumns.data))
    }
  }
}
</script>
