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
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'

import { LckTableView } from '@/services/lck-api/definitions'

export default Vue.extend({
  name: 'MapSettingsFields',
  components: {
    'lck-autocomplete': AutoComplete
  },
  props: {
    id: {
      type: String
    },
    autocompleteSuggestions: {
      type: Array as PropType<{ label: string; value: string }[]>,
      default: () => ([])
    },
    tableViewDefinition: {
      type: Object as PropType<LckTableView>
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
