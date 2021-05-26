<template>
 <div>
    <div class="p-field">
      <label for="labelButton">{{ $t('pages.workspace.block.labelButton') }}</label>
      <p-input-text
        id="labelButton"
        :value="label"
        @input="$emit('update:label', $event)"
      />
    </div>
    <div class="p-field">
      <label for="classButton">{{ $t('pages.workspace.block.classButton.title') }}</label>
      <p-dropdown
        id="classButton"
        :value="classButton"
        @input="$emit('update:classButton', $event)"
        optionLabel="label"
        optionValue="value"
        dataKey="value"
        :options="NAMED_CLASSES"
        :placeholder="$t('components.datatable.placeholder')"
        required
      >
        <template #value="slotProps">
          <div v-if="slotProps.value">
            {{ $t(`pages.workspace.block.classButton.${slotProps.value}`) }}
          </div>
          <span v-else>
            {{slotProps.placeholder}}
          </span>
        </template>
        <template #option="slotProps">
          {{ $t(`pages.workspace.block.classButton.${slotProps.option.value}`) }}
        </template>
      </p-dropdown>
    </div>
    <div class="p-field">
      <label for="icon">{{ $t('pages.workspace.block.icon') }}</label>
      <p-input-text
        id="icon"
        :value="icon"
        @input="$emit('update:icon', $event)"
      />
    </div>
    <div class="p-field">
      <label for="action">{{ $t('pages.workspace.block.action.title') }}</label>
      <p-dropdown
        id="action"
        :value="action"
        @input="$emit('update:action', $event)"
        optionLabel="label"
        optionValue="value"
        dataKey="value"
        :options="ACTIONS_TYPE"
        :placeholder="$t('components.datatable.placeholder')"
        required
      >
        <template #value="slotProps">
          <div v-if="slotProps.value">
            {{ $t(`pages.workspace.block.action.${slotProps.value}`) }}
          </div>
          <span v-else>
            {{slotProps.placeholder}}
          </span>
        </template>
        <template #option="slotProps">
          {{ $t(`pages.workspace.block.action.${slotProps.option.value}`) }}
        </template>
      </p-dropdown>
    </div>
    <div class="p-field" v-if="action === ACTION_BUTTON_TYPE.PROCESS_TRIGGER">
      <label for="processId">{{ $t('pages.workspace.block.processId') }}</label>
      <p-input-text
        id="processId"
        :value="processId"
        @input="$emit('update:processId', $event)"
        required
      />
    </div>
   <div class="p-field" v-else>
     <label for="pageDetailId">{{ $t('pages.workspace.block.pageDetailId') }}</label>
     <p-input-text
       id="pageDetailId"
       :value="pageDetailId"
       @input="$emit('update:pageDetailId', $event)"
       required
     />
   </div>
   <div class="p-field">
     <label for="displayFieldID">{{ $t('pages.workspace.block.options.displayFieldID') }}</label>
     <p-input-text
       id="displayFieldID"
       :value="optionsCopy.displayFieldID"
       @input="setOptions('displayFieldID', $event)"
     />
   </div>
   <div class="p-field">
     <label for="displayFieldConditionQuery">{{ $t('pages.workspace.block.options.displayFieldConditionQuery') }}</label>
     <p-input-text
       id="displayFieldConditionQuery"
       :value="optionsCopy.displayFieldConditionQuery"
       @input="setOptions('displayFieldConditionQuery', $event)"
     />
   </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import {
  ACTION_BUTTON_TYPE
} from '@locokit/lck-glossary'

import InputText from 'primevue/inputtext'

import Dropdown from 'primevue/dropdown'
import { LckBlockExtended } from '@/services/lck-api/definitions'

// import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'
type Options = {
  displayFieldID: string|null;
  displayFieldConditionQuery: boolean|null;
}

const NAMED_CLASSES = [
  { label: 'danger', value: 'danger' },
  { label: 'warning', value: 'warning' },
  { label: 'success', value: 'success' },
  { label: 'primary', value: 'primary' },
  { label: 'secondary', value: 'secondary' }
]

const ACTIONS_TYPE = [
  { label: 'page_detail_to', value: 'page_detail_to' },
  { label: 'process_trigger', value: 'process_trigger' }
]

export default {
  name: 'ActionButtonSettingsFields',
  components: {
    'p-input-text': Vue.extend(InputText),
    'p-dropdown': Vue.extend(Dropdown)
  },
  props: {
    label: {
      type: String
    },
    classButton: {
      type: String
    },
    icon: {
      type: String
    },
    action: {
      type: String
    },
    processId: {
      type: String
    },
    pageDetailId: {
      type: String
    },
    options: {
      type: Object as PropType<Options>
    }
  },
  data () {
    return {
      NAMED_CLASSES,
      ACTIONS_TYPE,
      ACTION_BUTTON_TYPE,
      optionsCopy: { displayFieldID: null, displayFieldConditionQuery: null }
    }
  },
  methods: {
    setOptions (field, event) {
      this.$emit('update:options', { ...this.optionsCopy, [field]: event })
    }
  },
  watch: {
    options: {
      handler (newValue: Options|undefined) {
        if (newValue) this.optionsCopy = newValue
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.p-field textarea {
  resize: vertical;
}
</style>
