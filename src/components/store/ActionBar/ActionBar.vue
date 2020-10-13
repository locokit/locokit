<template>
  <div class="action-bar">
    <p-toolbar class="p-p-1">
      <template slot="left">
        <p-button
          type="button"
          icon="pi pi-filter"
          label="Filters"
          @click="toggleFiltersPanel"
        />
      </template>
    </p-toolbar>
    <p-overlay-panel ref="filtersPanel" appendTo="body">
      <div>
        <div>
          <div
            class="container p-d-flex"
            v-if="filters.length > 0"
          >
            <div
              class="filter-row p-mr-2"
              v-for="(filter, index) in filters"
              :key="`filter-${index}`"
            >
              <label for="aggregation">Aggregation</label>
              <p-input-text
                id="aggregation"
                type="text"
                v-model="filter.aggregation"
              />
              <label for="column">Column</label>
              <p-input-text
                id="column"
                type="text"
                v-model="filter.column"
              />
              <label for="motif">Value</label>
              <p-input-text
                id="motif"
                type="text"
                v-model="filter.motif"
              />
            </div>
          </div>
          <div v-else>
            <p>Aucun filtre n'est appliquée.</p>
          </div>
          <div>
            <p-button
              type="button"
              icon="pi pi-plus-circle"
              label="Ajouter un filtre"
              @click="addFilter"
            />
          </div>
        </div>
      </div>
    </p-overlay-panel>
  </div>
</template>

<script>
import Vue from 'vue'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Dropdown from 'primevue/dropdown'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputSwitch from 'primevue/inputswitch'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import OverlayPanel from 'primevue/overlaypanel'

import { COLUMN_TYPE } from '@locokit/lck-glossary'
import InputNumber from 'primevue/inputnumber'

import lckClient from '@/services/lck-api'
import AutoComplete from '@/components/ui/AutoComplete/AutoComplete'

export default {
  name: 'ActionBar',
  components: {
    // 'p-dialog': Vue.extend(Dialog),
    // 'p-tab-view': Vue.extend(TabView),
    // 'p-tab-panel': Vue.extend(TabPanel),
    // 'lck-autocomplete': Vue.extend(AutoComplete),
    // 'p-dropdown': Vue.extend(Dropdown),
    // 'p-input-number': Vue.extend(InputNumber),
    'p-input-text': Vue.extend(InputText), // 'p-textarea': Vue.extend(Textarea),
    // 'p-input-switch': Vue.extend(InputSwitch),
    // 'p-calendar': Vue.extend(Calendar),
    'p-button': Vue.extend(Button),
    'p-overlay-panel': Vue.extend(OverlayPanel),
    'p-toolbar': Vue.extend(Toolbar)
  },
  props: {},
  data () {
    return {
      filters: []
    }
  },
  methods: {
    toggleFiltersPanel (event) {
      this.$refs.filtersPanel.toggle(event)
    },
    addFilter () {
      this.filters.push({ aggregation: null, column: null, motif: null })
    }
  }
}
</script>
