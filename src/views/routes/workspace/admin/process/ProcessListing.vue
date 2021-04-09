<template>
  <layout-with-toolbar
    class="lck-process-listing p-d-flex p-flex-column o-auto"
  >
    <template #toolbar>
      <span class="p-pl-1">
        <span class="pi pi-th-large" />
        {{ $t('pages.process.titleButton') }}
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

    <div class="lck-process-listing p-m-1" v-show="!displayDetailProcess">
      <div class="process-listing" v-if="processResult.length > 0">
        <div
          class="lck-process-item p-d-flex p-jc-between p-ai-center p-m-1 p-p-1"
          v-for="process in processResult"
          :key="process.id"
          @click="onClickProcessItem(process)"
        >
          <div
            class="o-hidden o-ellipsis"
          >
            <span class="process-text">{{ process.text }}</span>
            <span
              v-if="process.runs && process.runs.length > 0"
            >
                ({{ process.runs.length }})
              </span>
            <br />
            <span
              class="p-tag"
            >
                {{ $t('pages.process.eventTrigger.' + process.trigger) }}
              </span>
            <div
              class="status-mark"
              :class="process.enabled ? 'status-mark-enabled' : ''"
            />
          </div>
          <div class="p-ml-auto">
            <p-button
              class="p-button-sm p-button-text p-button-rounded p-button-info"
              icon="pi pi-chevron-right"
              @click="$emit('update', process)"
            />
          </div>
        </div>
      </div>
      <p v-else class="p-p-1">
        {{ $t('pages.process.noProcess') }}
      </p>
    </div>
    <div class="lck-process-detail p-m-2" v-if="displayDetailProcess">

      <p>
        <p-button
          :label="$t('pages.process.allProcessesHeader')"
          icon="pi pi-chevron-left"
          class="p-button-text p-button-primary"
          @click="backToProcessList"
        />
      </p>

      <lck-process
        :process="currentProcess"
        @input="onInputProcess"
        @delete="onDeleteProcess"
        :submitting="submitting"
        @search-table="onSearchTable"
        @search-column="onSearchColumn"
        :suggestionsTable="suggestionsTable"
        :suggestionsColumn="suggestionsColumn"
        @refresh-runs="onRefreshRuns"
        @cancel="backToProcessList"
      />
    </div>

  </layout-with-toolbar>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import Vue from 'vue'
import { Paginated } from '@feathersjs/feathers'
import Button from 'primevue/button'

import { lckServices } from '@/services/lck-api'
import { LckProcess, LckProcessRun, LckTable, LckTableColumn, PROCESS_TRIGGER } from '@/services/lck-api/definitions'

import WithToolbar from '@/layouts/WithToolbar.vue'
import Process from '@/components/store/Process/Process.vue'

export default Vue.extend({
  name: 'ProcessListing',
  components: {
    'layout-with-toolbar': WithToolbar,
    'p-button': Vue.extend(Button),
    'lck-process': Process
  },
  props: {
    workspaceId: {
      type: String,
      required: false
    },
    tableId: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      loading: false,
      submitting: false,
      processResult: [] as LckProcess[],
      displayDetailProcess: false,
      currentProcess: new LckProcess() as LckProcess,
      suggestionsTable: [] as { text: string; value: string }[],
      suggestionsColumn: [] as { text: string; value: string }[]
    }
  },
  methods: {
    backToProcessList () {
      this.displayDetailProcess = false
    },
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
              column_id: data.settings?.column_id
            }
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
                  column: data.settings?.column
                }
              }
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
              column_id: data.settings?.column_id
            }
          })
          this.currentProcess = process
          this.currentProcess.table = data.table
          this.currentProcess.settings = {
            ...this.currentProcess.settings,
            column: data.settings?.column
          }
          /**
           * Finally, add the currentProcess to the list of processes
           */
          this.processResult.push(this.currentProcess)
        }
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error.http.' + error.code),
          detail: this.$t('error.lck.' + error.data.code),
          life: 3000
        })
      }
      this.submitting = false
    },
    async onDeleteProcess (processId: string) {
      await lckServices.process.remove(processId)
      this.displayDetailProcess = false
      this.processResult = this.processResult.filter(p => p.id !== processId)
    },
    async loadProcesses () {
      this.loading = true
      try {
        if (!this.tableId) {
          const processByWorkspace = await lckServices.process.find({
            query: {
              'table:database.workspace_id': this.workspaceId,
              $limit: 50,
              $eager: '[table, runs]',
              $joinRelation: 'table.[database]',
              $sort: {
                createdAt: 1
              }
            }
          }) as Paginated<LckProcess>
          this.processResult = processByWorkspace.data
        } else {
          const processByWorkspaceAndTable = await lckServices.process.find({
            query: {
              $limit: 50,
              $eager: '[table, runs]',
              table_id: this.tableId,
              $joinRelation: 'runs',
              $sort: {
                createdAt: 1
              }
            }
          }) as Paginated<LckProcess>
          this.processResult = processByWorkspaceAndTable.data
        }
      } catch (error) {
        console.error(error)
      }
      this.loading = false
    },
    onClickCreateProcess () {
      this.displayDetailProcess = true
      this.currentProcess = new LckProcess()
      this.currentProcess.table_id = this.tableId
    },
    async onClickProcessItem (process: LckProcess) {
      this.displayDetailProcess = true
      /**
       * Load the column if the process is with settings
       */
      if (
        process.trigger === PROCESS_TRIGGER.UPDATE_ROW_DATA &&
        process.settings?.column_id
      ) {
        this.$set(process.settings, 'column', await lckServices.tableColumn.get(process.settings.column_id))
      }
      this.currentProcess = process
    },
    async onSearchTable ({ query }: { query: string }) {
      const tableResult = await lckServices.table.find({
        query: {
          'database.workspace_id': this.workspaceId,
          $joinRelation: 'database',
          'table.text': {
            $ilike: `%${query}%`
          }
        }
      }) as Paginated<LckTable>
      this.suggestionsTable = tableResult.data.map(tr => ({
        text: tr.text,
        value: tr.id
      }))
    },
    async onSearchColumn ({ query, tableId }: { query: string; tableId: string }) {
      const columnResult = await lckServices.tableColumn.find({
        query: {
          table_id: tableId,
          text: {
            $ilike: `%${query}%`
          }
        }
      }) as Paginated<LckTableColumn>
      this.suggestionsColumn = columnResult.data.map(tr => ({
        text: tr.text,
        value: tr.id
      }))
    },
    async onRefreshRuns (process: LckProcess) {
      const processRunResult = await lckServices.processRun.find({
        query: {
          process_id: process.id,
          $limit: 50,
          $sort: {
            createdAt: -1
          }
        }
      }) as Paginated<LckProcessRun>
      process.runs = processRunResult.data
    }
  },
  mounted () {
    this.loadProcesses()
  },
  watch: {
    tableId () {
      this.loadProcesses()
    },
    workspaceId () {
      this.loadProcesses()
    }
  }
})
</script>

<style scoped>
.lck-process-listing {
    background-color: white;
  height: 100%;
}

/deep/ .lck-process-listing-tab.p-tabview .p-tabview-nav {
  overflow: auto;
  border: unset;
  flex-wrap: unset;
}

/deep/ .lck-process-listing-tab.p-tabview .p-tabview-panels {
  padding: 0.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  /* background-color: unset; */
}

/deep/ .lck-process-listing-tab.p-tabview .p-tabview-panels .p-tabview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/deep/ .lck-process-listing-tab.p-tabview .p-tabview-nav li {
  white-space: nowrap;
}

/deep/ .lck-process-listing-tab.p-tabview .p-tabview-nav li .p-tabview-nav-link {
  padding: 0.25rem;
  font-weight: normal;
  margin: 0.25rem;
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/deep/ .lck-process-listing-tab.p-tabview .p-tabview-nav li .p-tabview-nav-link:hover {
  border-color: var(--primary-color-darken);
  color: var(--primary-color-darken);
}

.p-button.p-button-info.p-button-text {
  color: var(--primary-color-text);
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
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.lck-process-item:hover {
  background-color: var(--primary-color-darken);
}

.o-ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  position: relative;
  padding: 1rem;

}

.status-mark {
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  margin-left: auto;
  background-color: transparent;
  position: absolute;
  top: calc(50% - .5rem);
  right: .5rem;
  border: 2px solid #fff;
}

.status-mark-enabled {
  background-color: var(--color-success);
  border: 1px solid var(--primary-color);
}

.p-tag {
  border: 1px solid var(--surface-w);
  color: var(--surface-w);
}

</style>
