<template>
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
</template>

<script lang="ts">
import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'
import { LckTableView } from '@/services/lck-api/definitions'

export default {
  name: 'DetailViewSettingsFields',
  components: {
    'lck-autocomplete': AutoComplete
  },
  props: {
    id: {
      type: String
    },
    autocompleteSuggestions: {
      type: Array,
      default: () => ([])
    } as Vue.PropOptions<{ label: string; value: string }[]>,
    tableViewDefinition: {
      type: Object as Vue.PropType<LckTableView>
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
}
</script>
