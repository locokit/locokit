<template>
  <lck-form
    @cancel="$emit('cancel')"
    @submit="$emit('input', processCloned)"
    :submitting="submitting"
  >
    <div class="p-field">
      <label for="text">
        {{ $t('components.process.form.text.label') }}
      </label>
      <p-input-text
        id="text"
        type="text"
        v-model="processCloned.text"
        :placeholder="$t('components.process.form.text.placeholder')"
        required
      />
    </div>
    <div class="p-field">
      <label for="url">
        {{ $t('components.process.form.url') }}
      </label>
      <p-input-text
        id="url"
        type="text"
        v-model="processCloned.url"
        :placeholder="$t('components.process.form.url')"
        required
      />
    </div>
    <div class="p-field">
      <label for="enabled">
        {{ $t('components.process.form.enabled') }}
      </label>
      <br/>
      <p-input-switch
        id="enabled"
        v-model="processCloned.enabled"
      />
    </div>
    <div class="p-field">
      <label for="table">
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
        required
      />
    </div>
    <div class="p-field">
      <label for="trigger">
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
        required
      />
    </div>
    <div
      class="p-field"
      v-if="triggerWithSettings"
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
    </div>
    <div class="p-field">
      <label for="maximumNumberSuccess">
        {{ $t('components.process.form.maximumNumberSuccessLabel') }}
      </label>
      <p-input-number
        id="maximumNumberSuccess"
        v-model="processCloned.maximumNumberSuccess"
      />
    </div>
  </lck-form>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */

import Vue, { PropOptions } from 'vue'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import InputSwitch from 'primevue/inputswitch'
import InputNumber from 'primevue/inputnumber'
import Form from '@/components/ui/Form/Form.vue'
import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'

import {
  LckProcess,
  PROCESS_TRIGGER
} from '@/services/lck-api/definitions'

export default {
  name: 'LckProcessForm',
  components: {
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-number': Vue.extend(InputNumber),
    'p-input-text': Vue.extend(InputText),
    'p-input-switch': Vue.extend(InputSwitch),
    'lck-autocomplete': AutoComplete,
    'lck-form': Form
  },
  props: {
    process: {
      type: Object
    } as PropOptions<LckProcess>,
    tables: {
      type: Array,
      default: () => ([])
    } as PropOptions<{ label: string; value: string }[]>,
    columns: {
      type: Array,
      default: () => ([])
    } as PropOptions<{ label: string; value: string }[]>,
    submitting: {
      type: Boolean,
      default: false
    }
  },
  data (): {
    processCloned: LckProcess;
    triggerOptions: { label: PROCESS_TRIGGER; value: PROCESS_TRIGGER }[];
    } {
    return {
      processCloned: new LckProcess(),
      triggerOptions: [{
        label: PROCESS_TRIGGER.CREATE_ROW,
        value: PROCESS_TRIGGER.CREATE_ROW
      }, {
        label: PROCESS_TRIGGER.UPDATE_ROW,
        value: PROCESS_TRIGGER.UPDATE_ROW
      }, {
        label: PROCESS_TRIGGER.UPDATE_ROW_DATA,
        value: PROCESS_TRIGGER.UPDATE_ROW_DATA
      }, {
        label: PROCESS_TRIGGER.CRON,
        value: PROCESS_TRIGGER.CRON
      }, {
        label: PROCESS_TRIGGER.MANUAL,
        value: PROCESS_TRIGGER.MANUAL
      }]
    }
  },
  computed: {
    triggerWithSettings (): boolean {
      return this.processCloned.trigger === PROCESS_TRIGGER.UPDATE_ROW_DATA
    }
  },
  watch: {
    process: {
      handler (newValue) {
        if (!newValue) return
        const { id, text, trigger, settings, enabled, url, table_id, table, maximumNumberSuccess } = newValue
        this.processCloned = { id, text, trigger, enabled, url, table_id, settings, table, maximumNumberSuccess }
        if (settings?.columns) {
          this.processCloned.settings = {
            ...settings,
            column: { ...settings.columns }
          }
        }
      },
      immediate: true
    }
  }
}
</script>
