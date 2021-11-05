<template>
  <validation-provider
    vid="label"
    tag="div"
    class="p-field"
    :name="$t('components.process.form.text.label')"
    rules="required"
    v-slot="{
        errors,
        classes
      }"
  >
    <label for="blockSettingsTableView" class="label-field-required">{{ $t('pages.workspace.block.tableView') }}</label>
    <lck-autocomplete
      id="blockSettingsTableView"
      field="text"
      v-model="tableView"
      :dropdown="true"
      :suggestions="autocompleteSuggestions"
      @item-select="onChangeTableView"
      @search="$emit('search-table-view', $event)"
    />
    <span :class="classes">{{ errors[0] }}</span>
  </validation-provider>
</template>

<script lang="ts">
import Vue from 'vue'

import { ValidationProvider } from 'vee-validate'

import { LckTableView } from '@/services/lck-api/definitions'

import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'

export default {
  name: 'DataRecordSettingsFields',
  components: {
    'lck-autocomplete': AutoComplete,
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    id: {
      type: String,
    },
    autocompleteSuggestions: {
      type: Array,
      default: () => ([]),
    } as Vue.PropOptions<{ label: string; value: string }[]>,
    tableViewDefinition: {
      type: Object as Vue.PropType<LckTableView | null>,
    },
  },
  data (): {
    tableView: { text: string; value: string } | null;
    } {
    return {
      tableView: null,
    }
  },
  watch: {
    tableViewDefinition: {
      handler (view: LckTableView | null) {
        if (view) {
          this.tableView = {
            value: view.id,
            text: view.text,
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    onChangeTableView () {
      this.$emit('update:id', this.tableView.value)
      this.$emit('component-refresh-required', true)
    },
  },
}
</script>
