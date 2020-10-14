<template>
  <div
    class="p-mx-auto p-px-2"
  >
    <div class="lck-color-page-title p-my-4">
      <h1>{{ $t('pages.groupManagement.title') }}</h1>
    </div>

    <div
      class="p-d-flex p-flex-row p-flex-wrap p-jc-start"
      v-for="group in groups"
      :key="group.id"
    >
      <p-toolbar class="w-full p-my-4">
        <template slot="left">
          <h2>{{ group.name }}</h2>
          <span class="p-pl-1">
            (Espace de travail <strong>{{ group.workspace.text }}</strong>, chapitre  <strong>{{ group.chapter.text }}</strong>)
          </span>
        </template>

        <template slot="right">
          <p-button
            :label="$t('pages.groupManagement.form.action.addNewUserInGroup')"
            icon="pi pi-plus"
            class="p-mr-2"
            @click="addNewUserInGroup(group.id, group.name)"
          />
        </template>
      </p-toolbar>

      <p-datatable
        :value="group.users"
        :lazy="true"
        class="p-datatable-sm p-datatable-striped p-datatable-responsive editable-cell-table"
        :resizableColumns="true"
        columnResizeMode="fit"
      >
        <p-column
          field="name"
          :header="$t('pages.groupManagement.form.input.user')"
        />
        <p-column
          field="role"
          :header="$t('pages.groupManagement.form.input.role')"
        />
        <p-column headerClass="p-col-1" bodyClass="lck-datatable-button-group">
          <template #body="slotProps">
            <span class="p-buttonset">
              <p-button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-icon"
                @click="editUserInGroup(slotProps.data, group)"
                :title="$t('pages.userManagement.editUser')"
              />
              <p-button
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger p-button-outlined p-button-icon"
                @click="deleteUserInGroup(slotProps.data, group)"
                :title="$t('pages.userManagement.disableUser')"
              />
            </span>
          </template>
        </p-column>
      </p-datatable>
    </div>

    <p-dialog
      :visible.sync="openDialog"
      :contentStyle="{overflow: 'visible'}"
      :style="{width: '450px'}"
      :modal="true"
      class="p-fluid"
    >
      <template #header v-if="!isEditingUser">
        <h3>{{ $t('pages.groupManagement.form.text.addNewUserInGroup', {groupName: usergroup.groupName }) }}</h3>
      </template>
      <template #header v-else>
        <h3>{{ $t('pages.groupManagement.form.text.editUserInGroup', {groupName: usergroup.groupName, userName: usergroup.userName }) }}</h3>
      </template>

      <template v-if="submitted">
        <p>{{ $t('success.basic') }}</p>
      </template>
      <template v-else>
        <div class="p-field" v-if="!isEditingUser">
          <label for="userName">
            {{ $t('pages.groupManagement.form.input.user') }}
          </label>
          <lck-autocomplete
            id="userName"
            :dropdown="true"
            :placeholder="$t('pages.groupManagement.form.text.selectUser')"
            v-model="usergroup.user"
            field="label"
            :suggestions="autocompleteUserSuggestions"
            @complete="updateUserSuggestions"
            @item-select="usergroup.userId = $event.value.value"
          />
        </div>

        <div class="p-field">
          <label for="role">
            {{ $t('pages.groupManagement.form.input.role') }}
          </label>
          <p-dropdown
            id="role"
            v-model="usergroup.role"
            :options="allRoles"
            optionLabel="label"
            optionValue="value"
            required="true"
            :class="{'p-invalid': submitting && !usergroup.role}"
            :placeholder="$t('pages.groupManagement.form.text.selectUser')"
          >
            <template #option="slotProps">
              <span>{{slotProps.option.label}}</span>
            </template>
          </p-dropdown>
        </div>
      </template>

      <template #footer v-if="submitted">
        <p-button
          :label="$t('dialog.close')"
          icon="pi pi-check-circle"
          class="p-button-text"
          @click="hideDialog"
        />
      </template>
      <template #footer v-else>
        <div v-if="hasSubmitError">
          <p class="p-invalid">{{ $t('error.basic') }}</p>
        </div>

        <p-button
          :label="$t('dialog.close')"
          icon="pi pi-check-circle"
          class="p-button-text"
          @click="hideDialog"
        />
        <p-button
          v-if="(!submitting || hasSubmitError)"
          :label="$t('form.submit')"
          icon="pi pi-check"
          class="p-button-text"
          @click="submitUser"
        />
        <p-button
          disabled
          v-if="submitting && !hasSubmitError"
          :label="$t('form.submitting')"
          icon="pi pi-spin pi-spinner"
          class="p-button-text"
        />
      </template>
    </p-dialog>

    <p-dialog
      :header="$t('form.confirmation')"
      :visible.sync="openConfirmation"
      :style="{width: '450px'}"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span>{{ $t('pages.groupManagement.form.text.confirmationDeleteUser', { userName: usergroup.userName, groupName: usergroup.groupName }) }}</span>
      </div>
      <template #footer>
        <div v-if="hasSubmitError">
          <p class="p-invalid">{{ $t('error.basic') }}</p>
        </div>
        <p-button
          :label="$t('form.no')"
          icon="pi pi-times"
          @click="hideConfirmation"
          class="p-button-text"
        />
        <p-button
          :label="$t('form.yes')"
          icon="pi pi-check"
          @click="confirmDeleteUserInGroup"
          class="p-button-text"
          autofocus
        />
      </template>
    </p-dialog>
  </div>
</template>

<script>
import Vue from 'vue'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Toolbar from 'primevue/toolbar'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { GROUP_ROLE } from '@locokit/lck-glossary'
import AutoComplete from '@/components/ui/AutoComplete/AutoComplete'
import lckClient from '@/services/lck-api'

const defaultUsergroup = {
  userId: null,
  groupId: null,
  role: null
}

export default {
  name: 'GroupManagement',
  components: {
    'p-toolbar': Vue.extend(Toolbar),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'p-button': Vue.extend(Button),
    'p-dropdown': Vue.extend(Dropdown),
    'p-dialog': Vue.extend(Dialog),
    'lck-autocomplete': Vue.extend(AutoComplete)
  },
  data: function () {
    return {
      groups: [],
      openDialog: false,
      openConfirmation: false,
      isEditingUser: null,
      usergroup: {
        ...defaultUsergroup
      },
      allRoles: Object.keys(GROUP_ROLE).map(key => ({ label: key, value: key })),
      allUsers: [],
      submitting: false,
      submitted: false,
      hasSubmitError: false,
      autocompleteUserSuggestions: []
    }
  },
  methods: {
    hideDialog () {
      this.openDialog = false
      this.submitting = false
      this.submitted = false
      this.hasSubmitError = false
    },
    hideConfirmation () {
      this.openConfirmation = false
      this.hasSubmitError = false
    },
    addNewUserInGroup (groupId, groupName) {
      this.isEditingUser = false
      this.openDialog = true
      this.usergroup = {
        ...defaultUsergroup,
        groupId,
        groupName
      }
      this.submitted = false
    },
    editUserInGroup (data, group) {
      this.isEditingUser = true
      this.openDialog = true
      this.usergroup = {
        ...defaultUsergroup,
        userId: data.id,
        userName: data.name,
        groupId: group.id,
        groupName: group.name,
        role: data.role
      }
      this.submitted = false
    },
    deleteUserInGroup (data, group) {
      this.openConfirmation = true
      this.usergroup = {
        ...defaultUsergroup,
        userId: data.id,
        userName: data.name,
        groupId: group.id,
        groupName: group.name,
        role: data.role
      }
    },
    async confirmDeleteUserInGroup () {
      try {
        return await lckClient.service('usergroup').remove(
          `${this.usergroup.userId},${this.usergroup.groupId}`
        )
      } catch ({ code, name }) {
        this.hasSubmitError = true
      }
      await this.loadCurrentGroupsWithUser()
      this.openConfirmation = false
      this.hasSubmitError = false
    },
    async submitUser () {
      this.submitting = true
      try {
        if (this.isEditingUser) {
          await lckClient.service('usergroup').patch(
            `${this.usergroup.userId},${this.usergroup.groupId}`,
            { role: this.usergroup.role }
          )
        } else {
          await lckClient.service('usergroup').create({
            // eslint-disable-next-line @typescript-eslint/camelcase
            user_id: this.usergroup.userId,
            // eslint-disable-next-line @typescript-eslint/camelcase
            group_id: this.usergroup.groupId,
            role: this.usergroup.role
          })
        }
      } catch ({ code, name }) {
        this.hasSubmitError = true
        return { code, name }
      }
      this.submitted = true
      this.submitting = false
      this.hasSubmitError = false
      await this.loadCurrentGroupsWithUser()
    },
    async loadCurrentGroupsWithUser () {
      const groups = await lckClient.service('group').find({
        query: {
          $eager: '[users,workspace,chapter]'
        }
      })
      this.groups = groups.data
    },
    async updateUserSuggestions ({ query }) {
      const usersMatched = await lckClient.service('user').find({
        query: {
          blocked: false,
          name: {
            $ilike: `%${query}%`
          }
        }
      })
      this.autocompleteUserSuggestions = usersMatched.data.map(d => ({
        label: d.name,
        value: d.id
      }))
    }
  },
  async mounted () {
    await this.loadCurrentGroupsWithUser()
  }
}
</script>
