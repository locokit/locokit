<template>
  <div class="container">
    <p-toolbar class="p-d-flex p-flex-wrap">
      <template slot="left">
        {{ $t('pages.databaseSchema.title') }}
      </template>
      <template slot="right">
        <p-button
          :label="$t('pages.databaseSchema.addTable')"
          icon="bi bi-plus-lg"
          @click="onClickCreateTableModalButton"
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
    <div
      v-else
      class="p-p-3"
    >
      {{ $t('pages.databaseSchema.noSchema') }}
    </div>
    <create-table-modal
      :visible="showCreateTableModal"
      :databaseId="databaseId"
      @close="onCloseCreateTableModal"
    />
    <update-table-sidebar
      :showUpdateTableSidebar="showUpdateTableSidebar"
      :databaseId="databaseId"
      :currentTable="currentTable"
      @reload-tables="reloadTables"
      @close="onCloseUpdateTableSidebar"
      @confirm="onConfirmationDeleteColumn($event)"
    />
    <p-confirm-dialog />
  </div>

</template>

<script>
import Vue from 'vue'

import nomnoml from 'nomnoml'
import svgPanZoom from 'svg-pan-zoom'

import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { lckServices } from '@/services/lck-api'

import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'

import CreateTableModal from '@/views/modals/CreateTableModal.vue'
import UpdateTableSidebar from '@/views/modals/UpdateTableSidebar.vue'

export default {
  name: 'DatabaseSchema',
  components: {
    'create-table-modal': CreateTableModal,
    'update-table-sidebar': UpdateTableSidebar,
    'p-confirm-dialog': Vue.extend(ConfirmDialog),
    'p-toolbar': Vue.extend(Toolbar),
    'p-button': Vue.extend(Button),
  },
  props: {
    databaseId: String,
  },
  data () {
    return {
      nomnomlSVG: null,
      SVGPanZoom: null,
      tables: null,
      errorLoadTables: false,
      showCreateTableModal: false,
      showUpdateTableSidebar: false,
      currentTable: null,
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
    },
  },
  methods: {
    onClickCreateTableModalButton () {
      this.showCreateTableModal = true
    },
    onCloseCreateTableModal (shouldReloadTables) {
      if (shouldReloadTables) {
        this.reloadTables()
      }
      this.showCreateTableModal = false
    },
    onClickTable (e) {
      const currentTableName = e.target.attributes['data-name']?.value
      if (currentTableName) {
        this.currentTable = this.tablesIndexedByText[currentTableName]
        this.showUpdateTableSidebar = true
      }
    },
    onCloseUpdateTableSidebar () {
      this.currentTable = null
      this.showUpdateTableSidebar = false
    },
    onConfirmationDeleteColumn (column) {
      this.$confirm.require({
        message: `${this.$t('form.specificDeleteConfirmation')} ${column.text}`,
        header: this.$t('form.confirmation'),
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          try {
            await lckServices.tableColumn.remove(column.id)
            this.reloadTables()
            this.$toast.add({
              severity: 'success',
              summary: this.$t('components.processPanel.SUCCESS'),
              detail: this.$t('success.removed'),
              life: 5000,
            })
          } catch (error) {
            this.$toast.add({
              severity: 'error',
              summary: this.$t('components.processPanel.ERROR'),
              detail: this.$t('components.processPanel.failedNewRun'),
              life: 5000,
            })
          }
        },
      })
    },
    createSource (tables) {
      const sourceStyle = [
        '#fill: #ffffff',
        '#lineWidth: 1',
        '#padding: 8',
        '#spacing: 50',
        '#ranker: longest-path',
        '#title: ' + this.$t('pages.databaseSchema.title'),
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
                  columns.push(`${column.text.replaceAll('[', '').replaceAll(']', '') + (hasRelation ? '🔑' : '')}`)
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
        const tablesWithColumns = await lckServices.table.find({
          query: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            database_id: this.databaseId,
            $eager: '[columns]',
            $limit: 100,
          },
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
    },
  },
  mounted () {
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
    },
  },
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

text[data-name],
path {
  pointer-events: none;
}
</style>
