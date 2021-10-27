<template>
  <div class="p-fluid p-d-flex p-flex-column p-px-3" style="position: relative;">
    <h3>
      {{ process.text || "Création d'un nouveau processus" }}
    </h3>
    <lck-process-form
      :process="process"
      :submitting="submitting"
      @input="$emit('input', $event)"
      @cancel="$emit('cancel')"
      :table-id="tableId"
      :tables="suggestionsTable"
      :columns="suggestionsColumn"
      @search-table="$emit('search-table', $event)"
      @search-column="$emit('search-column', $event)"
    />
    <div class="p-mx-auto">
      <p-button
        class="p-button-sm p-button-danger"
        icon="bi bi-trash"
        @click="$emit('delete', process.id)"
        :disabled="process.runs && process.runs.length > 0"
        :label="$t('components.process.removeButtonLabel')"
      />
    </div>
    <div v-if="process.runs && process.runs.length > 0">
      <h4 class="p-tabview-title">
        {{ $t('components.process.headerRuns') }}
        <span class="p-ml-1">
          ({{ process.runs.length }})
        </span>
      </h4>
      <p-button
        icon="pi pi-refresh"
        @click="$emit('refresh-runs', process)"
        class="p-button-sm"
        style="width: auto"
        :label="$t('components.process.refreshButtonLabel')"
      />
      <p-accordion
        :multiple="true"
        v-if="process.runs && process.runs.length > 0"
      >
        <p-accordion-tab
          v-for="run in process.runs"
          :key="run.id"
        >
          <template #header>
            {{ run.createdAt }} -
            {{ run.status }} -
            {{ run.duration }}
          </template>
          <pre>{{ run.log }}</pre>
        </p-accordion-tab>
      </p-accordion>
    </div>
    <p v-else class="p-p-1">
      {{ $t('components.process.noRun') }}
    </p>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import Button from 'primevue/button'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import ProcessForm from './ProcessForm.vue'
import { LckProcess } from '@/services/lck-api/definitions'

export default {
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
    'p-accordion': Vue.extend(Accordion),
    'p-accordion-tab': Vue.extend(AccordionTab),
    'lck-process-form': ProcessForm,
  },
}
</script>

<style scoped>
pre {
  max-height: 300px;
  overflow: auto;
}

/deep/ .lck-process-tab.p-tabview .p-tabview-nav {
  background-color: transparent;
  overflow: auto;
  border: unset;
  flex-wrap: unset;
}

/deep/ .lck-process-tab.p-tabview .p-tabview-nav .p-tabview-title{
  line-height: inherit;
  color: var(--primary-color)
}

/deep/ .lck-process-tab.p-tabview .p-tabview-panels {
  padding: 0.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: unset;
}

/deep/ .lck-process-tab.p-tabview .p-tabview-panels .p-tabview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/deep/ .lck-process-tab.p-tabview .p-tabview-nav li {
  white-space: nowrap;
}

/deep/ .lck-process-tab.p-tabview .p-tabview-nav li .p-tabview-nav-link {
  padding: 0.25rem;
  font-weight: var(--font-weight-regular);
  margin: 0.25rem;
}

pre {
  font-size: var(--font-size-sm);
  line-height: 1rem;
}
</style>
