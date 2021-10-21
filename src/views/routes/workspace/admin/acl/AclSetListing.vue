<template>
  <layout-with-toolbar class="aclset-listing">
    <template #toolbar>
      <span class="p-pl-1">
        <span class="pi pi-th-large"/>
        {{ $t('pages.acl.common.title') }}
      </span>

      <div class="p-d-flex p-flex-wrap">
        <p-button
          class="p-button-text p-button-primary add-aclset-button"
          icon="pi pi-plus-circle"
          :label="$t('form.add')"
          @click="createAclSet"
        />
      </div>
    </template>

    <div v-if="!displayEditForm">
      <div v-if="workspace && workspace.aclsets">
        <div
          v-for="aclSet in workspace.aclsets"
          class="lck-aclset-item p-d-flex p-jc-between p-ai-center p-m-1 p-p-1"
          :key="aclSet.id"
          @click="fetchAclSet(aclSet)"
        >
          <div class="o-hidden o-ellipsis">
            <p class="aclset-text">
              {{ aclSet.label }}
            </p>
            <span class="p-tag">
              {{ aclSet.manager ? $t('pages.acl.common.manager') : $t('pages.acl.common.noManager') }}
            </span>
          </div>
          <div class="p-ml-auto">
            <p-button
              class="p-button-sm p-button-text p-button-rounded p-button-info"
              icon="pi pi-chevron-right"
            />
          </div>
        </div>
      </div>
      <p v-else class="p-p-1">{{ $t('pages.acl.listing.noAclSet') }}</p>
    </div>
    <div class="p-m-2" v-else>
      <p-button
        class="p-button-text p-button-primary aclset-listing-button"
        icon="pi pi-chevron-left"
        :label="$t('pages.acl.listing.title')"
        @click="cancelEdit"
      />
      <lck-aclset-form
        :aclSet="selectedAclSet"
        :chapterSuggestions="chapterSuggestions"
        :submitting="submitting"
        @cancel="cancelEdit"
        @delete="deleteAclSet"
        @search-chapter="onSearchChapter"
        @set-aclset="setAclSet"
        @set-acltable="setAclTable"
      />
    </div>
    <p-confirm-dialog />
  </layout-with-toolbar>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import Vue from 'vue'
import { Paginated } from '@feathersjs/feathers'

import { lckServices } from '@/services/lck-api'
import { LckAclSet, LckAclTable, LckChapter, LckDatabase, LckTable, LckWorkspace } from '@/services/lck-api/definitions'

import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'

import AclSetForm from './AclSetForm.vue'
import WithToolbar from '@/layouts/WithToolbar.vue'

export default {
  name: 'AclSetListing',
  components: {
    'p-button': Vue.extend(Button),
    'p-confirm-dialog': Vue.extend(ConfirmDialog),
    'layout-with-toolbar': WithToolbar,
    'lck-aclset-form': AclSetForm,
  },
  props: {
    workspaceId: {
      type: String,
      required: true,
    },
  },
  data (): {
    chapterSuggestions: LckChapter[];
    displayEditForm: boolean;
    selectedAclSet: LckAclSet | null;
    submitting: {
      aclSet: boolean;
    };
    tables: Record<string, LckTable>;
    workspace: LckWorkspace | null;
    } {
    return {
      chapterSuggestions: [],
      displayEditForm: false,
      selectedAclSet: null,
      submitting: {
        aclSet: false,
      },
      tables: {},
      workspace: null,
    }
  },
  async mounted () {
    await this.fetchWorkspace()
  },
  methods: {
    /**
     * Hide the update form and reset the selected aclSet.
     */
    cancelEdit () {
      this.displayEditForm = false
      this.selectedAclSet = null
    },
    /**
     * Set some default data for the new aclset and display the form.
     */
    createAclSet () {
      this.selectedAclSet = new LckAclSet('', this.workspaceId)
      this.displayEditForm = true
    },
    /**
     * Display an error toast whose the content is based on the error code.
     */
    displayToastOnError (error: Error & { code: number }) {
      this.$toast.add({
        severity: 'error',
        summary: this.$t('error.basic'),
        detail: this.$t('error.http.' + error.code),
        life: 5000,
      })
    },
    /**
     * Delete an aclset.
     */
    async deleteAclSet (aclSetToDelete: LckAclSet) {
      this.$confirm.require({
        message: `${this.$t('form.specificDeleteConfirmation')} ${aclSetToDelete.label}`,
        header: this.$t('form.confirmation'),
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          if (!this.workspace?.aclsets) return
          try {
            this.submitting.aclSet = true
            await lckServices.aclset.remove(aclSetToDelete.id)
            const indexOfAclSet = this.workspace.aclsets.findIndex(aclSet => aclSet.id === aclSetToDelete.id)
            this.workspace.aclsets.splice(indexOfAclSet, 1)
            this.cancelEdit()
          } catch (error) {
            this.displayToastOnError(error)
          } finally {
            this.submitting.aclSet = false
          }
        },
      })
    },
    /**
     * Fetch more information about the aclset that we want to update, set some default data and display the form.
     */
    async fetchAclSet (aclSet: LckAclSet) {
      try {
        this.selectedAclSet = await lckServices.aclset.get(aclSet.id, {
          query: {
            $eager: '[chapter, acltables]',
          },
        })
        if (this.selectedAclSet) {
          this.setDefaultAclTables(this.selectedAclSet)
          this.displayEditForm = true
        }
      } catch (error) {
        this.displayToastOnError(error)
      }
    },
    /**
     * Fetch the workspace.
     */
    async fetchWorkspace () {
      try {
        this.workspace = await lckServices.workspace.get(this.workspaceId, {
          query: {
            $eager: '[databases.tables, aclsets]',
            $select: ['workspace.id', 'workspace.text'],
          },
        })
        this.tables = this.workspace.databases!.reduce((tables: Record<string, LckTable>, database: LckDatabase) => {
          database.tables.forEach(table => {
            tables[table.id] = table
          })
          return tables
        }, {})
      } catch (error) {
        this.displayToastOnError(error)
      }
    },
    /**
     * Search chapter from its title.
     */
    async onSearchChapter (query: string) {
      const result = await lckServices.chapter.find({
        query: {
          $select: ['id', 'text'],
          text: {
            $ilike: `%${query}%`,
          },
          workspace_id: this.workspaceId,
        },
      }) as Paginated<LckChapter>
      this.chapterSuggestions = result.data
    },
    /**
     * Update or create an aclset based on the aclset configuration form values.
     */
    async setAclSet ({ id, chapter_id, label, manager, workspace_id, acltables, chapter }: LckAclSet) {
      if (!this.workspace?.aclsets) return
      try {
        this.submitting.aclSet = true
        if (id) {
          // On update
          const savedAclSet = await lckServices.aclset.patch(id, {
            chapter_id,
            label,
            manager,
          })
          savedAclSet.acltables = acltables
          savedAclSet.chapter = chapter
          this.selectedAclSet = savedAclSet
          const indexOfAclSet = this.workspace.aclsets.findIndex(aclSet => aclSet.id === id)
          this.$set(this.workspace.aclsets, indexOfAclSet, this.selectedAclSet)
        } else {
          // On create
          this.selectedAclSet = await lckServices.aclset.create({
            chapter_id,
            label,
            manager,
            workspace_id,
          })
          this.selectedAclSet.chapter = chapter
          this.setDefaultAclTables(this.selectedAclSet)
          this.workspace.aclsets.push(this.selectedAclSet)
        }
      } catch (error) {
        this.displayToastOnError(error)
      } finally {
        this.submitting.aclSet = false
      }
    },
    /**
     * Create or update an acl table linked the selected acl set.
     */
    async setAclTable ({ index, aclTable, newData }: { index: number; aclTable: LckAclTable; newData: Partial<LckAclTable> }) {
      if (!this.selectedAclSet) return
      try {
        const updatedAclTable = aclTable.id
          ? await lckServices.acltable.patch(aclTable.id, newData)
          : await lckServices.acltable.create({
            aclset_id: this.selectedAclSet.id,
            table_id: aclTable.table_id,
            ...newData,
          })
        updatedAclTable.table = aclTable.table
        this.selectedAclSet.acltables!.splice(index, 1, updatedAclTable)
      } catch (error) {
        this.displayToastOnError(error)
      }
    },
    /**
     * Complete and set default acl tables for the selected aclset.
     */
    setDefaultAclTables (aclSet: LckAclSet) {
      const aclTables = aclSet.acltables || []
      const addedTablesIds: Set<string> = new Set()
      // Set the table linked to the current acltable based on the table_id property
      aclTables.forEach(aclTable => {
        aclTable.table = this.tables[aclTable.table_id]
        addedTablesIds.add(aclTable.table_id)
      })
      // Define default acltables for the tables that are not yet linked to the current acltable
      for (const tableId in this.tables) {
        if (!addedTablesIds.has(tableId)) {
          aclTables.push(new LckAclTable(aclSet.id, this.tables[tableId]))
        }
      }
      // Sort acltable by table name
      aclTables.sort((acl1, acl2) => acl1.table!.text.localeCompare(acl2.table!.text))
      this.$set(aclSet, 'acltables', aclTables)
    },
  },
}
</script>

<style scoped lang="scss">

.aclset-listing {
  background-color: white;
  height: 100%;
}

.aclset-listing-button {
  padding: 0.5em;
}

.lck-aclset-item {
  background-color: var(--primary-color);
  border-radius: var(--border-radius);
  color: #fff;
  cursor: pointer;

  & .aclset-text {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  &:hover {
    background-color: var(--primary-color-darken);
  }
}

.p-button.p-button-info.p-button-text {
  color: var(--primary-color-text);
}

.p-button.p-button-info.p-button-text:hover {
  color: #fff;
}

.o-ellipsis {
  padding: 0 1rem 1rem 1rem;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.p-tag {
  border: 1px solid var(--surface-w);
  color: var(--surface-w);
}

</style>
