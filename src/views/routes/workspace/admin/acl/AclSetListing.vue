<template>
  <div class="lck-layout-content">
    <div
      class="lck-bg-sidebar lck-sidebar"
      :class="{'lck-sidebar--active': sidebarActive}"
    >
      <h2 class="p-pl-3 lck-color-title">
        {{ $t('pages.workspaceAdmin.acl.common.title') }}
      </h2>

      <div v-if="workspace && workspace.aclsets">
        <router-link
          v-for="aclSet in workspace.aclsets"
          class="lck-sidebar-link"
          :key="aclSet.id"
          :to="{
            name: routeNameAclDetail,
            params: {
              ...$route.params,
              aclSetId: aclSet.id
            }
          }"
        >
          <i class="bi lck-sidebar-link-icon bi-shield-lock" />
          <span>{{aclSet.label}}</span>
          <span
            class="status-mark"
            v-if="aclSet.manager"
          >M</span>
        </router-link>
      </div>

      <div v-else-if="!loading" class="p-p-3">
        {{ $t('pages.workspaceAdmin.acl.listing.noAclSet') }}
      </div>

      <p-button
        class="p-button-primary p-mx-3"
        icon="pi pi-plus-circle"
        :label="$t('form.add')"
        @click="createAclSet"
      />
    </div>

    <div class="lck-page">
      <lck-aclset-form
        class="p-col-12 p-md-10 p-xl-8 p-mx-auto p-mt-2"
        v-if="selectedAclSet"
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
  </div>
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
import { ROUTES_NAMES } from '@/router/paths'

export default {
  name: 'AclSetListing',
  components: {
    'p-button': Vue.extend(Button),
    'p-confirm-dialog': Vue.extend(ConfirmDialog),
    'lck-aclset-form': AclSetForm,
  },
  props: {
    workspaceId: {
      type: String,
      required: true,
    },
    aclSetId: {
      type: String,
      required: false,
    },
  },
  data (): {
    chapterSuggestions: LckChapter[];
    selectedAclSet: LckAclSet | null;
    submitting: {
      aclSet: boolean;
    };
    tables: Record<string, LckTable>;
    workspace: LckWorkspace | null;
    routeNameAclDetail: string;
    } {
    return {
      chapterSuggestions: [],
      selectedAclSet: null,
      submitting: {
        aclSet: false,
      },
      tables: {},
      workspace: null,
      routeNameAclDetail: ROUTES_NAMES.WORKSPACE_ADMIN.ACL_DETAIL,
    }
  },
  async mounted () {
    await this.fetchWorkspace()
    if (this.aclSetId) {
      this.fetchAclSet(this.aclSetId)
    }
  },
  methods: {
    /**
     * Hide the update form and reset the selected aclSet.
     */
    cancelEdit () {
      this.selectedAclSet = null
    },
    /**
     * Set some default data for the new aclset and display the form.
     */
    createAclSet () {
      this.selectedAclSet = new LckAclSet('', this.workspaceId)
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
          } catch (error: any) {
            this.displayToastOnError(error)
          } finally {
            this.submitting.aclSet = false
          }
        },
      })
    },
    /**
     * Fetch more information about the aclset that we want to update
     * set some default data and display the form.
     */
    async fetchAclSet (aclSetId: string) {
      try {
        this.selectedAclSet = await lckServices.aclset.get(aclSetId, {
          query: {
            $eager: '[chapter, acltables]',
          },
        })
        if (this.selectedAclSet) {
          this.setDefaultAclTables(this.selectedAclSet)
        }
      } catch (error: any) {
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
      } catch (error: any) {
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
      } catch (error: any) {
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
      } catch (error: any) {
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
  watch: {
    aclSetId () {
      this.fetchAclSet(this.aclSetId)
    },
  },
}
</script>

<style scoped lang="scss">

.status-mark {
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  line-height: 1rem;
  margin-left: auto;
  position: absolute;
  top: calc(50% - .5rem);
  right: .5rem;
  font-size: 0.7rem;
  vertical-align: middle;
  text-align: center;
  color: var(--secondary-color-lighten);
  background-color: var(--primary-color);
}

</style>
