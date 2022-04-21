<template>
  <div>
    <validation-provider
      vid="labelButton"
      tag="div"
      class="p-field"
    >
      <label for="labelButton">{{ $t('pages.workspace.block.actionButton.labelButton') }}</label>
      <p-input-text
        id="labelButton"
        :value="label"
        @input="$emit('update:label', $event)"
      />
    </validation-provider>
    <validation-provider
      vid="classButton"
      tag="div"
      class="p-field"
    >
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
    </validation-provider>
    <validation-provider
      vid="icon"
      tag="div"
      class="p-field"
    >
      <label for="">{{ $t('pages.workspace.block.actionButton.icon') }}</label>
      <p-input-text
        id="icon"
        :value="icon"
        @input="$emit('update:icon', $event)"
      />
    </validation-provider>
    <validation-provider
      vid="action"
      tag="div"
      class="p-field"
      :name="$t('pages.workspace.block.actionButton.trigger.type')"
      rules="required"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="action" class="label-field-required">{{ $t('pages.workspace.block.actionButton.trigger.type') }}</label>
      <p-dropdown
        id="action"
        :value="action"
        @input="$emit('update:action', $event)"
        optionLabel="label"
        optionValue="value"
        dataKey="value"
        :options="ACTIONS_TYPE"
        :placeholder="$t('components.datatable.placeholder')"
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
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>
    <div
      class="p-field"
      v-if="action === ACTION_BUTTON_TYPE.PROCESS_TRIGGER"
    >
      <validation-provider
        vid="processId"
        class="p-field"
        tag="div"
        :name="$t('pages.workspace.block.actionButton.processId')"
        rules="required"
        v-slot="{
          errors,
          classes
        }"
      >
        <label for="processId" class="label-field-required">{{ $t('pages.workspace.block.actionButton.processId') }}</label>
        <p-input-text
          id="processId"
          :value="processId"
          @input="$emit('update:processId', $event)"
        />
        <span :class="classes">{{ errors[0] }}</span>
      </validation-provider>
      <div class="p-field">
        <span class="p-d-flex p-mb-2">{{ $t('pages.workspace.block.actionButton.typePageTo') }}</span>
        <validation-provider
          :vid="ROUTES_NAMES.PAGE"
          tag="div"
          class="p-field-radiobutton"
        >
          <p-radio-button
            :id="ROUTES_NAMES.PAGE"
            :name="ROUTES_NAMES.PAGE"
            :value="ROUTES_NAMES.PAGE"
            :modelValue="typePageTo"
            @input="$emit('update:typePageTo', $event)"
          />
          <label :for="ROUTES_NAMES.PAGE">{{ $t('pages.workspace.block.actionButton.page') }}</label>
        </validation-provider>
        <validation-provider
          :vid="ROUTES_NAMES.PAGEDETAIL"
          tag="div"
          class="p-field-radiobutton"
        >
          <p-radio-button
            :id="ROUTES_NAMES.PAGEDETAIL"
            :name="ROUTES_NAMES.PAGEDETAIL"
            :value="ROUTES_NAMES.PAGEDETAIL"
            :modelValue="typePageTo"
            @input="$emit('update:typePageTo', $event)"
          />
          <label :for="ROUTES_NAMES.PAGEDETAIL">{{ $t('pages.workspace.block.actionButton.pageDetail') }}</label>
        </validation-provider>
      </div>
      <validation-provider
        vid="pageRedirectId"
        tag="div"
        class="p-field"
      >
        <label for="pageRedirectId">{{ $t('pages.workspace.block.actionButton.pageId') }}</label>
        <p-input-text
          id="pageRedirectId"
          :value="pageRedirectId"
          @input="$emit('update:pageRedirectId', $event)"
        />
      </validation-provider>
    </div>
    <div v-else>
      <validation-provider
        vid="pageDetailId"
        tag="div"
        class="p-field"
        :name="$t('pages.workspace.block.actionButton.pageDetailId')"
        rules="required"
        v-slot="{
          errors,
          classes
        }"
      >
        <label for="pageDetailId" class="label-field-required">{{ $t('pages.workspace.block.actionButton.pageDetailId') }}</label>
        <p-input-text
          id="pageDetailId"
          :value="pageDetailId"
          @input="$emit('update:pageDetailId', $event)"
        />
        <span :class="classes">{{ errors[0] }}</span>
      </validation-provider>
      <validation-provider
        vid="pageQueryFieldId"
        tag="div"
        class="p-field"
      >
        <label for="pageQueryFieldId">{{ $t('pages.workspace.block.actionButton.pageQueryFieldId') }}</label>
        <p-input-text
          id="pageQueryFieldId"
          :value="pageQueryFieldId"
          @input="$emit('update:pageQueryFieldId', $event)"
        />
        <small id="pageQueryFieldId-help">{{ $t('pages.workspace.block.actionButton.helpPageQueryFieldId') }}</small>
      </validation-provider>
    </div>
    <validation-provider
      vid="blockSettingsTableView"
      tag="div"
      class="p-field"
    >
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
    </validation-provider>
    <validation-provider
      vid="displayFieldId"
      tag="div"
      class="p-field"
    >
      <label for="displayFieldId">{{ $t('pages.workspace.block.actionButton.displayFieldId') }}</label>
      <p-input-text
        id="displayFieldId"
        :value="displayFieldId"
        @input="$emit('update:displayFieldId', $event)"
      />
    </validation-provider>
    <validation-provider
      vid="displayFieldConditionQuery"
      tag="div"
      class="p-field"
    >
      <label for="displayFieldConditionQuery">{{ $t('pages.workspace.block.actionButton.displayFieldConditionQuery') }}</label>
      <p-input-text
        id="displayFieldConditionQuery"
        :value="displayFieldConditionQuery"
        @input="$emit('update:displayFieldConditionQuery', $event)"
      />
    </validation-provider>
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
        <validation-provider
          vid="notificationSuccessTitle"
          tag="div"
          class="p-field"
        >
          <label for="notificationSuccessTitle">{{ $t('pages.workspace.block.actionButton.notification.success.title') }}</label>
          <p-input-text
            id="notificationSuccessTitle"
            :value="notificationSuccessTitle"
            @input="$emit('update:notificationSuccessTitle', $event)"
          />
        </validation-provider>
        <validation-provider
          vid="notificationSuccessDescription"
          tag="div"
          class="p-field"
        >
          <label for="notificationSuccessDescription">{{
              $t('pages.workspace.block.actionButton.notification.success.description')
            }}</label>
          <p-input-text
            id="notificationSuccessDescription"
            :value="notificationSuccessDescription"
            @input="$emit('update:notificationSuccessDescription', $event)"
          />
        </validation-provider>
        <p class="lck-separator">{{ $t('pages.workspace.block.actionButton.notification.error.info') }}</p>
        <validation-provider
          vid="notificationErrorTitle"
          tag="div"
          class="p-field"
        >
          <label for="notificationErrorTitle">{{ $t('pages.workspace.block.actionButton.notification.error.title') }}</label>
          <p-input-text
            id="notificationErrorTitle"
            :value="notificationErrorTitle"
            @input="$emit('update:notificationErrorTitle', $event)"
          />
        </validation-provider>
        <validation-provider
          vid="notificationErrorDescription"
          tag="div"
          class="p-field"
        >
          <label for="notificationErrorDescription">{{
              $t('pages.workspace.block.actionButton.notification.error.description')
            }}</label>
          <p-input-text
            id="notificationErrorDescription"
            :value="notificationErrorDescription"
            @input="$emit('update:notificationErrorDescription', $event)"
          />
        </validation-provider>
      </div>
    </p-panel>
  </div>
</template>

<script lang="ts">
import Vue, { PropType, PropOptions } from 'vue'

import { ValidationProvider } from 'vee-validate'
import {
  ACTION_BUTTON_TYPE,
} from '@locokit/lck-glossary'

import {
  ACTIONS_TYPE,
  NAMED_CLASSES,
} from '@/services/lck-utils/prime'
import { LckTableView } from '@/services/lck-api/definitions'
import { ROUTES_NAMES } from '@/router/paths'

import InputText from 'primevue/inputtext'
import RadioButton from 'primevue/radiobutton'
import Dropdown from 'primevue/dropdown'
import Panel from 'primevue/panel'

import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'

export default Vue.extend({
  name: 'ActionButtonSettingsFields',
  components: {
    'lck-autocomplete': AutoComplete,
    'p-input-text': Vue.extend(InputText),
    'p-radio-button': Vue.extend(RadioButton),
    'p-panel': Vue.extend(Panel),
    'p-dropdown': Vue.extend(Dropdown),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    label: {
      type: String,
    },
    classButton: {
      type: String,
    },
    icon: {
      type: String,
    },
    action: {
      type: String,
    },
    processId: {
      type: String,
    },
    typePageTo: {
      type: String,
    },
    pageRedirectId: {
      type: String,
    },
    pageDetailId: {
      type: String,
    },
    pageQueryFieldId: {
      type: String,
    },
    displayFieldId: {
      type: String,
    },
    displayFieldConditionQuery: {
      type: String,
    },
    notificationSuccessTitle: {
      type: String,
    },
    notificationSuccessDescription: {
      type: String,
    },
    notificationErrorTitle: {
      type: String,
    },
    notificationErrorDescription: {
      type: String,
    },
    tableViewDefinition: {
      type: Object as PropType<LckTableView | null>,
    },
    autocompleteSuggestions: {
      type: Array,
      default: () => ([]),
    } as PropOptions<{ label: string; value: string }[]>,
  },
  data (): {
    ROUTES_NAMES: typeof ROUTES_NAMES;
    NAMED_CLASSES: typeof NAMED_CLASSES;
    ACTIONS_TYPE: typeof ACTIONS_TYPE;
    ACTION_BUTTON_TYPE: typeof ACTION_BUTTON_TYPE;
    tableView: { text: string; value: string } | null;
    } {
    return {
      ROUTES_NAMES,
      NAMED_CLASSES,
      ACTIONS_TYPE,
      ACTION_BUTTON_TYPE,
      tableView: null,
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
