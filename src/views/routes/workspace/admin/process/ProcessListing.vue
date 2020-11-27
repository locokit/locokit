<template>
  <layout-with-toolbar
    class="lck-process-listing p-d-flex p-flex-column o-auto"
  >
    <template #toolbar>
      <span class="p-pl-1">
        <span class="pi pi-th-large"/>
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

    <p-tab-view class="lck-process-listing-tab p-m-1">
      <p-tab-panel
        :active.sync="activePanel[0]"
      >
        <template slot="header">
          <div class="p-text-info">
            {{ $t('pages.process.allProcessesHeader') }}
          </div>
        </template>
        <template v-if="processResult.length > 0">
          <div
            class="lck-process-item p-d-flex p-jc-between p-ai-center p-m-1 p-p-1"
            v-for="process in processResult"
            :key="process.id"
            style="border: 1px solid gray;border-radius: var(--border-radius);cursor: pointer;"
            @click="onClickProcessItem(process)"
          >
            <div
              class="o-hidden"
              style="
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 100%;
                position: relative;
              "
            >
              {{ process.text }}
              <span
                v-if="process.runs && process.runs.length > 0"
              >
                ({{ process.runs.length }})
              </span>
              <br />
              <span class="lck-chips">
                {{ $t('pages.process.eventTrigger.' + process.trigger) }}
              </span>
              <div
                style="
                  border-radius: 50%;
                  width: 1rem; height: 1rem;
                  margin-left: auto;
                  position: absolute;
                  top: calc(50% - .5rem);
                  right: .5rem;
                "
                :style="{
                  'background-color': process.enabled ? 'var(--color-success)': 'transparent',
                  'border': process.enabled ? '' : '1px solid var(--primary-color)'
                }"
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
        </template>
        <p v-else class="p-p-1">
          {{ $t('pages.process.noProcess') }}
        </p>
      </p-tab-panel>
      <p-tab-panel
        :active.sync="activePanel[1]"
        v-if="displayDetailProcess"
      >
        <template slot="header">
          <div class="p-text-info">
            {{ $t('pages.process.oneProcessHeader') }}
          </div>
        </template>
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
        />
      </p-tab-panel>
    </p-tab-view>

  </layout-with-toolbar>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import Vue from 'vue'
import { Paginated } from '@feathersjs/feathers'
import Button from 'primevue/button'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

import { lckServices } from '@/services/lck-api'
import { LckProcess, LckProcessRun, LckProcessTrigger, LckTable, LckTableColumn } from '@/services/lck-api/definitions'

import WithToolbar from '@/layouts/WithToolbar.vue'
import Process from '@/components/store/Process/Process.vue'

export default {
  name: 'ProcessListing',
  components: {
    'p-tab-view': Vue.extend(TabView),
    'p-tab-panel': Vue.extend(TabPanel),
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
      activePanel: [true, false],
      suggestionsTable: [] as { text: string; value: string }[],
      suggestionsColumn: [] as { text: string; value: string }[]
    }
  },
  methods: {
    async onInputProcess (data: Partial<LckProcess>) {
      console.log(JSON.parse(JSON.stringify(data)))
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
      this.activePanel = [true, false]
      this.displayDetailProcess = false
      this.processResult = this.processResult.filter(p => p.id !== processId)
    },
    async loadProcesses () {
      this.loading = true
      try {
        if (!this.tableId) {
          // eslint-disable-next-line no-case-declarations
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
      this.activePanel = [false, true]
      this.currentProcess = new LckProcess()
      this.currentProcess.table_id = this.tableId
    },
    async onClickProcessItem (process: LckProcess) {
      this.displayDetailProcess = true
      this.activePanel = [false, true]
      /**
       * Load the column if the process is with settings
       */
      if (
        process.trigger === LckProcessTrigger.UPDATE_ROW_DATA &&
        process.settings?.column_id
      ) {
        this.$set(process.settings, 'column', await lckServices.tableColumn.get(process.settings.column_id))
      }
      this.currentProcess = process
    },
    async onSearchTable ({ query }: { query: string}) {
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
}
</script>

<style scoped>
.lck-process-listing {
  background-color: white;
  height: 100%;
}

/deep/ .lck-process-listing-tab.p-tabview .p-tabview-nav {
  /* background-color: transparent; */
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
}

.lck-chips {
  border-radius: var(--border-radius);
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
}
.lck-chips-highlight {
  background-color: var(--color-success-light);
  color: var(--text-color);
  border: unset;
}
</style>
