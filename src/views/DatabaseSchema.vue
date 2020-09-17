<template>
  <div class="container">
    <Toolbar class="p-d-flex p-flex-wrap">
      <template slot="left">
          {{ $t('pages.databaseSchema.title') }}
      </template>

      <template slot="right">
        <Button label="Table" icon="pi pi-plus" />
      </template>
    </Toolbar>
    <div
      v-if="!error"
      id="svg-container"
      v-html="nomnomlSVG"
      @click="onClickTable"
      @mouseover="onClickTable"
    >
    </div>
    <div v-else>Erreur</div>
  </div>
</template>

<script>
import lckClient from '@/services/lck-api'
import nomnoml from 'nomnoml'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import svgPanZoom from 'svg-pan-zoom'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'

export default {
  name: 'DatabaseSchema',
  components: {
    Toolbar,
    Button
  },
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
      if (this.tables && this.tables.length > 0) {
        const nomnomlSource = this.createSource(this.tables)
        const nomnomlSVG = nomnoml.renderSvg(nomnomlSource)
        this.nomnomlSVG = nomnomlSVG
      }
    }
  }
}
</script>
<style>
.container {
  display: flex;
  flex-direction: column;
  max-width: 100vw;
  max-height: 100%;
}
#svg-container, #svg-container svg {
  max-width: 100vw;
  max-height: 100%;
  overflow: hidden;
}
#svg-container svg {
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
