<template>
 <div>
    <div class="p-field">
      <label for="labelButton">{{ $t('pages.workspace.block.actionButton.labelButton') }}</label>
      <p-input-text
        id="labelButton"
        :value="label"
        @input="$emit('update:label', $event)"
      />
    </div>
    <div class="p-field">
      <label for="classButton">{{ $t('pages.workspace.block.actionButton.classButton.title') }}</label>
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
            {{ $t(`pages.workspace.block.actionButton.classButton.${slotProps.value}`) }}
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #option="slotProps">
          {{ $t(`pages.workspace.block.actionButton.classButton.${slotProps.option.value}`) }}
        </template>
      </p-dropdown>
    </div>
    <div class="p-field">
      <label for="icon">{{ $t('pages.workspace.block.actionButton.icon') }}</label>
      <p-input-text
        id="icon"
        :value="icon"
        @input="$emit('update:icon', $event)"
      />
    </div>
    <div class="p-field">
      <label for="action">{{ $t('pages.workspace.block.actionButton.trigger.type') }}</label>
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
            {{ $t(`pages.workspace.block.actionButton.trigger.${slotProps.value}`) }}
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #option="slotProps">
          {{ $t(`pages.workspace.block.actionButton.trigger.${slotProps.option.value}`) }}
        </template>
      </p-dropdown>
    </div>
    <div
      class="p-field action-trigger"
      v-if="action === ACTION_BUTTON_TYPE.PROCESS_TRIGGER"
    >
      <label for="processId">{{ $t('pages.workspace.block.actionButton.processId') }}</label>
      <p-input-text
        id="processId"
        :value="processId"
        @input="$emit('update:processId', $event)"
        required
      />
      <span>{{ $t('pages.workspace.block.actionButton.typePageTo') }}</span>
      <div>
        <div class="p-field-radiobutton">
          <p-radio-button
            :id="ROUTES_NAMES.PAGE"
            :name="ROUTES_NAMES.PAGE"
            :value="ROUTES_NAMES.PAGE"
            :modelValue="typePageTo"
            @input="$emit('update:typePageTo', $event)"
          />
          <label :for="ROUTES_NAMES.PAGE">{{ $t('pages.workspace.block.actionButton.page')  }}</label>
        </div>
        <div class="p-field-radiobutton">
          <p-radio-button
            :id="ROUTES_NAMES.PAGEDETAIL"
            :name="ROUTES_NAMES.PAGEDETAIL"
            :value="ROUTES_NAMES.PAGEDETAIL"
            :modelValue="typePageTo"
            @input="$emit('update:typePageTo', $event)"
          />
          <label :for="ROUTES_NAMES.PAGEDETAIL">{{ $t('pages.workspace.block.actionButton.pageDetail')  }}</label>
        </div>
      </div>
      <label for="pageRedirectId">{{ $t('pages.workspace.block.actionButton.pageId') }}</label>
      <p-input-text
        id="pageRedirectId"
        :value="pageRedirectId"
        @input="$emit('update:pageRedirectId', $event)"
      />
    </div>
   <div v-else>
     <div class="p-field">
       <label for="pageDetailId">{{ $t('pages.workspace.block.actionButton.pageDetailId') }}</label>
       <p-input-text
         id="pageDetailId"
         :value="pageDetailId"
         @input="$emit('update:pageDetailId', $event)"
         required
       />
     </div>
     <div class="p-field">
       <label for="pageQueryFieldId">{{ $t('pages.workspace.block.actionButton.pageQueryFieldId') }}</label>
       <p-input-text
         id="pageQueryFieldId"
         :value="pageQueryFieldId"
         @input="$emit('update:pageQueryFieldId', $event)"
       />
       <small id="pageQueryFieldId-help">{{ $t('pages.workspace.block.actionButton.helpPageQueryFieldId') }}</small>
     </div>
   </div>
   <div class="p-field">
     <label for="blockSettingsTableView">{{ $t('pages.workspace.block.actionButton.tableView') }}</label>
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
     <label for="displayFieldId">{{ $t('pages.workspace.block.actionButton.displayFieldId') }}</label>
     <p-input-text
       id="displayFieldId"
       :value="displayFieldId"
       @input="$emit('update:displayFieldId', $event)"
     />
   </div>
   <div class="p-field">
     <label for="displayFieldConditionQuery">{{ $t('pages.workspace.block.actionButton.displayFieldConditionQuery') }}</label>
     <p-input-text
       id="displayFieldConditionQuery"
       :value="displayFieldConditionQuery"
       @input="$emit('update:displayFieldConditionQuery', $event)"
     />
   </div>
   <p-panel
     v-if="action === ACTION_BUTTON_TYPE.PROCESS_TRIGGER"
     :header="$t('pages.workspace.block.actionButton.notification.settings')"
     :toggleable="true"
     :collapsed="true"
     class="p-mb-4"
   >
     <p>{{ $t('pages.workspace.block.actionButton.notification.explain') }}</p>
     <div
      class="lck-color-content p-text-bold"
     >
       <p class="lck-separator">{{ $t('pages.workspace.block.actionButton.notification.success.info') }}</p>
       <div class="p-field">
         <label for="notificationSuccessTitle">{{ $t('pages.workspace.block.actionButton.notification.success.title') }}</label>
         <p-input-text
           id="notificationSuccessTitle"
           :value="notificationSuccessTitle"
           @input="$emit('update:notificationSuccessTitle', $event)"
         />
       </div>
       <div class="p-field">
         <label for="notificationSuccessDescription">{{ $t('pages.workspace.block.actionButton.notification.success.description') }}</label>
         <p-input-text
           id="notificationSuccessDescription"
           :value="notificationSuccessDescription"
           @input="$emit('update:notificationSuccessDescription', $event)"
         />
       </div>
       <p class="lck-separator">{{ $t('pages.workspace.block.actionButton.notification.error.info') }}</p>
       <div class="p-field">
         <label for="notificationErrorTitle">{{ $t('pages.workspace.block.actionButton.notification.error.title') }}</label>
         <p-input-text
           id="notificationErrorTitle"
           :value="notificationErrorTitle"
           @input="$emit('update:notificationErrorTitle', $event)"
         />
       </div>
       <div class="p-field ">
         <label for="notificationErrorDescription">{{ $t('pages.workspace.block.actionButton.notification.error.description') }}</label>
         <p-input-text
           id="notificationErrorDescription"
           :value="notificationErrorDescription"
           @input="$emit('update:notificationErrorDescription', $event)"
         />
       </div>
     </div>
   </p-panel>
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
import Dropdown from 'primevue/dropdown'
import Panel from 'primevue/panel'

import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'

export default {
  name: 'ActionButtonSettingsFields',
  components: {
    'lck-autocomplete': AutoComplete,
    'p-input-text': Vue.extend(InputText),
    'p-radio-button': Vue.extend(RadioButton),
    'p-panel': Vue.extend(Panel),
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
    notificationSuccessTitle: {
      type: String
    },
    notificationSuccessDescription: {
      type: String
    },
    notificationErrorTitle: {
      type: String
    },
    notificationErrorDescription: {
      type: String
    },
    tableViewDefinition: {
      type: Object as Vue.PropType<LckTableView | null>
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
      handler (view: LckTableView | null) {
        if (view) {
          this.tableView = {
            value: view.id,
            text: view.text
          }
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

.lck-separator {
  margin-top: 1rem;

  &:after {
    display: block;
    width: 30px;
    height: 4px;
    content: "";
    background-color: var(--primary-color);
  }
}
</style>
