<template>
  <div class="p-mx-auto">
    <header class="p-py-2 lck-color-title p-pl-1 p-shadow-1 nowrap">
      {{ $t('pages.databaseSchema.title') }}
    </header>
    <div v-if="error">Erreur</div>
    <div
      id="svg-container"
      v-html="nomnomlSVG"
      @click="onClickTable"
      @mouseover="onClickTable"
    ></div>
  </div>
</template>

<script>
import lckClient from '@/services/lck-api'
import nomnoml from 'nomnoml'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import svgPanZoom from 'svg-pan-zoom'

export default {
  name: 'DatabaseSchema',
  props: {
    databaseId: null
  },
  data () {
    return {
      nomnomlSVG: null,
      SVGPanZoom: null,
      tables: null,
      error: false
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
      console.log(currentTableName)
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
      try {
        const tablesWithColumns = await lckClient.service('table').find({
          query: {
            $eager: '[columns]',
            // eslint-disable-next-line @typescript-eslint/camelcase
            database_id: this.databaseId
          }
        })
        this.tables = tablesWithColumns?.data
      } catch (error) {
        this.error = true
      }
    },
    onResize () {
      this.SVGPanZoom.resize()
      this.SVGPanZoom.fit()
      this.SVGPanZoom.center()
    }
  },
  async mounted () {
    this.loadTables()
  },
  updated () {
    if (this.nomnomlSVG && !this.error) {
      this.SVGPanZoom = svgPanZoom('#svg-container > svg', { controlIconsEnabled: true })
      window.addEventListener('resize', this.onResize)
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
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
<style>
header {
  position: relative;
  background-color: #f7fafc;
  z-index: 10;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
#svg-container, #svg-container svg {
  width: 100vw;
  height: calc(100vh - 64px - 40.15px - 4px);
}
#svg-container svg {
  overflow: visible !important;
  cursor: move;
  user-select: none;
}
rect[data-name]:hover {
  fill: #e5e5e5 !important;
  cursor: pointer;
}
text[data-name], path {
  pointer-events: none;
}
</style>
