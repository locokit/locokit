<template>
  <div class="p-mx-auto">
    <header class="p-my-4 lck-color-title p-ml-1">
      {{ $t('pages.databaseSchema.title') }}
    </header>
    <span
      v-html="nomnomlSVG"
      @click="onClickTable"
      @mouseover="onClickTable"
    ></span>
  </div>
</template>

<script>
import lckClient from '@/services/lck-api'
import nomnoml from 'nomnoml'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

export default {
  name: 'DatabaseSchema',
  data () {
    return {
      nomnomlSVG: null,
      tables: null
    }
  },
  computed: {
    tablesIndexedByText () {
      if (!this.tables || this.tables.length < 1) return null
      const result = {}
      this.tables.forEach(t => {
        result[t.text] = t
      })
      return result
    }
  },
  methods: {
    onClickTable (e) {
      const currentTableName = e.target.attributes['data-name']?.value
      if (!currentTableName) return
      console.log(e, e.target, currentTableName, this.tablesIndexedByText[currentTableName])
    },
    createSource (tables) {
      const sourceStyle = [
        '#fill: #ffffff',
        '#lineWidth: 1',
        '#padding: 8',
        '#spacing: 50',
        '#ranker: longest-path',
        '#title: ' + this.$t('pages.databaseSchema.title')
      ]
      const sourceTable = []
      const sourceRelation = []
      tables.forEach(table => {
        if (table && table.id && table.text) {
          const columns = []
          table.columns.forEach(column => {
            if (column) {
              const hasRelation = (column.column_type_id === COLUMN_TYPE.RELATION_BETWEEN_TABLES) // && column.settings.tableId
              if (column.text) {
                columns.push(`${column.text + (column.column_type_id ? ': ' + column.column_type_id : '') + (hasRelation ? '🔑' : '')}`)
              }
              if (hasRelation) {
                const relationTable = tables.find(table => table.id === column.settings.tableId)
                if (relationTable && relationTable.text) {
                  sourceRelation.push(`[${table.text}]->[${relationTable.text}]`)
                }
              }
            }
          })
          sourceTable.push(`[${table.text + (columns.length ? '|' + columns.join('|') : '')}]`)
        }
      })
      return sourceStyle.concat(sourceTable).concat(sourceRelation).join('\n')
    },
    async loadTables () {
      const tablesWithColumns = await lckClient.service('table').find({
        query: { $eager: '[columns]' }
      })
      this.tables = tablesWithColumns?.data
    }
  },
  async mounted () {
    this.loadTables()
  },
  watch: {
    tables () {
      const nomnomlSource = this.createSource(this.tables)
      const nomnomlSVG = nomnoml.renderSvg(nomnomlSource)
      this.nomnomlSVG = nomnomlSVG
    }
  }
}
</script>
