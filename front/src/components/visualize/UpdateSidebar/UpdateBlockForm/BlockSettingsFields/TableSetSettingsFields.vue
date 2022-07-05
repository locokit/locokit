<template>
  <div>
    <validation-provider
      vid="blockSettingsTableView"
      tag="div"
      class="p-field"
      :name="$t('pages.workspace.block.tableView')"
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
    <validation-provider
      vid="blockSettingsPagination"
      tag="div"
      class="p-field"
    >
      <label for="blockSettingsPagination">{{ $t('pages.workspace.block.pagination') }}</label>
      <p-dropdown
        id="blockSettingsPagination"
        :options="availablePaginationValues"
        optionLabel="label"
        optionValue="value"
        :value="pagination"
        :showClear="true"
        :placeholder="$t('components.datatable.placeholder')"
        @input="onChangePagination"
      />
    </validation-provider>
    <validation-provider
      vid="blockSettingsAddAllowed"
      tag="div"
      class="p-field"
    >
      <label for="blockSettingsAddAllowed">{{ $t('pages.workspace.block.addAllowed') }}</label>
      <p-input-switch
        :value="addAllowed"
        @input="$emit('update:addAllowed', $event)"
        id="blockSettingsAddAllowed"
      />
    </validation-provider>
    <validation-provider
      vid="blockSettingsExportAllowed"
      tag="div"
      class="p-field"
    >
      <label for="blockSettingsExportAllowed">{{ $t('pages.workspace.block.exportAllowed') }}</label>
      <p-input-switch
        :value="exportAllowed"
        @input="$emit('update:exportAllowed', $event)"
        id="blockSettingsExportAllowed"
      />
    </validation-provider>
    <validation-provider
      vid="blockSettingsDetailPage"
      tag="div"
      class="p-field"
    >
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
    </validation-provider>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { ValidationProvider } from 'vee-validate'

import { LckTableView } from '@/services/lck-api/definitions'

import InputSwitch from 'primevue/inputswitch'
import Dropdown from 'primevue/dropdown'

import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'

export default Vue.extend({
  name: 'TableSetSettingsFields',
  components: {
    'lck-autocomplete': AutoComplete,
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-switch': Vue.extend(InputSwitch),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    addAllowed: {
      type: Boolean,
    },
    exportAllowed: {
      type: Boolean,
    },
    id: {
      type: String,
    },
    pageDetailId: {
      type: String,
    },
    pagination: {
      type: Number,
    },
    autocompleteSuggestions: {
      type: Array,
      default: () => ([]),
    } as Vue.PropOptions<{ label: string; value: string }[]>,
    tableViewDefinition: {
      type: Object as Vue.PropType<LckTableView | null>,
    },
    relatedChapterPages: {
      type: Array,
      default: () => ([]),
    },
  },
  data (): {
    tableView: { text: string; value: string } | null;
    } {
    return {
      tableView: null,
    }
  },
  computed: {
    availablePaginationValues (): { value: number; label: string }[] {
      return [20, 50, 100, -1].map(value => ({
        value: value,
        label: (value !== -1 ? value : Infinity).toLocaleString(),
      }))
    },
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
      this.$emit('update:id', this.tableView?.value)
      this.$emit('component-refresh-required', true)
    },
    onChangePagination (pagination: number) {
      this.$emit('update:pagination', pagination)
      this.$emit('component-refresh-required', true)
    },
  },
})
</script>

<style scoped>
::v-deep.p-inputswitch {
  display: block;
}

form label {
  font-weight: 700;
}
</style>
