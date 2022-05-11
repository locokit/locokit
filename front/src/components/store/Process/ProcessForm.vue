<template>
  <lck-form
    @cancel="$emit('cancel')"
    @delete="$emit('delete')"
    @submit="$emit('input', processCloned)"
    :submitting="submitting"
    :display-delete-button="!!processCloned.id"
  >
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
      <label for="label" class="label-field-required">
        {{ $t('components.process.form.text.label') }}
      </label>
      <p-input-text
        id="label"
        type="text"
        v-focus
        v-model="processCloned.text"
        :placeholder="$t('components.process.form.text.placeholder')"
      />
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>
    <validation-provider
      vid="url"
      tag="div"
      class="p-field"
      :name="$t('components.process.form.url')"
      rules="required"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="url" class="label-field-required">
        {{ $t('components.process.form.url') }}
      </label>
      <p-input-text
        id="url"
        type="text"
        v-model="processCloned.url"
        :placeholder="$t('components.process.form.url')"
      />
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>
    <validation-provider
      vid="enabled"
      tag="div"
      class="p-field"
    >
      <label for="enabled">
        {{ $t('components.process.form.enabled') }}
      </label>
      <br/>
      <p-input-switch
        id="enabled"
        v-model="processCloned.enabled"
      />
    </validation-provider>
    <validation-provider
      vid="trigger"
      tag="div"
      :name="$t('components.process.form.trigger')"
      class="p-field"
      rules="required"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="trigger" class="label-field-required">
        {{ $t('components.process.form.trigger') }}
      </label>
      <p-dropdown
        id="trigger"
        :dropdown="true"
        v-model="processCloned.trigger"
        optionLabel="label"
        optionValue="value"
        appendTo="body"
        :options="triggerOptions"
      />
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>
    <validation-provider
      vid="table"
      tag="div"
      :name="$t('components.process.form.table.label')"
      class="p-field"
      :rules="{
        required: processCloned.trigger !== 'MANUAL'
      }"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="table" :class="{
        'label-field-required': processCloned.trigger !== 'MANUAL'
      }">
        {{ $t('components.process.form.table.label') }}
      </label>
      <lck-autocomplete
        id="table"
        :dropdown="true"
        :placeholder="$t('components.process.form.table.placeholder')"
        field="text"
        :suggestions="tables"
        @search="$emit('search-table', $event)"
        v-model="processCloned.table"
        @item-select="processCloned.table_id = processCloned.table.value"
        @clear="processCloned.table_id = null"
      />
      <small
        class="p-text-italic"
        id="password-rules"
      >
        {{ $t('components.process.form.table.helper') }}
      </small>
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>

    <validation-provider
      v-if="triggerWithSettings"
      vid="column_id"
      tag="div"
      class="p-field"
    >
      <label for="column_id">
        {{ $t('components.process.form.column.label') }}
        <span v-if="!processCloned.table_id" class="p-text-warning">
          {{ $t('components.process.chooseTableFirst') }}
        </span>
      </label>
      <lck-autocomplete
        id="column_id"
        :disabled="!processCloned.table_id"
        :dropdown="true"
        :placeholder="$t('components.process.form.column.placeholder')"
        field="text"
        :suggestions="columns"
        @search="$emit('search-column', { query: $event.query, tableId: processCloned.table_id })"
        v-model="processCloned.settings.column"
        @item-select="processCloned.settings.column_id = processCloned.settings.column.value"
        @clear="processCloned.settings.column_id = null"
      />
    </validation-provider>
    <validation-provider
      vid="maximumNumberSuccess"
      tag="div"
      class="p-field"
    >
      <label for="maximumNumberSuccess">
        {{ $t('components.process.form.maximumNumberSuccessLabel') }}
      </label>
      <p-input-number
        id="maximumNumberSuccess"
        v-model="processCloned.maximumNumberSuccess"
      />
    </validation-provider>
  </lck-form>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */

import Vue, { PropOptions } from 'vue'

import { ValidationProvider } from 'vee-validate'

import {
  LckProcess,
  PROCESS_TRIGGER,
} from '@/services/lck-api/definitions'

import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import InputSwitch from 'primevue/inputswitch'
import InputNumber from 'primevue/inputnumber'

import Form from '@/components/ui/Form/Form.vue'
import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'

export default Vue.extend({
  name: 'LckProcessForm',
  components: {
    'lck-autocomplete': AutoComplete,
    'lck-form': Form,
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-number': Vue.extend(InputNumber),
    'p-input-text': Vue.extend(InputText),
    'p-input-switch': Vue.extend(InputSwitch),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    process: {
      type: Object,
    } as PropOptions<LckProcess>,
    tables: {
      type: Array,
      default: () => ([]),
    } as PropOptions<{ label: string; value: string }[]>,
    columns: {
      type: Array,
      default: () => ([]),
    } as PropOptions<{ label: string; value: string }[]>,
    submitting: {
      type: Boolean,
      default: false,
    },
  },
  data (): {
    processCloned: LckProcess;
    triggerOptions: { label: PROCESS_TRIGGER; value: PROCESS_TRIGGER }[];
    } {
    return {
      processCloned: new LckProcess(),
      triggerOptions: [{
        label: PROCESS_TRIGGER.CREATE_ROW,
        value: PROCESS_TRIGGER.CREATE_ROW,
      }, {
        label: PROCESS_TRIGGER.UPDATE_ROW,
        value: PROCESS_TRIGGER.UPDATE_ROW,
      }, {
        label: PROCESS_TRIGGER.UPDATE_ROW_DATA,
        value: PROCESS_TRIGGER.UPDATE_ROW_DATA,
      }, {
        label: PROCESS_TRIGGER.CRON,
        value: PROCESS_TRIGGER.CRON,
      }, {
        label: PROCESS_TRIGGER.MANUAL,
        value: PROCESS_TRIGGER.MANUAL,
      }],
    }
  },
  computed: {
    triggerWithSettings (): boolean {
      return this.processCloned.trigger === PROCESS_TRIGGER.UPDATE_ROW_DATA
    },
  },
  watch: {
    process: {
      handler (newValue: LckProcess) {
        if (!newValue) return
        const {
          id,
          text,
          trigger,
          settings,
          enabled,
          url,
          table_id,
          table,
          maximumNumberSuccess,
          workspace_id,
        } = newValue
        this.processCloned = { id, text, trigger, enabled: !!enabled, url, table_id, settings, table, maximumNumberSuccess: maximumNumberSuccess || 0, workspace_id }
        if (settings?.column) {
          this.processCloned.settings = {
            ...settings,
            column: { ...settings.column },
          }
        }
      },
      immediate: true,
    },
  },
})
</script>
