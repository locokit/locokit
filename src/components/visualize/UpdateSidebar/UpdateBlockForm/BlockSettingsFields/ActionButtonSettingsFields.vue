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
    <div
      class="p-field action-trigger"
      v-if="action === ACTION_BUTTON_TYPE.PROCESS_TRIGGER"
    >
      <label for="processId">{{ $t('pages.workspace.block.processId') }}</label>
      <p-input-text
        id="processId"
        :value="processId"
        @input="$emit('update:processId', $event)"
        required
      />
      <span>{{ $t('pages.workspace.block.typePageTo') }}</span>
      <div>
        <div class="p-field-radiobutton">
          <p-radio-button
            :id="ROUTES_NAMES.PAGE"
            :name="ROUTES_NAMES.PAGE"
            :value="ROUTES_NAMES.PAGE"
            :modelValue="typePageTo"
            @input="$emit('update:typePageTo', $event)"
          />
          <label :for="ROUTES_NAMES.PAGE">{{ $t('pages.workspace.block.page')  }}</label>
        </div>
        <div class="p-field-radiobutton">
          <p-radio-button
            :id="ROUTES_NAMES.PAGEDETAIL"
            :name="ROUTES_NAMES.PAGEDETAIL"
            :value="ROUTES_NAMES.PAGEDETAIL"
            :modelValue="typePageTo"
            @input="$emit('update:typePageTo', $event)"
          />
          <label :for="ROUTES_NAMES.PAGEDETAIL">{{ $t('pages.workspace.block.pageDetail')  }}</label>
        </div>
      </div>
      <label for="pageRedirectIdProcess">{{ $t('pages.workspace.block.pageId') }}</label>
      <p-input-text
        id="pageRedirectIdProcess"
        :value="pageRedirectId"
        @input="$emit('update:pageRedirectId', $event)"
        required
      />
    </div>
   <div v-else>
     <div class="p-field">
       <label for="pageRedirectIdTo">{{ $t('pages.workspace.block.pageDetailId') }}</label>
       <p-input-text
         id="pageRedirectIdTo"
         :value="pageRedirectId"
         @input="$emit('update:pageRedirectId', $event)"
         required
       />
     </div>
     <div class="p-field">
       <label for="pageQueryFieldId">{{ $t('pages.workspace.block.pageQueryFieldId') }}</label>
       <p-input-text
         id="pageQueryFieldId"
         :value="pageQueryFieldId"
         @input="$emit('update:pageQueryFieldId', $event)"
       />
       <small id="pageQueryFieldId-help">{{ $t('pages.workspace.block.helpPageQueryFieldId') }}</small>
     </div>
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
import { ROUTES_NAMES } from '@/router/paths'

import InputText from 'primevue/inputtext'
import RadioButton from 'primevue/radiobutton'

import Dropdown from 'primevue/dropdown'

type Options = {
  displayFieldId: string|null;
  displayFieldConditionQuery: boolean|null;
}

export default {
  name: 'ActionButtonSettingsFields',
  components: {
    'p-input-text': Vue.extend(InputText),
    'p-radio-button': Vue.extend(RadioButton),
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
    typePageTo: {
      type: String
    },
    pageRedirectId: {
      type: String
    },
    pageQueryFieldId: {
      type: String
    },
    options: {
      type: Object as PropType<Options>
    }
  },
  data () {
    return {
      ROUTES_NAMES,
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

<style lang="scss" scoped>
.p-field textarea {
  resize: vertical;
}

.action-trigger {
  > div {
    display: flex;
    flex-direction: row;
    > div {
      padding-right: 1rem;
    }
  }
  > span {
    display: block;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
}
</style>
