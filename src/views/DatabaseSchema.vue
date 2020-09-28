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
    <p-dialog @hide="resetCreateTableDialog" header="Créer une table" :visible.sync="showCreateTableDialog" :modal="true">
      <div class="p-field p-mt-4 p-float-label">
          <p-input-text id="table-name" v-bind:class="{ 'p-invalid': errorTableNameToCreate }" type="text" v-model="tableNameToCreate" autofocus />
          <label for="table-name">Nom de la table</label>
      </div>
      <div v-if="errorTableNameToCreate" class="p-invalid">
        <small id="table-name-invalid" class="p-invalid">{{ errorTableNameToCreate }}</small>
      </div>
      <template #footer>
        <p-button @click="closeCreateTableDialog" label="Annuler" icon="pi pi-times" class="p-button-text"/>
        <p-button @click="confirmCreateTableDialog" label="Créer" icon="pi pi-check" class="p-button-text" />
      </template>
    </p-dialog>
    <p-dialog :contentStyle="{overflow: 'visible'}" @hide="resetUpdateTableDialog" header="Modifier une table" :visible.sync="showUpdateTableDialog" :modal="true">
      <div class="p-d-flex">
        <div>
            <label for="table-name">Nom de la table</label>
            <p-input-text id="table-name" v-bind:class="{ 'p-invalid': errorTableNameToUpdate }" type="text" v-model="tableNameToUpdate" />
        </div>
        <div class="p-d-flex p-ai-end">
          <div v-if="errorTableNameToUpdate" class="p-invalid">
            <small id="table-name-invalid" class="p-invalid">{{ errorTableNameToUpdate }}</small>
          </div>
          <p-button @click="updateTableName" label="Modifier" icon="pi pi-check" class="p-button-text" />
        </div>
      </div>
      <div class="p-d-flex p-mt-4">
        <div>
            <label for="column-name">Nom de la colonne</label>
            <p-input-text id="column-name" v-bind:class="{ 'p-invalid': errorTableNameToUpdate }" type="text" v-model="newColumnName" />
        </div>
        <div class="p-d-flex p-ai-end p-mx-2">
          <p-dropdown style="width: 300px" v-model="selectedColumnType" :options="columnTypes" optionLabel="name" placeholder="Sélectionner un type de colonne" />
        </div>
        <div class="p-d-flex p-ai-end">
          <div v-if="errorAddColumn" class="p-invalid">
            <small id="add-column-invalid" class="p-invalid">{{ errorAddColumn }}</small>
          </div>
          <p-button @click="addColumn" label="Ajouter" icon="pi pi-check" class="p-button-text" autofocus />
        </div>
      </div>
      <template #footer>
        <p-button @click="closeUpdateTableDialog" label="Fermer" icon="pi pi-times" class="p-button-text"/>
      </template>
    </p-dialog>
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
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'

export default {
  name: 'DatabaseSchema',
  components: {
    'p-toolbar': Vue.extend(Toolbar),
    'p-button': Vue.extend(Button),
    'p-dialog': Vue.extend(Dialog),
    'p-input-text': Vue.extend(InputText),
    'p-dropdown': Vue.extend(Dropdown)
  },
  props: {
    databaseId: null
  },
  data () {
    return {
      nomnomlSVG: null,
      SVGPanZoom: null,
      tables: null,
      errorLoadTables: false,
      showCreateTableDialog: false,
      tableNameToCreate: null,
      errorTableNameToCreate: null,
      showUpdateTableDialog: false,
      tableNameToUpdate: null,
      errorTableNameToUpdate: null,
      currentTable: null,
      columnTypes: [],
      newColumnName: null,
      selectedColumnType: null,
      errorAddColumn: null
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
    closeCreateTableDialog () {
      this.resetCreateTableDialog()
      this.showCreateTableDialog = false
    },
    resetCreateTableDialog () {
      this.tableNameToCreate = null
      this.errorTableNameToCreate = null
    },
    async confirmCreateTableDialog () {
      try {
        const createTableResponse = await lckClient.service('table').create({
          // eslint-disable-next-line @typescript-eslint/camelcase
          database_id: this.databaseId,
          text: this.tableNameToCreate
        })
        if (createTableResponse) {
          this.errorTableNameToCreate = false
          this.showCreateTableDialog = false
          this.reloadTables()
        }
      } catch (errorCreateTable) {
        this.errorTableNameToCreate = errorCreateTable.message
      }
    },
    onClickTable (e) {
      const currentTableName = e.target.attributes['data-name']?.value
      if (currentTableName) {
        this.currentTable = this.tablesIndexedByText[currentTableName]
        this.tableNameToUpdate = currentTableName
        this.showUpdateTableDialog = true
      }
    },
    closeUpdateTableDialog () {
      this.resetUpdateTableDialog()
      this.showUpdateTableDialog = false
      this.errorTableNameToUpdate = false
      this.reloadTables()
    },
    resetUpdateTableDialog () {
      this.tableNameToUpdate = null
      this.errorTableNameToUpdate = null
    },
    async updateTableName () {
      try {
        const updateTableResponse = await lckClient.service('table').patch(this.currentTable.id, {
          text: this.tableNameToUpdate
        })
      } catch (errorUpdateTable) {
        this.errorTableNameToUpdate = errorUpdateTable.message
      }
    },
    async addColumn () {
      try {
        if (this.selectedColumnType && this.newColumnName) {
          const addColumnResponse = await lckClient.service('column').create({
            // eslint-disable-next-line @typescript-eslint/camelcase
            table_id: this.currentTable.id,
            // eslint-disable-next-line @typescript-eslint/camelcase
            column_type_id: this.selectedColumnType.id,
            text: this.newColumnName
          })
        } else {
          throw new Error('Veuillez renseigner les champs')
        }
      } catch (errorAddColumn) {
        this.errorAddColumn = errorAddColumn.message
      }
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
    Object.keys(COLUMN_TYPE).forEach((key) => {
      this.columnTypes.push({ id: COLUMN_TYPE[key], name: key })
    })
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
