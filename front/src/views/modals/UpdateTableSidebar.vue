<template>
  <p-sidebar
    class="p-sidebar-update-table p-fluid"
    position="right"
    :visible="showUpdateTableSidebar"
    :modal="false"
    :dismissable="false"
    @update:visible="$emit('close', $event)"
  >
    <div v-if="currentTableToUpdate">
      <h2 class="lck-color-page-title">{{ $t('pages.databaseSchema.updateTableSidebar.updateTable') }}</h2>
      <lck-form
        :displayCancelButton="false"
        @submit="updateTableName"
      >
        <div class="p-field p-mb-3">
          <label>
            <span>{{ $t('pages.databaseSchema.displayUuid.uuid') }} </span>
            <span>{{ currentTable.id }}</span>
          </label>
        </div>
        <validation-provider
          vid="table-name"
          tag="div"
          class="p-field"
          :name="$t('pages.databaseSchema.updateTableSidebar.tableName')"
          rules="required"
          v-slot="{
            errors,
            classes
          }"
        >
          <label
            for="table-name"
            class="label-field-required"
          >
            {{ $t('pages.databaseSchema.updateTableSidebar.tableName') }}
          </label>
          <p-input-text
            id="table-name"
            type="text"
            v-model="currentTableToUpdate.text"
          />
          <span :class="classes">{{ errors[0] }}</span>
        </validation-provider>
        <validation-provider
          vid="table-doc"
          tag="div"
          class="p-field"
        >
          <label for="table-doc">{{ $t('pages.databaseSchema.updateTableSidebar.tableDoc') }}</label>
          <p-textarea
            id="table-doc"
            type="text"
            v-model="currentTableToUpdate.documentation"
          />
        </validation-provider>
        <validation-provider
          vid="table-slug"
          tag="div"
          class="p-field p-mt-4 p-d-flex p-flex-column"
          rules="required|snakeCase"
          :name="$t('pages.databaseSchema.updateTableSidebar.tableSlug')"
          v-slot="{
            errors,
            classes
          }"
        >
          <label for="table-slug">
            {{ $t('pages.databaseSchema.updateTableSidebar.tableSlug') }}
          </label>
          <p-input-text
            id="table-slug"
            type="text"
            v-model="currentTableToUpdate.slug"
          />
          <small>{{ $t('pages.databaseSchema.updateTableSidebar.tableSlugInfo') }} {{ $t('pages.databaseSchema.updateTableSidebar.editSlug') }}</small>
          <span :class="classes">{{ errors[0] }}</span>
        </validation-provider>

      </lck-form>

      <div class="flex p-my-4">
        <div class="p-ai-start">
          <p-button
            @click="createColumn"
            :label="$t('pages.databaseSchema.updateTableSidebar.createColumn')"
            icon="pi pi-plus"
            class="p-button-text"
          />
        </div>
      </div>
      <p-datatable :value="currentTableToUpdate.columns">
        <p-column
          field="text"
          :header="$t('pages.databaseSchema.updateTableSidebar.columnName')"
        ></p-column>
        <p-column :header="$t('pages.databaseSchema.updateTableSidebar.columnType')">
          <template #body="props">
            {{ getColumnType(props.data.column_type_id) }}
          </template>
        </p-column>
        <p-column>
          <template #body="props">
            <p-button
              icon="bi bi-pencil"
              class="p-button-rounded lck-color-content p-column-button-color p-mr-2"
              @click="updateColumn(props.data)"
            />
            <p-button
              icon="bi bi-trash"
              class="p-button-rounded lck-color-content p-column-button-color"
              @click="$emit('confirm', props.data)"
            />
          </template>
        </p-column>
      </p-datatable>
      <handle-column-modal
        :visible="showHandleColumnModal"
        :databaseId="databaseId"
        :tableId="currentTable.id"
        :tableColumns="currentTable.columns"
        :columnToHandle="columnToHandle"
        @close="onCloseHandleColumnModal"
      />

    </div>
  </p-sidebar>
</template>
<script lang="ts">
import Vue from 'vue'

import { ValidationProvider } from 'vee-validate'

import { COLUMN_TYPE } from '@locokit/lck-glossary'

import { lckServices } from '@/services/lck-api'

import Button from 'primevue/button'
import Sidebar from 'primevue/sidebar'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import LckForm from '@/components/ui/Form/Form.vue'
import { TranslateResult } from 'vue-i18n'
import { LckTable, LckTableColumn } from '@/services/lck-api/definitions'
import { transformColumnsType } from '@/services/lck-utils/temporary'

export default Vue.extend({
  name: 'UpdateTableSidebar',
  components: {
    'lck-form': LckForm,
    'handle-column-modal': () => import(/* webpackChunkName: "lck-sidebar-schema-monaco-editor" */'@/views/modals/HandleColumnModal.vue'),
    'p-button': Vue.extend(Button),
    'p-sidebar': Vue.extend(Sidebar),
    'p-input-text': Vue.extend(InputText),
    'p-textarea': Vue.extend(Textarea),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    databaseId: String,
    currentTable: {
      type: Object,
      default: () => ({}),
    },
    showUpdateTableSidebar: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      showHandleColumnModal: false,
      columnToHandle: null as LckTableColumn|null,
    }
  },
  computed: {
    currentTableToUpdate (): LckTable {
      return JSON.parse(JSON.stringify(this.currentTable))
    },
    columnTypes (): {id: number; name: string|TranslateResult}[] {
      return Object.keys(transformColumnsType()).map((key: string) => {
        return ({
          id: COLUMN_TYPE[key as keyof typeof COLUMN_TYPE],
          name: this.$t(`pages.databaseSchema.columnType.${key}.name`),
        })
      })
    },
  },
  methods: {
    async updateTableName () {
      try {
        await lckServices.table.patch(this.currentTable.id, {
          text: this.currentTableToUpdate.text,
          documentation: this.currentTableToUpdate.documentation,
          slug: this.currentTableToUpdate.slug,
        } as LckTable)
        this.$emit('reload-tables')
      } catch (errorUpdateTable) {
        if (errorUpdateTable instanceof Error) console.error(errorUpdateTable.message)
      }
    },
    createColumn () {
      this.showHandleColumnModal = true
    },
    updateColumn (column: LckTableColumn|null) {
      this.columnToHandle = column
      this.showHandleColumnModal = true
    },
    onCloseHandleColumnModal (shouldReloadTable: boolean) {
      if (shouldReloadTable) {
        this.$emit('reload-tables')
      }
      this.columnToHandle = null
      this.showHandleColumnModal = false
    },
    getColumnType (columnTypeId: number) {
      return this.columnTypes.find((columnType) => columnType.id === columnTypeId)?.name
    },
  },
})
</script>

<style scoped>
.p-sidebar {
  top: 60px;
  height: calc(100% - 60px);
  width: 50vw;
  overflow-y: scroll;
}
.p-column-button-color {
  color: white !important;
}
</style>
