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
     <label for="displayFieldId">{{ $t('pages.workspace.block.options.displayFieldId') }}</label>
     <p-input-text
       id="displayFieldId"
       :value="optionsCopy.displayFieldId"
       @input="setOptions('displayFieldId', $event)"
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

import {
  ACTIONS_TYPE,
  NAMED_CLASSES
} from '@/services/lck-utils/prime'

import InputText from 'primevue/inputtext'

import Dropdown from 'primevue/dropdown'

type Options = {
  displayFieldId: string|null;
  displayFieldConditionQuery: boolean|null;
}

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
      optionsCopy: { displayFieldId: null, displayFieldConditionQuery: null }
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
