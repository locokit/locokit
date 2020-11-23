<template>
  <div class="p-fluid p-d-flex p-flex-column">
    <h3>{{ process.text }}</h3>
    <p-tab-view>
      <p-tab-panel
        :header="$t('components.process.headerProperties')"
      >
        <div class="p-field">
          <label for="text">
            {{ $t('components.process.textLabel') }}
          </label>
          <p-input-text
            id="text"
            type="text"
            :value="process.text"
            :placeholder="$t('components.process.textLabel')"
          />
        </div>
        <div class="p-field">
          <label for="url">
            {{ $t('components.process.urlLabel') }}
          </label>
          <p-input-text
            id="url"
            type="text"
            :value="process.url"
            :placeholder="$t('components.process.urlLabel')"
          />
        </div>
        <div class="p-d-flex">
          <p-button
            class="p-button-danger"
            :label="$t('components.process.removeButtonLabel')"
            icon="pi pi-trash"
          />
          <p-button
            class="p-button-secondary"
            :label="$t('components.process.duplicateButtonLabel')"
            icon="pi pi-copy"
          />
        </div>
      </p-tab-panel>
      <p-tab-panel
        :header="$t('components.process.headerTriggers')"
      >
        <p-accordion
          :multiple="true"
          v-if="process.triggers && process.triggers.length > 0"
        >
          <p-accordion-tab
            v-for="trigger in process.triggers"
            :key="trigger.id"
          >
            <template #header>
              {{ trigger.text }}
            </template>
            <div class="p-field">
              <label for="text">
                {{ $t('components.process.textLabel') }}
              </label>
              <p-input-text
                id="text"
                type="text"
                :value="trigger.text"
                :placeholder="$t('components.process.textLabel')"
              />
            </div>
            <div class="p-field">
              <label for="automatic">
                {{ $t('components.process.automaticLabel') }}
              </label>
              <p-input-text
                id="automatic"
                type="text"
                :value="trigger.automatic"
                :placeholder="$t('components.process.automaticLabel')"
              />
            </div>
            <div class="p-field">
              <label for="table_id">
                {{ $t('components.process.tableLabel') }}
              </label>
              <p-input-text
                id="table_id"
                type="text"
                :value="trigger.table_id"
                :placeholder="$t('components.process.tableLabel')"
              />
            </div>
            <div class="p-field">
              <label for="settings">
                {{ $t('components.process.settingsLabel') }}
              </label>
              <p-input-text
                id="settings"
                type="text"
                :value="JSON.stringify(trigger.settings || {})"
                :placeholder="$t('components.process.settingsLabel')"
              />
            </div>
          </p-accordion-tab>
        </p-accordion>
        <span v-else>
          {{ $t('components.process.noTrigger') }}
        </span>
      </p-tab-panel>
      <p-tab-panel
        :header="$t('components.process.headerRuns')"
      >
        <p-accordion
          :multiple="true"
          v-if="process.runs && process.runs.length > 0"
        >
          <p-accordion-tab
            v-for="run in process.runs"
            :key="run.id"
          >
            <template #header>
              {{ run.text }}
            </template>
            <div class="p-field">
              <label for="text">
                {{ $t('components.process.textLabel') }}
              </label>
              <p-input-text
                id="text"
                type="text"
                :value="run.text"
                :placeholder="$t('components.process.textLabel')"
              />
            </div>
            <div class="p-field">
              <label for="automatic">
                {{ $t('components.process.automaticLabel') }}
              </label>
              <p-input-text
                id="automatic"
                type="text"
                :value="run.automatic"
                :placeholder="$t('components.process.automaticLabel')"
              />
            </div>
            <div class="p-field">
              <label for="table_id">
                {{ $t('components.process.tableLabel') }}
              </label>
              <p-input-text
                id="table_id"
                type="text"
                :value="run.table_id"
                :placeholder="$t('components.process.tableLabel')"
              />
            </div>
            <div class="p-field">
              <label for="settings">
                {{ $t('components.process.settingsLabel') }}
              </label>
              <p-input-text
                id="settings"
                type="text"
                :value="JSON.stringify(run.settings || {})"
                :placeholder="$t('components.process.settingsLabel')"
              />
            </div>
          </p-accordion-tab>
        </p-accordion>
        <span v-else>
          {{ $t('components.process.noRun') }}
        </span>
      </p-tab-panel>
    </p-tab-view>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'

export default {
  name: 'LckProcess',
  props: {
    process: {
      type: Object,
      required: true
    }
  },
  components: {
    'p-button': Vue.extend(Button),
    'p-input-text': Vue.extend(InputText),
    'p-tab-view': Vue.extend(TabView),
    'p-tab-panel': Vue.extend(TabPanel),
    'p-accordion': Vue.extend(Accordion),
    'p-accordion-tab': Vue.extend(AccordionTab)
  }
}
</script>
