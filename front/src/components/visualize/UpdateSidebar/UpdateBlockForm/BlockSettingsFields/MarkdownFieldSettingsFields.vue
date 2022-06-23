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
      vid="displayFieldId"
      tag="div"
      class="p-field"
      :name="$t('pages.workspace.block.markdownField.displayField')"
      rules="required"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="displayFieldId" class="label-field-required">{{ $t('pages.workspace.block.markdownField.displayField') }}</label>
      <p-input-text
        id="displayFieldId"
        :value="displayFieldId"
        @input="$emit('update:displayFieldId', $event)"
      />
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>
    <validation-provider
      vid="textColor"
      tag="div"
      class="p-field"
    >
      <label for="textColor">{{ $t('pages.workspace.block.markdownField.textColor') }}</label>
      <p-dropdown
        id="textColor"
        :value="textColor"
        @input="$emit('update:textColor', $event)"
        optionLabel="label"
        optionValue="value"
        dataKey="value"
        :options="EXTENDED_NAMED_CLASSES"
        :placeholder="$t('components.datatable.placeholder')"
        :showClear="true"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value">
            {{ $t(`common.colorClass.${slotProps.value}`) }}
          </div>
          <span v-else>
              {{slotProps.placeholder}}
            </span>
        </template>
        <template #option="slotProps">
          {{ $t(`common.colorClass.${slotProps.option.value}`) }}
        </template>
      </p-dropdown>
    </validation-provider>
    <validation-provider
      vid="textAlign"
      tag="div"
      class="p-field"
    >
      <label for="textAlign">{{ $t('pages.workspace.block.markdownField.textAlign') }}</label>
      <p-dropdown
        id="textAlign"
        :value="textAlign"
        @input="$emit('update:textAlign', $event)"
        optionLabel="label"
        optionValue="value"
        dataKey="value"
        :options="TEXT_ALIGN_CLASS"
        :placeholder="$t('components.datatable.placeholder')"
        :showClear="true"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value">
            {{ $t(`common.alignClass.${slotProps.value}`) }}
          </div>
          <span v-else>
              {{slotProps.placeholder}}
            </span>
        </template>
        <template #option="slotProps">
          {{ $t(`common.alignClass.${slotProps.option.value}`) }}
        </template>
      </p-dropdown>
    </validation-provider>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { ValidationProvider } from 'vee-validate'

import {
  EXTENDED_NAMED_CLASSES,
  TEXT_ALIGN_CLASS,
} from '@/services/lck-utils/prime'
import { LckTableView } from '@/services/lck-api/definitions'

import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'

import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'

export default Vue.extend({
  name: 'MarkdownFieldSettingsFields',
  components: {
    'lck-autocomplete': AutoComplete,
    'p-input-text': Vue.extend(InputText),
    'p-dropdown': Vue.extend(Dropdown),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    id: {
      type: String,
    },
    displayFieldId: {
      type: String,
    },
    textColor: {
      type: String,
    },
    textAlign: {
      type: String,
    },
    tableViewDefinition: {
      type: Object as Vue.PropType<LckTableView | null>,
    },
    autocompleteSuggestions: {
      type: Array,
      default: () => ([]),
    } as Vue.PropOptions<{ label: string; value: string }[]>,
  },
  data () {
    return {
      EXTENDED_NAMED_CLASSES,
      TEXT_ALIGN_CLASS,
      tableView: null as { value: string; text: string } | null,
    }
  },
  methods: {
    onChangeTableView () {
      this.$emit('update:id', this.tableView?.value)
      this.$emit('component-refresh-required', true)
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
})
</script>

<style scoped>
.p-field textarea {
  resize: vertical;
}

form label {
  font-weight: 700;
}
</style>
