<template>
  <layout-with-toolbar
    class="p-d-flex p-flex-column o-auto"
    style="background-color: white; width: 30rem; border-left: 1px solid var(--header-border-bottom-color);"
  >
    <template #toolbar>
      <span class="p-pl-1">
        <span class="pi pi-th-large"/>
        Processes
      </span>

      <div class="p-d-flex p-flex-wrap">
        <p-button
          :label="$t('form.add')"
          icon="pi pi-plus-circle"
          class="p-button-text p-button-primary"
          @click="onClickCreateProcess"
        />
      </div>
    </template>

    <ul class="">
      <li
        v-for="process in processResult"
        :key="process.id"
        @click="onClickProcessItem"
      >
        {{ process.text }}
      </li>
    </ul>
  </layout-with-toolbar>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import Vue from 'vue'
import { lckServices } from '@/services/lck-api'
import Button from 'primevue/button'
import WithToolbar from '@/layouts/WithToolbar.vue'
import { Paginated } from '@feathersjs/feathers'
import { LckProcess, LckProcessTrigger } from '@/services/lck-api/definitions'

enum DISPLAY_MODE {
  BY_WORKSPACE = 'BY_WORKSPACE',
  BY_TABLE = 'BY_TABLE',
}

export default {
  name: 'ProcessListing',
  components: {
    'layout-with-toolbar': WithToolbar,
    'p-button': Vue.extend(Button)
  },
  props: {
    workspaceId: {
      type: String,
      required: false
    },
    tableId: {
      type: String,
      required: false
    },
    displayMode: {
      type: String,
      validator: (value: DISPLAY_MODE) => [DISPLAY_MODE.BY_WORKSPACE, DISPLAY_MODE.BY_TABLE].indexOf(value) > -1,
      default: DISPLAY_MODE.BY_TABLE
    }
  },
  data () {
    return {
      loading: false,
      processResult: [] as LckProcess[],
      displayModal: false
    }
  },
  methods: {
    async loadProcesses () {
      this.loading = true
      try {
        switch (this.displayMode) {
          case DISPLAY_MODE.BY_WORKSPACE:
            // eslint-disable-next-line no-case-declarations
            const processByWorkspace = await lckServices.process.find({
              query: {
                workspace_id: this.workspaceId,
                $limit: 50
              }
            }) as Paginated<LckProcess>
            this.processResult = processByWorkspace.data
            break
          case DISPLAY_MODE.BY_TABLE:
            if (!this.tableId) return
            // eslint-disable-next-line no-case-declarations
            const processTriggerByTable = await lckServices.processTrigger.find({
              query: {
                table_id: this.tableId,
                $eager: 'process',
                $limit: 50
              }
            }) as Paginated<LckProcessTrigger>
            console.log(processTriggerByTable)
            this.processResult = processTriggerByTable.data.map(pt => ({
              ...pt.process as LckProcess
            }))
        }
      } catch (error) {
        console.error(error)
      }
      this.loading = false
    },
    onClickCreateProcess () {
      this.displayModal = true
    },
    onClickProcessItem () {
      this.displayModal = true
    }
  },
  mounted () {
    this.loadProcesses()
  },
  watch: {
    tableId () {
      this.loadProcesses()
    }
  }
}
</script>
