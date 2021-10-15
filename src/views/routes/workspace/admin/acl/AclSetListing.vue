<template>
  <div class="aclset-container" style="margin: 1em auto; width: 90%;">
    <p-datatable
      v-if="!displayEditForm"
      dataKey="id"
      style="margin-top: 1em;"
      selectionMode="single"
      :value="aclSets"
      @row-select="editAclSet"
    >
      <template #header style="display: flex; flex-direction: column">
        <div style="display: flex; justify-content: space-between; align-items: center">
          <h1 style="color: var(--text-color)">Liste des permissions</h1>
          <p-button
            icon="pi pi-plus"
            class="p-button-text"
            label="Créer"
            @click="createAclSet()"
          />
        </div>

      </template>
      <p-column
        header="Label"
        field="label"
      />
      <p-column
        header="Manager"
      >
        <template #body="slotProps">
          <p-checkbox
            :modelValue="slotProps.data.manager"
            :binary="true"
            :disabled="true"
          />
        </template>
      </p-column>
      <p-column
        header="Chapitre"
      >
        <template #body="slotProps">
          <p v-if="slotProps.data.chapter">
            {{ slotProps.data.chapter.text }}
          </p>
          <p v-else>
            Aucun chapitre
          </p>
        </template>
      </p-column>
      <p-column headerStyle="width: 5em;">
        <template #body>
          <i class="pi pi-chevron-right"></i>
        </template>
      </p-column>
    </p-datatable>
    <div v-else>
      <p-button
        class="p-button-rounded p-button-text"
        icon="pi pi-arrow-left"
        label="Liste des permissions"
        @click="cancelEdit"
      />
      <h1>{{ selectedAclSet ? 'Edit' : 'Create' }}</h1>
      <lck-aclset-form
        :aclSet="selectedAclSet"
        :workspaceId="this.workspaceId"
        :chapterSuggestions="chapterSuggestions"

        @search-chapter="onSearchChapter"
      />
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */

import Vue from 'vue'
import { Paginated } from '@feathersjs/feathers'

import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Checkbox from 'primevue/checkbox'

import { lckServices } from '@/services/lck-api'
import { LckAclSet, LckChapter } from '@/services/lck-api/definitions'
import { authState } from '@/store/auth'
import AclSetForm from './AclSetForm.vue'

export default {
  name: 'AclSetListing',
  components: {
    'p-button': Vue.extend(Button),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'p-checkbox': Vue.extend(Checkbox),
    'lck-aclset-form': AclSetForm,
  },
  props: {
    workspaceId: {
      type: String,
      required: true,
    },
  },
  data (): {
    aclSets: LckAclSet[];
    displayEditForm: boolean;
    selectedAclSet: LckAclSet | null;
    chapterSuggestions: LckChapter[];
    } {
    return {
      aclSets: [],
      selectedAclSet: null,
      displayEditForm: false,
      chapterSuggestions: [],
    }
  },
  async mounted () {
    await this.fetchAclSets()
  },
  methods: {
    /**
     * Load the acl sets related to the current workspace.
     */
    async fetchAclSets () {
      try {
        const result = await lckServices.aclset.find({
          query: {
            $eager: '[chapter, groups]',
            $joinRelation: 'groups.[users]',
            'groups:users.id': authState.data.user?.id,
            manager: true,
            workspace_id: this.workspaceId,
          },
        }) as Paginated<LckAclSet>
        this.aclSets = result.data
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('pages.acl.aclSetError'),
          detail: error.code ? this.$t('error.http.' + error.code) : this.$t('error.basic'),
          life: 5000,
        })
      }
    },
    createAclSet () {
      console.log('create acl set')
      this.displayEditForm = true
    },
    editAclSet (event: { data: LckAclSet }) {
      console.log('edit acl set', event.data)
      this.displayEditForm = true
      this.selectedAclSet = event.data
    },
    cancelEdit () {
      this.displayEditForm = false
      this.selectedAclSet = null
    },
    async onSearchChapter (query: string) {
      const result = await lckServices.chapter.find({
        query: {
          text: {
            $ilike: `%${query}%`,
          },
          workspace_id: this.workspaceId,
        },
      }) as Paginated<LckChapter>
      this.chapterSuggestions = result.data
    },
  },
}
</script>

<style>

</style>
