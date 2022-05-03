<template>
  <div class="lck-layout-content">
    <div
      class="lck-bg-sidebar lck-sidebar"
      :class="{'lck-sidebar--active': sidebarActive}"
    >
      <h2 class="p-pl-3 lck-color-title">
        {{ $t('pages.process.title') }}
      </h2>
      <router-link
        v-for="process in processResult"
        class="lck-sidebar-link"
        :key="process.id"
        :to="{
          name: routeNameProcessDetail,
          params: {
            ...$route.params,
            processId: process.id
          }
        }"
      >
        <i class="bi lck-sidebar-link-icon bi-lightning" />
        <span>{{process.text}}</span>
        <span
          class="status-mark"
          :class="process.enabled ? 'status-mark-enabled' : ''"
        />
      </router-link>

      <div v-if="processResult.length === 0 && !loading" class="p-p-3">
        {{ $t('pages.process.noProcess') }}
      </div>
      <p-button
        :label="$t('form.add')"
        icon="bi bi-plus-circle"
        class="p-button-primary p-mx-3"
        @click="onClickCreateProcess"
      />
    </div>

    <div class="lck-page">
      <lck-process
        class="p-col-12 p-md-10 p-xl-8 p-mx-auto p-mt-2"
        v-if="currentProcess"
        :process="currentProcess"
        @input="onInputProcess"
        @delete="onDeleteProcess"
        :submitting="submitting"
        @search-table="onSearchTable"
        @search-column="onSearchColumn"
        :suggestionsTable="suggestionsTable"
        :suggestionsColumn="suggestionsColumn"
        @refresh-runs="onRefreshRuns"
        @cancel="resetCurrentProcess"
      />
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import Vue from 'vue'
import { Paginated } from '@feathersjs/feathers'
import Button from 'primevue/button'

import { lckServices } from '@/services/lck-api'
import { LckProcess, LckProcessRun, LckTable, LckTableColumn, PROCESS_TRIGGER } from '@/services/lck-api/definitions'

import Process from '@/components/store/Process/Process.vue'
import { ROUTES_NAMES } from '@/router/paths'

export default Vue.extend({
  name: 'ProcessListing',
  components: {
    'p-button': Vue.extend(Button),
    'lck-process': Process,
  },
  props: {
    workspaceId: {
      type: String,
      required: true,
    },
    processId: {
      type: String,
      required: false,
    },
    sidebarActive: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      loading: false,
      submitting: false,
      routeNameProcessDetail: ROUTES_NAMES.WORKSPACE_ADMIN.PROCESS_DETAIL,
      processResult: [] as LckProcess[],
      currentProcess: null as LckProcess | null,
      suggestionsTable: [] as { text: string; value: string }[],
      suggestionsColumn: [] as { text: string; value: string }[],
    }
  },
  methods: {
    async onInputProcess (data: Partial<LckProcess>) {
      this.submitting = true
      try {
        if (data.id) {
          /**
           * Id exist, we only patch
           */
          const processPatched = await lckServices.process.patch(data.id, {
            text: data.text,
            url: data.url || '',
            enabled: data.enabled,
            table_id: data.table_id,
            trigger: data.trigger,
            maximumNumberSuccess: data.maximumNumberSuccess,
            settings: {
              column_id: data.settings?.column_id,
            },
          })
          /**
           * Update our current data
           */
          const actualProcessIndex = this.processResult.findIndex(p => p.id === data.id)
          if (actualProcessIndex > -1) {
            this.$set(
              this.processResult,
              actualProcessIndex,
              {
                ...this.processResult[actualProcessIndex],
                ...processPatched,
                table: data.table,
                settings: {
                  ...processPatched,
                  column: data.settings?.column,
                },
              },
            )
          }
        } else {
          /**
           * This is a creation.
           * We have to create the process
           * AND the trigger if we are on a table.
           * If we don't create the trigger,
           * the process won't be visible for the user.
           */
          const process = await lckServices.process.create({
            text: data.text,
            url: data.url || '',
            enabled: data.enabled,
            table_id: data.table_id,
            trigger: data.trigger,
            maximumNumberSuccess: data.maximumNumberSuccess,
            settings: {
              column_id: data.settings?.column_id,
            },
          })
          this.currentProcess = process
          this.currentProcess.table = data.table
          this.currentProcess.settings = {
            ...this.currentProcess.settings,
            column: data.settings?.column,
          }
          /**
           * Finally, add the currentProcess to the list of processes
           */
          this.processResult.push(this.currentProcess)
        }
        // Go back to display processes list
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error.http.' + error.code),
          detail: this.$t('error.lck.' + error.data.code),
          life: 5000,
        })
      }
      this.submitting = false
    },
    async onDeleteProcess (processId: string) {
      await lckServices.process.remove(processId)
      this.processResult = this.processResult.filter(p => p.id !== processId)
    },
    async loadProcesses () {
      this.loading = true
      try {
        const processByWorkspace = await lckServices.process.find({
          query: {
            'table:database.workspace_id': this.workspaceId,
            $limit: 50,
            $joinRelation: 'table.[database]',
            $sort: {
              createdAt: 1,
            },
          },
        }) as Paginated<LckProcess>
        this.processResult = processByWorkspace.data
      } catch (error) {
        console.error(error)
      }
      this.loading = false
    },
    onClickCreateProcess () {
      this.$router.push({
        name: ROUTES_NAMES.WORKSPACE_ADMIN.PROCESS_ADD,
        params: {
          workspaceId: this.workspaceId,
        },
      })
      this.currentProcess = new LckProcess()
    },
    async onSearchTable ({ query }: { query: string }) {
      const tableResult = await lckServices.table.find({
        query: {
          'database.workspace_id': this.workspaceId,
          $joinRelation: 'database',
          'table.text': {
            $ilike: `%${query}%`,
          },
        },
      }) as Paginated<LckTable>
      this.suggestionsTable = tableResult.data.map(tr => ({
        text: tr.text,
        value: tr.id,
      }))
    },
    async onSearchColumn ({ query, tableId }: { query: string; tableId: string }) {
      const columnResult = await lckServices.tableColumn.find({
        query: {
          table_id: tableId,
          text: {
            $ilike: `%${query}%`,
          },
        },
      }) as Paginated<LckTableColumn>
      this.suggestionsColumn = columnResult.data.map(tr => ({
        text: tr.text,
        value: tr.id,
      }))
    },
    async onRefreshRuns (process: LckProcess) {
      const processRunResult = await lckServices.processRun.find({
        query: {
          process_id: process.id,
          $limit: 50,
          $sort: {
            createdAt: -1,
          },
        },
      }) as Paginated<LckProcessRun>
      this.$set(process, 'runs', processRunResult.data)
    },
    async loadProcess (processId: string) {
      /**
       * Load the column if the process is with settings
       */
      this.currentProcess = await lckServices.process.get(processId)
      if (
        this.currentProcess.trigger === PROCESS_TRIGGER.UPDATE_ROW_DATA &&
        this.currentProcess.settings?.column_id
      ) {
        this.$set(this.currentProcess.settings, 'column', await lckServices.tableColumn.get(this.currentProcess.settings.column_id))
      }
      this.onRefreshRuns(this.currentProcess)
    },
    resetCurrentProcess () {
      this.currentProcess = null
    },
  },
  mounted () {
    this.loadProcesses()
  },
  watch: {
    workspaceId () {
      this.loadProcesses()
    },
    processId: {
      handler (newValue) {
        if (!newValue) return
        this.loadProcess(this.processId)
      },
      immediate: true,
    },
  },
})
</script>

<style scoped>
.lck-process-listing {
    background-color: white;
  height: 100%;
}

::v-deep .lck-process-listing-tab.p-tabview .p-tabview-nav {
  overflow: auto;
  border: unset;
  flex-wrap: unset;
}

::v-deep .lck-process-listing-tab.p-tabview .p-tabview-panels {
  padding: 0.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  /* background-color: unset; */
}

::v-deep .lck-process-listing-tab.p-tabview .p-tabview-panels .p-tabview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

::v-deep .lck-process-listing-tab.p-tabview .p-tabview-nav li {
  white-space: nowrap;
}

::v-deep .lck-process-listing-tab.p-tabview .p-tabview-nav li .p-tabview-nav-link {
  padding: 0.25rem;
  font-weight: var(--font-weight-regular);
  margin: 0.25rem;
  border-color: var(--primary-color);
  color: var(--primary-color);
}

::v-deep .lck-process-listing-tab.p-tabview .p-tabview-nav li .p-tabview-nav-link:hover {
  border-color: var(--primary-color-dark);
  color: var(--primary-color-dark);
}

.p-button.p-button-info.p-button-text {
  color: var(--primary-color-dark);
}

.p-button.p-button-info.p-button-text:hover {
  color: #fff;
}

.lck-process-item {
  border-radius: var(--border-radius);
  cursor: pointer;
  background-color: var(--primary-color);
  color: #fff;
}

.lck-process-item .process-text {
  font-weight: var(--font-weight-bold);
  margin-bottom: 0.5rem;
}

.lck-process-item:hover {
  background-color: var(--primary-color-dark);
}

.status-mark {
  border-radius: 50%;
  width: 0.8rem;
  height: 0.8rem;
  margin-left: auto;
  background-color: transparent;
  position: absolute;
  top: calc(50% - .5rem);
  right: .5rem;
  border: 2px solid #fff;
}

.status-mark-enabled {
  background-color: var(--color-success);
  border: unset;
}
</style>
