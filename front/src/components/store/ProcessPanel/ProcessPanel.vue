<template>
  <div
    v-if="processesByRow.length > 0"
  >
    <h3 class="lck-block-title">{{ $t('components.processPanel.title') }}</h3>
    <div
      v-if="!!rowId"
      class="p-pb-6"
    >
      <p-panel
        v-for="process in processesByRow"
        :key="process.id"
        :toggleable="true"
        :collapsed="true"
      >
        <template #header>
          <div class="p-grid process-panel-header">
            <div class="p-col-8 process-header-title p-m-auto">
              <span>{{ process.text }} </span>
              <span
                v-if="process.runs && process.runs.length > 0"
                class="p-badge lck-badge-process"
              >{{ process.runs.length }}</span>
            </div>
            <div class="p-col-2">
              <span class="p-tag p-tag-rounded p-m-auto">
                {{ PROCESS_TRIGGER.MANUAL === process.trigger ? $t(`components.processPanel.${process.trigger}`) : $t('components.processPanel.automatic') }}
              </span>
            </div>
            <div
              v-if="PROCESS_TRIGGER.MANUAL === process.trigger"
              class="p-col-2 p-m-auto"
            >
              <p-button
                icon="pi pi-play"
                class="p-button-sm"
                @click="onProcessTrigger(rowId, process)"
                :disabled="getDisabledProcessTrigger(process, rowId)"
              />
            </div>
            <div
              v-else
              class="p-col-2 p-m-auto"
            >
              <p-input-switch
                :value="!!process.enabled"
                @input="onActivityProcess(process.id, $event)"
              />
            </div>
          </div>
        </template>
        <p-datatable
          v-if="process.runs && process.runs.length > 0"
          class="
          p-datatable-sm
          p-d-flex
          p-flex-column
          justify-between
        "
          :value="process.runs"
          :expandedRows.sync="expandedRows"
          dataKey="id"
        >
          <p-column
            headerStyle="height: 2.5rem; width: 3rem"
            bodyStyle="height: 2.5rem; width: 3rem"
            :expander="true"
          />
          <p-column
            headerStyle="height: 2.5rem"
            bodyStyle="height: 2.5rem"
            field="status"
            :header="$t('components.processPanel.status')"
          >
            <template #body="slotProps">
            <span
              class="p-tag p-tag-rounded"
              :class="
                slotProps.data.status === PROCESS_RUN_STATUS.SUCCESS && 'p-tag-success' ||
                slotProps.data.status === PROCESS_RUN_STATUS.WARNING && 'p-tag-warning' ||
                slotProps.data.status === PROCESS_RUN_STATUS.ERROR && 'p-tag-danger' ||
               'p-tag-info'
              "
            >
              {{ $t(`components.processPanel.${slotProps.data.status}`) }}
            </span>
            </template>
          </p-column>
          <p-column
            field="createdAt"
            :header="$t('components.processPanel.when')"
          >
            <template #body="slotProps">
              <span>{{ formatDateString(slotProps.data.createdAt, $t('date.datetimeLogFormat')) }}</span>
              <span
                v-if="slotProps.data.status !== PROCESS_TRIGGER.RUNNING && slotProps.data.duration"
              >
              ({{ slotProps.data.duration }}ms)
            </span>
            </template>
          </p-column>
          <template #expansion="slotProps">
            <pre v-if="!!slotProps.data.log">
              {{ slotProps.data.log }}
            </pre>
            <p v-else>{{ $t('components.processPanel.noLog') }}</p>
          </template>
        </p-datatable>
        <span
          v-else
        >
          {{ $t('components.processPanel.noDataToDisplay') }}
        </span>
      </p-panel>
    </div>
    <div v-else>
      <p>{{ $t('components.processPanel.noDataToDisplay') }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Button from 'primevue/button'
import InputSwitch from 'primevue/inputswitch'
import Panel from 'primevue/panel'
import PrimeDataTable from 'primevue/datatable'
import Column from 'primevue/column'

import { getDisabledProcessTrigger } from '@/services/lck-utils/process'
import { formatDateString } from '@/services/lck-utils/date'
import { PROCESS_RUN_STATUS, PROCESS_TRIGGER } from '@/services/lck-api/definitions'

export default Vue.extend({
  name: 'ProcessPanel',
  components: {
    'p-input-switch': Vue.extend(InputSwitch),
    'p-panel': Vue.extend(Panel),
    'p-datatable': Vue.extend(PrimeDataTable),
    'p-column': Vue.extend(Column),
    'p-button': Vue.extend(Button),
  },
  props: {
    processesByRow: {
      type: Array,
      default: () => ([]),
    },
    rowId: {
      type: String,
      default: null,
    },
  },
  data () {
    return {
      PROCESS_RUN_STATUS,
      PROCESS_TRIGGER,
      expandedRows: [],
    }
  },
  methods: {
    formatDateString,
    getDisabledProcessTrigger,
    onProcessTrigger (rowId: string, process: {id: string; text: string }) {
      this.$emit('create-process-run', {
        rowId,
        processId: process.id,
        name: process.text,
      })
    },
    onActivityProcess (processId: string, event: boolean) {
      this.$emit('toggle-process', {
        processId,
        enabled: event,
      })
    },
  },
})
</script>

<style scoped>
::v-deep .p-panel-header {
  flex-direction: row-reverse;
}

.process-panel-header{
  width: 100%;
}

.process-header-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lck-badge-process {
  background-color: #7d9399;
}
</style>
