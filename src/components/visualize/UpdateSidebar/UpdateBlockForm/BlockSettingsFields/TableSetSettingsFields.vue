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
      <label for="blockSettingsAddAllowed">{{ $t('pages.workspace.block.addAllowed') }}</label>
      <p-input-switch
        :value="addAllowed"
        @input="$emit('update:addAllowed', $event)"
        id="blockSettingsAddAllowed"
      />
    </div>
    <div class="p-field">
      <label for="blockSettingsExportAllowed">{{ $t('pages.workspace.block.exportAllowed') }}</label>
      <p-input-switch
        :value="exportAllowed"
        @input="$emit('update:exportAllowed', $event)"
        id="blockSettingsExportAllowed"
      />
    </div>
    <div class="p-field">
      <label for="blockSettingsDetailPage">{{ $t('pages.workspace.block.detailPage') }}</label>
      <p-dropdown
        id="blockSettingsDetailPage"
        :options="relatedChapterPages"
        optionLabel="text"
        optionValue="id"
        dataKey="id"
        :value="pageDetailId"
        :showClear="true"
        :placeholder="$t('components.datatable.placeholder')"
        @input="$emit('update:pageDetailId', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import InputSwitch from 'primevue/inputswitch'
import Dropdown from 'primevue/dropdown'

import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'

import { LckTableView } from '@/services/lck-api/definitions'

export default {
  name: 'TableSetSettingsFields',
  components: {
    'p-input-switch': Vue.extend(InputSwitch),
    'p-dropdown': Vue.extend(Dropdown),
    'lck-autocomplete': AutoComplete
  },
  props: {
    addAllowed: {
      type: Boolean
    },
    exportAllowed: {
      type: Boolean
    },
    id: {
      type: String
    },
    pageDetailId: {
      type: String
    },
    autocompleteSuggestions: {
      type: Array,
      default: () => ([])
    } as Vue.PropOptions<{ label: string; value: string }[]>,
    tableViewDefinition: {
      type: Object as Vue.PropType<LckTableView | null>
    },
    relatedChapterPages: {
      type: Array,
      default: () => ([])
    }
  },
  data (): {
    tableView: { text: string; value: string };
    } {
    return {
      tableView: {
        text: '',
        value: ''
      }
    }
  },
  watch: {
    tableViewDefinition: {
      handler (view: LckTableView | null) {
        if (view) {
          this.tableView = {
            value: view.id,
            text: view.text
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    onChangeTableView () {
      this.$emit('update:id', this.tableView.value)
      this.$emit('component-refresh-required', true)
    }
  }
}
</script>

<style scoped>
.p-inputswitch {
  display: block;
}
</style>
