<template>
  <div>
    <div class="p-field">
      <label for="blockSettingsTableView">{{ $t('pages.workspace.block.tableView') }}</label>
      <lck-autocomplete
        id="blockSettingsTableView"
        field="text"
        v-model="tableView"
        :dropdown="true"
        :suggestions="autocompleteSuggestions"
        @item-select="onChangeTableView"
        @search="$emit('search-table-view', $event)"
      />
    </div>
    <div class="p-field">
      <label for="blockSettingsColumn">{{ $t('pages.workspace.block.column') }}</label>
      <lck-autocomplete
        id="blockSettingsColumn"
        field="text"
        v-model="column"
        :dropdown="true"
        :suggestions="autocompleteSuggestions"
        @item-select="onChangeColumn"
        @search="$emit('search-column', { query: $event.query, tableViewId: tableView.id })"
      />
    </div>
    <div
        v-for="(value, index) in columnValues"
        :key="`value-${index}`"
        class="valueConfiguration"
      >
        <div class="p-field">
          <label :for="`blockSettingsValueId${index}`">{{ $t('pages.workspace.block.valueId') }}</label>
          <p-input-text
            :id="`blockSettingsValueId${index}`"
            :value="value.valueId"
            @input="$emit('update-value-id', { value, valueId: $event })"
          />
        </div>
        <p-button
          icon="pi pi-trash"
          class="p-button-text p-button-lg deleteValueButton"
          @click="$emit('delete-value', index)"
        />
      </div>
      <div class="addValueDiv">
        <p-button
          icon="pi pi-plus"
          class="p-button-text addValueButton p-button-lg"
          @click="$emit('add-value')"
        />
      </div>
  </div>
</template>

<script>

/**
   * Id of the table_view in database
  id: string;
  /**
   * View's column id on which the kanban's columns is displayed
  columnId: string;
  /**
   * View's column values to use for creating kanban's columns
  columnValues: {
    valueId: string;
    position: number;
  }[];
*/

import Vue from 'vue'
import InputText from 'primevue/inputtext'

import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'

export default {
  name: 'KanbanSettingsFields',
  components: {
    'p-input-text': InputText,
    'lck-autocomplete': AutoComplete
  },
  props: {
    id: {
      type: String,
      required: false
    },
    columnId: {
      type: String,
      required: false
    },
    autocompleteSuggestions: {
      type: Array,
      default: () => ([])
    },
    tableViewDefinition: {
      type: Object,
      required: false
    },
    columnValues: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      tableView: {
        text: this.tableViewDefinition ? this.tableViewDefinition.relatedTableView.text : '',
        value: this.tableViewDefinition ? this.tableViewDefinition.relatedTableView.id : ''
      },
      column: {
        text: this.tableViewDefinition ? this.tableViewDefinition.relatedColumn.text : '',
        value: this.tableViewDefinition ? this.tableViewDefinition.relatedColumn.id : ''
      }
    }
  },
  methods: {
    onChangeTableView () {
      this.$emit('update:id', this.tableView.value)
      this.$emit('update:columnId', {})
      // this.$emit('component-refresh-required', true)
    },
    onChangeColumn () {
      this.$emit('update:columnId', this.column.value)
      // this.$emit('component-refresh-required', true)
    }
  }
}
</script>

<style scoped>
.valueConfiguration {
  position: relative;
  box-shadow: 1px 1px 5px 1px rgb(200, 200, 200);
  padding: 1em;
  margin-bottom: 1em;
}

.deleteValueButton {
  position: absolute;
  top: 0em;
  right: 0em;
}

.addValueDiv {
  box-shadow: 1px 1px 5px 1px rgb(200, 200, 200);
  margin-bottom: 1em;
}

.addValueButton.p-button {
  width: 100%;
  height: 100%;
}
</style>
