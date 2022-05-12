<template>
  <p-card >
    <template #title>
      {{ process.text || $t('components.process.createTitle') }}
    </template>
    <template #content>
      <lck-process-form
        :process="process"
        :submitting="submitting"
        @input="$emit('input', $event)"
        @cancel="$emit('cancel')"
        @delete="$emit('delete')"
        :table-id="tableId"
        :tables="suggestionsTable"
        :columns="suggestionsColumn"
        @search-table="$emit('search-table', $event)"
        @search-column="$emit('search-column', $event)"
      />
      <div class="p-mx-auto" v-if="process.id">
        <p-button
          v-if="displayTriggerButton"
          icon="bi bi-lightning"
          @click="$emit('run')"
          :disabled="!processTriggerable"
          label="Déclencher"
        />
        <p-button
          icon="bi bi-arrow-clockwise"
          class="p-button-outlined p-mr-2"
          @click="$emit('refresh-runs', process)"
        />

        <div v-if="process.runs && process.runs.length > 0">
          <h4 class="p-tabview-title">
            {{ $t('components.process.headerRuns') }}
            <span class="p-ml-1">
              ({{ process.runs.length }})
            </span>
          </h4>

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

        </div>
        <p v-else class="p-p-1">
          {{ $t('components.process.noRun') }}
        </p>
      </div>
    </template>
  </p-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import Button from 'primevue/button'
import ProcessForm from './ProcessForm.vue'
import { LckProcess, PROCESS_TRIGGER, PROCESS_RUN_STATUS } from '@/services/lck-api/definitions'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { formatDateString } from '@/services/lck-utils/date'

export default Vue.extend({
  name: 'LckProcess',
  props: {
    process: {
      type: Object,
      required: true,
    } as PropOptions<LckProcess>,
    submitting: {
      type: Boolean,
      default: false,
    },
    /**
     * If Process is given a tableId prop,
     * we'll create process / trigger exclusively on this table
     */
    tableId: {
      type: String,
      required: false,
    },
    suggestionsTable: {
      type: Array,
      required: false,
    },
    suggestionsColumn: {
      type: Array,
      required: false,
    },
  },
  components: {
    'p-button': Vue.extend(Button),
    'p-card': Vue.extend(Card),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'lck-process-form': ProcessForm,
  },
  data () {
    return {
      PROCESS_RUN_STATUS,
      PROCESS_TRIGGER,
      expandedRows: [],
    }
  },
  computed: {
    processTriggerable () {
      if (!this.process) return false
      return (
        this.process.trigger === PROCESS_TRIGGER.MANUAL &&
        !this.process.table_id &&
        this.process.enabled === true
      )
    },
    displayTriggerButton () {
      if (!this.process) return false
      return (
        this.process.trigger === PROCESS_TRIGGER.MANUAL &&
        !this.process.table_id
      )
    },
  },
  methods: {
    formatDateString,
  },
})
</script>

<style scoped>
pre {
  max-height: 300px;
  overflow: auto;
}

::v-deep .lck-process-tab.p-tabview .p-tabview-nav {
  background-color: transparent;
  overflow: auto;
  border: unset;
  flex-wrap: unset;
}

::v-deep .lck-process-tab.p-tabview .p-tabview-nav .p-tabview-title{
  line-height: inherit;
  color: var(--primary-color)
}

::v-deep .lck-process-tab.p-tabview .p-tabview-panels {
  padding: 0.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: unset;
}

::v-deep .lck-process-tab.p-tabview .p-tabview-panels .p-tabview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

::v-deep .lck-process-tab.p-tabview .p-tabview-nav li {
  white-space: nowrap;
}

::v-deep .lck-process-tab.p-tabview .p-tabview-nav li .p-tabview-nav-link {
  padding: 0.25rem;
  font-weight: var(--font-weight-regular);
  margin: 0.25rem;
}

pre {
  font-size: var(--font-size-sm);
  line-height: 1rem;
}
</style>
