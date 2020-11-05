<template>
  <div class="container">
    <p-toolbar class="p-d-flex p-flex-wrap">
      <template slot="left">
          {{ $t('pages.databaseSchema.title') }}
      </template>
      <template slot="right">
        <p-button
          label="Table"
          icon="pi pi-plus"
          @click="onClickCreateTableDialogButton"
        />
      </template>
    </p-toolbar>
    <div
      v-if="!errorLoadTables"
      id="svg-container"
      v-html="nomnomlSVG"
      @click="onClickTable"
    >
    </div>
    <div v-else>Erreur</div>
    <create-table-modal
      v-if="showCreateTableDialog"
      :databaseId="databaseId"
      @close="onCloseCreateTableDialog"
    />
    <update-table-modal
      v-if="showUpdateTableDialog"
      :currentTable="currentTable"
      @reload-tables="reloadTables"
      @close="onCloseUpdateTableDialog"
    />
  </div>
</template>
<script>
import Vue from 'vue'
import lckClient from '@/services/lck-api'
import nomnoml from 'nomnoml'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import svgPanZoom from 'svg-pan-zoom'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import CreateTableModal from '@/views/modals/CreateTableModal'
import UpdateTableModal from '@/views/modals/UpdateTableModal'

export default {
  name: 'DatabaseSchema',
  components: {
    'p-toolbar': Vue.extend(Toolbar),
    'p-button': Vue.extend(Button),
    'create-table-modal': Vue.extend(CreateTableModal),
    'update-table-modal': Vue.extend(UpdateTableModal)
  },
  props: {
    databaseId: String
  },
  data () {
    return {
      nomnomlSVG: null,
      SVGPanZoom: null,
      tables: null,
      errorLoadTables: false,
      showCreateTableDialog: false,
      showUpdateTableDialog: false,
      currentTable: null
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
    onClickCreateTableDialogButton () {
      this.showCreateTableDialog = true
    },
    onCloseCreateTableDialog (shouldReloadTables) {
      if (shouldReloadTables) {
        this.reloadTables()
      }
      this.showCreateTableDialog = false
    },
    onClickTable (e) {
      const currentTableName = e.target.attributes['data-name']?.value
      if (currentTableName) {
        this.currentTable = this.tablesIndexedByText[currentTableName]
        this.showUpdateTableDialog = true
      }
    },
    onCloseUpdateTableDialog () {
      this.currentTable = null
      this.showUpdateTableDialog = false
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
          if (table.columns && Array.isArray(table.columns)) {
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
          }
          sourceTable.push(`[${table.text + (columns.length ? '|' + columns.join('|') : '')}]`)
        }
      })
      return sourceStyle.concat(sourceTable).concat(sourceRelation).join('\n')
    },
    async loadTables () {
      try {
        const tablesWithColumns = await lckClient.service('table').find({
          query: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            database_id: this.databaseId,
            $eager: '[columns]',
            $limit: 100
          }
        })
        this.tables = tablesWithColumns?.data
        if (this.currentTable) {
          this.currentTable = tablesWithColumns?.data.find((table) => table.id === this.currentTable.id)
        }
      } catch (errorLoadTables) {
        this.errorLoadTables = true
      }
    },
    onResize () {
      this.resizenomnomlSVG()
    },
    resizenomnomlSVG () {
      this.SVGPanZoom.resize()
      this.SVGPanZoom.fit()
      this.SVGPanZoom.center()
    },
    reloadTables () {
      this.loadTables()
      this.resizenomnomlSVG()
    }
  },
  async mounted () {
    this.loadTables()
  },
  updated () {
    if (this.nomnomlSVG && !this.errorLoadTables) {
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
#svg-container {
  max-width: 100vw;
  max-height: 100%;
  overflow: hidden;
}
#svg-container svg {
  width: 100vw;
  height: 100%;
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
