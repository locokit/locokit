<template>
  <div class="lck-layout-content">
    <div
      class="lck-bg-sidebar lck-sidebar"
      :class="{'lck-sidebar--active': sidebarActive}"
    >
      <h2 class="p-pl-3 lck-color-title">
        {{ $t('pages.workspaceAdmin.group.common.title') }}
      </h2>

      <router-link
        v-for="group in groups"
        class="lck-sidebar-link"
        :key="group.id"
        :to="{
          name: routeNameGroupDetail,
          params: {
            ...$route.params,
            groupId: group.id
          }
        }"
      >
        <i class="bi lck-sidebar-link-icon bi-people" />
        <span>{{group.name}}</span>
      </router-link>

      <div v-if="!loading && groups.length === 0" class="p-p-3">
        {{ $t('pages.workspaceAdmin.group.listing.noGroup') }}
      </div>

      <p-button
        class="p-button-primary p-mx-3"
        icon="pi pi-plus-circle"
        :label="$t('form.add')"
        @click="createGroup"
      />
    </div>

    <div class="lck-page">
      <lck-usergroup-form
        class="p-col-12 p-md-10 p-xl-8 p-mx-auto p-mt-2"
        v-if="selectedGroup"
        :group="selectedGroup"
        :aclSetSuggestions="aclSetSuggestions"
        :userSuggestions="userSuggestions"
        :submitting="submitting"

        @create-usergroup="addUserInGroup"
        @update-usergroup="editUserInGroup"
        @delete-usergroup="deleteUserInGroup"

        @input="saveGroup"
        @cancel="cancelEdit"

        @search-aclset="onSearchAclset"
        @search-user="onSearchUser"
      />
    </div>
    <p-confirm-dialog />
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import Vue from 'vue'
import { Paginated, Params } from '@feathersjs/feathers'

import { lckServices } from '@/services/lck-api'
import { LckAclSet, LckGroup, LckUser } from '@/services/lck-api/definitions'

import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'

import UserGroupForm from '@/components/admin/group/UserGroupForm.vue'
import { ROUTES_NAMES } from '@/router/paths'
import { GROUP_ROLE } from '@locokit/lck-glossary/src'

export default {
  name: 'CommonGroupListing',
  components: {
    'p-button': Vue.extend(Button),
    'p-confirm-dialog': Vue.extend(ConfirmDialog),
    'lck-usergroup-form': UserGroupForm,
  },
  props: {
    workspaceId: {
      type: String,
      required: false,
    },
    groupId: {
      type: String,
      required: false,
    },
    sidebarActive: {
      type: Boolean,
      required: false,
    },
  },
  data (): {
    aclSetSuggestions: { label: string; value: string }[];
    userSuggestions: { label: string; value: number }[];
    selectedGroup: LckGroup | null;
    groups: LckGroup[];
    submitting: boolean;
    loading: boolean;
    } {
    return {
      aclSetSuggestions: [],
      userSuggestions: [],
      selectedGroup: null,
      groups: [],
      submitting: false,
      loading: false,
    }
  },
  computed: {
    routeNameGroupDetail () {
      if (this.workspaceId) {
        return ROUTES_NAMES.WORKSPACE_ADMIN.GROUP_DETAIL
      } else {
        return ROUTES_NAMES.ADMIN.GROUP_DETAIL
      }
    },
    routeNameGroup () {
      if (this.workspaceId) {
        return ROUTES_NAMES.WORKSPACE_ADMIN.GROUP
      } else {
        return ROUTES_NAMES.ADMIN.GROUP
      }
    },
  },
  async mounted () {
    await this.fetchGroups()
  },
  methods: {
    /**
     * Hide the update form and reset the selected aclSet.
     */
    cancelEdit () {
      this.selectedGroup = null
    },
    /**
     * Set some default data for the new aclset and display the form.
     */
    async createGroup () {
      await this.$router.push({
        name: this.routeNameGroup,
        params: {
          ...this.$route.params,
          groupId: '',
        },
      })
      this.selectedGroup = new LckGroup()
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
     * Fetch more information about the aclset that we want to update
     * set some default data and display the form.
     */
    async fetchGroup (groupId: string) {
      try {
        this.selectedGroup = await lckServices.group.get(groupId, {
          query: {
            $eager: '[users, aclset.[workspace, chapter]]',
          },
        })
      } catch (error: any) {
        this.displayToastOnError(error)
      }
    },
    /**
     * Delete the group from database
     */
    async saveGroup (group: LckGroup) {
      this.submitting = true
      try {
        if (!group.id) {
          const response = await lckServices.group.create({
            name: group.name,
            aclset_id: group.aclset_id,
          }, {
            query: {
              $eager: '[aclset.[workspace, chapter]]',
            },
          })
          this.selectedGroup!.name = response.name
          this.selectedGroup!.aclset_id = response.aclset_id
          this.selectedGroup!.aclset = response.aclset
        } else {
          const response = await lckServices.group.patch(group.id, {
            name: group.name,
            aclset_id: group.aclset_id,
          }, {
            query: {
              $eager: '[aclset.[workspace, chapter]]',
            },
          })
          this.selectedGroup!.name = response.name
          this.selectedGroup!.aclset_id = response.aclset_id
          this.selectedGroup!.aclset = response.aclset
        }
        /**
         * Refresh the listing with the new group / updated group
         */
        this.fetchGroups()
      } catch (error: any) {
        this.displayToastOnError(error)
      }
      this.submitting = false
    },
    /**
     * Fetch the workspace's groups.
     */
    async fetchGroups () {
      this.loading = true
      try {
        const groupParams: Params = {
          query: {
            $limit: -1,
          },
        }
        /**
         * When we are on the workspaceAdmin.groups route
         */
        if (this.workspaceId) {
          groupParams.query!.$joinRelation = '[aclset.[workspace]]'
          groupParams.query!['aclset:workspace.id'] = this.workspaceId
        }
        const responseGroups = await lckServices.group.find(groupParams) as LckGroup[]
        this.groups = responseGroups
      } catch (error: any) {
        this.displayToastOnError(error)
      }
      this.loading = false
    },
    /**
     * Add a new user in a group
     */
    async addUserInGroup (userId: number, groupId: string, role: GROUP_ROLE) {
      this.submitting = true
      try {
        await lckServices.usergroup.create({
          user_id: userId,
          group_id: groupId,
          uhg_role: role,
        })
      } catch (error: any) {
        this.displayToastOnError(error)
      }
      await this.fetchGroup(this.groupId)
      this.submitting = false
    },
    /**
     * Edit the user in a group
     */
    async editUserInGroup (userId: number, groupId: string, role: GROUP_ROLE) {
      this.submitting = true
      try {
        await lckServices.usergroup.patch(
          `${userId},${groupId}`,
          { uhg_role: role },
        )
      } catch (error: any) {
        this.displayToastOnError(error)
      }
      this.fetchGroup(this.groupId)
      await this.fetchGroup(this.groupId)
      this.submitting = false
    },
    /**
     * Delete a user in a group
     */
    async deleteUserInGroup (userId: number, groupId: string) {
      this.submitting = true
      try {
        await lckServices.usergroup.remove(
          `${userId},${groupId}`,
        )
      } catch (error: any) {
        this.displayToastOnError(error)
      }
      await this.fetchGroup(this.groupId)
      this.submitting = false
    },
    async onSearchAclset ({ query }: { query: string }) {
      const aclsetParams: Params = {
        query: {
          label: {
            $ilike: `%${query}%`,
          },
        },
      }
      /**
       * When we are on the workspaceAdmin.groups route
       */
      if (this.workspaceId) {
        aclsetParams.query!.workspace_id = this.workspaceId
      }

      const aclSetsMatched = await lckServices.aclset.find(aclsetParams) as Paginated<LckAclSet>
      this.aclSetSuggestions = aclSetsMatched.data.map(d => ({
        label: d.label,
        value: d.id,
      }))
    },
    async onSearchUser ({ query }: { query: string }) {
      const usersMatched = await lckServices.user.find({
        query: {
          blocked: false,
          name: {
            $ilike: `%${query}%`,
          },
        },
      }) as Paginated<LckUser>
      this.userSuggestions = usersMatched.data.map(d => ({
        label: d.name,
        value: d.id,
      }))
    },
  },
  watch: {
    groupId: {
      handler (newValue) {
        if (!newValue) return
        this.fetchGroup(newValue)
      },
      immediate: true,
    },
  },
}
</script>
