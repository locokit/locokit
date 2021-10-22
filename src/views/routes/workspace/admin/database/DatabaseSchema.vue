<template>
  <div class="container">
    <header class="p-m-3 p-d-flex p-ai-center p-jc-between">
      <div class="">
        {{ $t('pages.databaseSchema.title') }}
      </div>
      <div>
        <p-button
          :label="$t('pages.databaseSchema.addTable')"
          icon="bi bi-plus-lg"
          @click="onClickCreateTableModalButton"
        />
        <p
          v-if="tables && tables.length === 0"
          class="schema-info"
        >
          <i class="bi bi-info-circle"></i>
          {{ $t('pages.databaseSchema.noTable') }}
        </p>
      </div>
    </header>

    <div
      v-if="!errorLoadTables"
      id="svg-container"
      v-html="nomnomlSVG"
      @click="onClickTable"
    >
    </div>
    <p
      v-else
      class="schema-info"
    >
      <i class="bi bi-exclamation-circle"></i>
      {{ $t('pages.databaseSchema.noSchema') }}
    </p>
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

<script lang="ts">
import Vue from 'vue'

import { renderSvg } from 'nomnoml'
import svgPanZoom from 'svg-pan-zoom'

import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { lckServices } from '@/services/lck-api'
import { LckTable, LckTableColumn } from '@/services/lck-api/definitions'
import { objectFromArray } from '@/services/lck-utils/arrays'

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
    } as {
      nomnomlSVG: string | null;
      SVGPanZoom: typeof svgPanZoom | null;
      tables: LckTable[] | null;
      errorLoadTables: boolean;
      showCreateTableModal: boolean;
      showUpdateTableSidebar: boolean;
      currentTable: LckTable | null;
    }
  },
  computed: {
    tablesIndexedByText (): Record<string, LckTable> {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (!this.tables || this.tables!.length < 1) return {}
      return objectFromArray<LckTable>(this.tables, 'text')
    },
  },
  methods: {
    onClickCreateTableModalButton () {
      this.showCreateTableModal = true
    },
    onCloseCreateTableModal (shouldReloadTables: boolean) {
      if (shouldReloadTables) {
        this.reloadTables()
      }
      this.showCreateTableModal = false
    },
    onClickTable (e: { target: SVGElement }) {
      const currentTableName = e.target.attributes.getNamedItem('data-name')?.value
      if (currentTableName) {
        this.currentTable = this.tablesIndexedByText[currentTableName]
        this.showUpdateTableSidebar = true
      }
    },
    onCloseUpdateTableSidebar () {
      this.currentTable = null
      this.showUpdateTableSidebar = false
    },
    onConfirmationDeleteColumn (column: LckTableColumn) {
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
    createSource (tables: LckTable[]) {
      const sourceStyle = [
        '#fill: #ffffff',
        '#lineWidth: 1',
        '#padding: 8',
        '#spacing: 50',
        '#ranker: longest-path',
        '#title: ' + this.$t('pages.databaseSchema.title'),
      ]
      const sourceTable: string[] = []
      const sourceRelation: string[] = []
      tables.forEach(table => {
        if (table && table.id && table.text) {
          const columns: string[] = []
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
            $limit: -1,
          },
        }) as LckTable[]
        this.tables = tablesWithColumns
        if (this.currentTable) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.currentTable = tablesWithColumns.find((table) => table.id === this.currentTable!.id) || null
        }
      } catch (errorLoadTables) {
        this.errorLoadTables = true
      }
    },
    onResize () {
      this.resizenomnomlSVG()
    },
    resizenomnomlSVG () {
      if (this.SVGPanZoom) {
        this.SVGPanZoom.resize()
        this.SVGPanZoom.center()
      }
    },
    async reloadTables () {
      await this.loadTables()
      this.resizenomnomlSVG()
    },
  },
  async mounted () {
    await this.loadTables()
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  watch: {
    tables () {
      if (this.tables && this.tables.length > 0) {
        const nomnomlSource = this.createSource(this.tables)
        const nomnomlSVG = renderSvg(nomnomlSource)
        this.nomnomlSVG = nomnomlSVG
        // Wait the SVG is loaded
        this.$nextTick(() => {
          if (!this.errorLoadTables) {
            // Manage the zoom level
            this.SVGPanZoom = svgPanZoom('#svg-container > svg', { controlIconsEnabled: true, minZoom: 0.1 })
            const realZoom = this.SVGPanZoom.getSizes().realZoom
            if (realZoom > 1) {
              this.SVGPanZoom.zoomBy(1 / realZoom)
            }
          }
        })
      }
    },
  },
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--header-height));
  width: calc(100vw - var(--nav-width) - var(--sidebar-width))
}

#svg-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-container svg {
  width: 100%;
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
.schema-info {
  color: var(--text-color);
  font-style: italic;
  margin: auto;
  text-align: center;
}
.schema-info i {
  display: block;
  font-size: 3rem;
  margin-bottom: 1rem;
}
</style>
