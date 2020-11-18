<template>
  <div>
    <div
      class="
        p-p-1
        p-d-flex
        p-jc-between
        p-flex-wrap
        lck-data-toolbar
      "
    >
      <div class="p-d-flex p-flex-wrap" />
      <div class="p-d-flex p-flex-wrap">
        <p-button
          v-if="addAllowed"
          :label="$t('form.add')"
          icon="pi pi-plus-circle"
          class="p-mr-2"
          @click="onClickAddButton"
        />
        <p-button
          v-if="exportAllowed"
          label="Export"
          class="p-button-secondary"
          :icon="exporting ? 'pi pi-spin pi-spinner' : 'pi pi-download'"
          @click="$emit('export-view')"
        />
      </div>
    </div>

    <lck-datatable
      v-if="definition"
      :definition="definition"
      :crud-mode="false"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <lck-dialog
      :visible.sync="displayNewDialog"
      :header="$t('components.datatable.detail')"
      :submitting="submitting"
      @close="displayNewDialog = false"
      @input="$emit('create-row', newRow)"
    >
      <lck-data-detail
        :crudMode="false"
        :definition="definition"
        :row="newRow"
        :autocompleteSuggestions="$attrs['autocompleteSuggestions']"
        @update-suggestions="$listeners['update-suggestions']"
        @update-row="onUpdateRow"
      />
    </lck-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

import Button from 'primevue/button'

import DataTable from '@/components/store/DataTable/DataTable.vue'
import Dialog from '@/components/ui/Dialog/Dialog.vue'
import DataDetail from '@/components/store/DataDetail/DataDetail.vue'

export default {
  name: 'TableView',
  components: {
    'lck-datatable': DataTable,
    'lck-data-detail': DataDetail,
    'lck-dialog': Vue.extend(Dialog),
    'p-button': Vue.extend(Button)
  },
  props: {
    addAllowed: {
      type: Boolean,
      default: false
    },
    exportAllowed: {
      type: Boolean,
      default: false
    },
    definition: {
      type: Object
    },
    settings: {
      type: Object
    },
    title: {
      type: String,
      default: 'TableView'
    },
    submitting: {
      type: Boolean,
      default: false
    },
    exporting: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      displayNewDialog: false,
      newRow: {}
    }
  },
  methods: {
    onClickAddButton () {
      this.newRow = {
        data: {}
      }
      this.definition.columns.forEach(c => {
        if (
          c.column_type_id === COLUMN_TYPE.SINGLE_SELECT &&
          c.settings?.default
        ) {
          this.$set(this.newRow.data, c.id, c.settings.default)
        }
      })
      this.autocompleteInput = {}
      this.displayNewDialog = true
    },
    async onUpdateRow ({ columnId, newValue }) {
      this.$set(this.newRow.data, columnId, newValue)
    }
  }
}
</script>

<style scoped>
.lck-data-toolbar {
  border-bottom: 1px solid var(--header-border-bottom-color);
}
</style>
