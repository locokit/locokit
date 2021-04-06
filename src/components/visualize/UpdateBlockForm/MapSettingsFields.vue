<template>
  <div>
    <div class="p-field">
      <label for="blockSettingsMap">{{ $t('pages.workspace.block.tableView') }}</label>
      <lck-autocomplete
        id="blockSettingsMap"
        field="text"
        v-model="tableView"
        :dropdown="true"
        :suggestions="autocompleteSuggestions"
        @item-select="onChangeTableView"
        @search="$emit('search-table-view', $event)"
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
import Vue, { PropType } from 'vue'
import Dropdown from 'primevue/dropdown'

import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'

import { LckTableView } from '@/services/lck-api/definitions'

export default Vue.extend({
  name: 'MapSettingsFields',
  components: {
    'p-dropdown': Vue.extend(Dropdown),
    'lck-autocomplete': AutoComplete
  },
  props: {
    id: {
      type: String
    },
    pageDetailId: {
      type: String
    },
    autocompleteSuggestions: {
      type: Array as PropType<{ label: string; value: string }[]>,
      default: () => ([])
    },
    tableViewDefinition: {
      type: Object as PropType<LckTableView>
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
      handler ({ text, id } = { text: '', id: '' }) {
        this.tableView = {
          value: id,
          text
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
})
</script>

<style scoped>
.p-inputswitch {
  display: block;
}
</style>
