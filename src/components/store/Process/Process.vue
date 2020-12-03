<template>
  <div class="p-fluid p-d-flex p-flex-column" style="position: relative;">
    <h3>
      {{ process.text }}
    </h3>
    <p-button
      class="p-button-sm p-button-danger"
      icon="pi pi-trash"
      @click="$emit('delete', process.id)"
      style="position: absolute; top: .5rem; right: .5rem;width: auto;"
      :disabled="process.runs && process.runs.length > 0"
    />
    <p-tab-view class="lck-process-tab">
      <p-tab-panel
        :header="$t('components.process.headerProperties')"
      >
        <lck-process-form
          :process="process"
          :submitting="submitting"
          @input="$emit('input', $event)"
          :table-id="tableId"
          :tables="suggestionsTable"
          :columns="suggestionsColumn"
          @search-table="$emit('search-table', $event)"
          @search-column="$emit('search-column', $event)"
        />
      </p-tab-panel>
      <p-tab-panel v-if="process.id">
        <template #header>
          <span class="p-tabview-title">
            {{ $t('components.process.headerRuns') }}
          </span>
          <span
            v-if="process.runs && process.runs.length > 0"
            class="p-ml-1"
          >
            ({{ process.runs.length }})
          </span>
          <p-button
            icon="pi pi-refresh"
            @click="$emit('refresh-runs', process)"
            class="p-button-sm p-button-text p-p-0"
          />
        </template>
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
        <p v-else class="p-p-1">
          {{ $t('components.process.noRun') }}
        </p>
      </p-tab-panel>
    </p-tab-view>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
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
      required: true
    } as PropOptions<LckProcess>,
    submitting: {
      type: Boolean,
      default: false
    },
    /**
     * If Process is given a tableId prop,
     * we'll create process / trigger exclusively on this table
     */
    tableId: {
      type: String,
      required: false
    },
    suggestionsTable: {
      type: Array,
      required: false
    },
    suggestionsColumn: {
      type: Array,
      required: false
    }
  },
  components: {
    'p-button': Vue.extend(Button),
    'p-tab-view': Vue.extend(TabView),
    'p-tab-panel': Vue.extend(TabPanel),
    'p-accordion': Vue.extend(Accordion),
    'p-accordion-tab': Vue.extend(AccordionTab),
    'lck-process-form': ProcessForm
  }
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
  font-weight: normal;
  margin: 0.25rem;
}

pre {
  font-size: .8rem;
  line-height: 1rem;
}
</style>
