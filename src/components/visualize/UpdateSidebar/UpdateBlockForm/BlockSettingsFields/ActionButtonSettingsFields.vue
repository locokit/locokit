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
      <label for="pageRedirectId">{{ $t('pages.workspace.block.pageId') }}</label>
      <p-input-text
        id="pageRedirectId"
        :value="pageRedirectId"
        @input="$emit('update:pageRedirectId', $event)"
      />
    </div>
   <div v-else>
     <div class="p-field">
       <label for="pageDetailId">{{ $t('pages.workspace.block.pageDetailId') }}</label>
       <p-input-text
         id="pageDetailId"
         :value="pageDetailId"
         @input="$emit('update:pageDetailId', $event)"
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
     Disabled
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
     Disabled
     <label for="displayFieldId">{{ $t('pages.workspace.block.options.displayFieldId') }}</label>
     <p-input-text
       id="displayFieldId"
       :value="displayFieldId"
       @input="$emit('update:displayFieldId', $event)"
     />
   </div>
   <div class="p-field">
     Disabled
     <label for="displayFieldConditionQuery">{{ $t('pages.workspace.block.options.displayFieldConditionQuery') }}</label>
     <p-input-text
       id="displayFieldConditionQuery"
       :value="displayFieldConditionQuery"
       @input="$emit('update:displayFieldConditionQuery', $event)"
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
import { LckTableView } from '@/services/lck-api/definitions'
import { ROUTES_NAMES } from '@/router/paths'

import InputText from 'primevue/inputtext'
import RadioButton from 'primevue/radiobutton'
import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'
import Dropdown from 'primevue/dropdown'

type Options = {
  displayFieldId: string|null;
  displayFieldConditionQuery: boolean|null;
}

export default {
  name: 'ActionButtonSettingsFields',
  components: {
    'lck-autocomplete': AutoComplete,
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
    pageDetailId: {
      type: String
    },
    pageQueryFieldId: {
      type: String
    },
    displayFieldId: {
      type: String
    },
    displayFieldConditionQuery: {
      type: String
    },
    options: {
      type: Object as PropType<Options>
    },
    tableViewDefinition: {
      type: Object as Vue.PropType<LckTableView>
    },
    autocompleteSuggestions: {
      type: Array,
      default: () => ([])
    } as Vue.PropOptions<{ label: string; value: string }[]>
  },
  data () {
    return {
      ROUTES_NAMES,
      NAMED_CLASSES,
      ACTIONS_TYPE,
      ACTION_BUTTON_TYPE,
      tableView: { text: '', value: '' }
    }
  },
  methods: {
    onChangeTableView () {
      this.$emit('update:id', this.tableView.value)
      this.$emit('component-refresh-required', true)
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
  }
}
</script>

<style lang="scss" scoped>
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
