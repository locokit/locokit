<template>
  <div class="p-mx-auto p-px-2">
    <div class="lck-color-primary p-my-4">
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
            (
            {{ $t('pages.groupManagement.form.text.workspace') }}<strong> {{ group.aclset.workspace.text }}</strong>
            <span v-if="group.aclset.chapter">,
              {{ $t('pages.groupManagement.form.text.chapter') }} <strong>{{ group.aclset.chapter.text }}</strong>
            </span>
            )
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
          field="uhg_role"
          :header="$t('pages.groupManagement.form.input.role')"
        />
        <p-column
          field="isVerified"
          :header="$t('pages.userManagement.isVerified')"
          sortField="isVerified"
          sortable
        >
          <template #body="slotProps">
            <p-checkbox
              :binary="true"
              :modelValue="slotProps.data.isVerified"
              :disabled="true"
            />
          </template>
        </p-column>
        <p-column
          headerClass="p-col-1"
          bodyClass="p-text-center"
        >
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
                :title="$t('pages.userManagement.disableUser.disable')"
              />
            </span>
          </template>
        </p-column>
      </p-datatable>
    </div>

    <lck-dialog-form
      :visible.sync="openDialog"
      :header="isEditingUser ? $t('pages.groupManagement.form.text.editUserInGroup', {groupName: usergroup.groupName, userName: usergroup.userName }) : $t('pages.groupManagement.form.text.addNewUserInGroup', {groupName: usergroup.groupName })
    "
      @close="hideDialog"
      :submitting="submitting"
      :contentStyle="{ 'overflow-y': 'visible' }"
      @input="submitUser"
      class="p-fluid"
    >
      <template>
        <validation-provider
          v-if="!isEditingUser"
          vid="userName"
          tag="div"
          :name="$t('pages.groupManagement.form.input.user')"
          class="p-field"
          rules="required"
          v-slot="{
            errors,
            classes
          }"
        >
          <label for="userName">
            {{ $t('pages.groupManagement.form.input.user') }}
          </label>
          <span class="field-required">*</span>
          <lck-autocomplete
            id="userName"
            :dropdown="true"
            :placeholder="$t('pages.groupManagement.form.text.selectUser')"
            v-model="usergroup.userName"
            field="label"
            :suggestions="autocompleteUserSuggestions"
            @complete="updateUserSuggestions"
            @item-select="usergroup.userId = $event.value.value"
            @clear="usergroup.userId = null"
          />
          <span :class="classes">{{ errors[0] }}</span>
        </validation-provider>
        <validation-provider
          vid="role"
          tag="div"
          class="p-field"
        >
          <label for="role">
            {{ $t('pages.groupManagement.form.input.role') }}
          </label>
          <p-dropdown
            id="role"
            v-model="usergroup.role"
            :options="allRoles"
            optionLabel="label"
            optionValue="value"
            :class="{'p-invalid': submitting && !usergroup.role}"
            :placeholder="$t('pages.groupManagement.form.text.selectUser')"
          >
            <template #option="slotProps">
              <span>{{slotProps.option.label}}</span>
            </template>
          </p-dropdown>
        </validation-provider>
        <validation-provider
          v-if="isEditingUser"
          vid="isVerified"
          tag="div"
          class="p-field"
        >
          <label for="isVerified">
            {{ $t("pages.userManagement.isVerified") }}
          </label>
          <p-checkbox
            class="p-field-checkbox"
            id="isVerified"
            :binary="true"
            v-model="usergroup.userIsVerified"
            :disabled="true"
          />
        </validation-provider>
        <div v-if="hasSubmitError">
          <p class="p-invalid">{{ $t('error.basic') }}</p>
        </div>
      </template>
    </lck-dialog-form>

    <p-dialog
      :header="$t('form.confirmation')"
      :visible.sync="openConfirmation"
      :style="{width: '450px'}"
      :modal="true"
    >
      <div class="confirmation-content">
        <i
          class="pi pi-exclamation-triangle p-mr-3"
          style="font-size: 2rem"
        />
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
/* eslint-disable @typescript-eslint/camelcase */
import Vue from 'vue'

import { ValidationProvider } from 'vee-validate'
import { GROUP_ROLE } from '@locokit/lck-glossary'

import { lckClient } from '@/services/lck-api'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Toolbar from 'primevue/toolbar'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Checkbox from 'primevue/checkbox'

import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'
import DialogForm from '@/components/ui/DialogForm/DialogForm.vue'

const defaultUsergroup = {
  userId: null,
  groupId: null,
  role: GROUP_ROLE.MEMBER,
}

export default {
  name: 'GroupManagement',
  components: {
    'lck-autocomplete': AutoComplete,
    'lck-dialog-form': DialogForm,
    'p-toolbar': Vue.extend(Toolbar),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'p-button': Vue.extend(Button),
    'p-checkbox': Vue.extend(Checkbox),
    'p-dropdown': Vue.extend(Dropdown),
    'p-dialog': Vue.extend(Dialog),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  data: function () {
    return {
      groups: [],
      openDialog: false,
      openConfirmation: false,
      isEditingUser: null,
      usergroup: {
        ...defaultUsergroup,
      },
      allRoles: Object.keys(GROUP_ROLE).map(key => ({ label: key, value: key })),
      allUsers: [],
      submitting: false,
      hasSubmitError: false,
      autocompleteUserSuggestions: [],
    }
  },
  methods: {
    hideDialog () {
      this.openDialog = false
      this.submitting = false
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
        groupName,
      }
    },
    editUserInGroup (data, group) {
      this.isEditingUser = true
      this.openDialog = true
      this.usergroup = {
        ...defaultUsergroup,
        userId: data.id,
        userName: data.name,
        userIsVerified: data.isVerified,
        groupId: group.id,
        groupName: group.name,
        role: data.uhg_role,
      }
    },
    deleteUserInGroup (data, group) {
      this.openConfirmation = true
      this.usergroup = {
        ...defaultUsergroup,
        userId: data.id,
        userName: data.name,
        groupId: group.id,
        groupName: group.name,
        role: data.uhg_role,
      }
    },
    async confirmDeleteUserInGroup () {
      try {
        await lckClient.service('usergroup').remove(
          `${this.usergroup.userId},${this.usergroup.groupId}`,
        )
      } catch ({ code, name }) {
        this.hasSubmitError = true
        return { code, name }
      }
      this.hideConfirmation()
      await this.loadCurrentGroupsWithUser()
    },
    async submitUser () {
      this.submitting = true
      try {
        if (this.isEditingUser) {
          await lckClient.service('usergroup').patch(
            `${this.usergroup.userId},${this.usergroup.groupId}`,
            { uhg_role: this.usergroup.role },
          )
        } else {
          await lckClient.service('usergroup').create({
            user_id: this.usergroup.userId,
            group_id: this.usergroup.groupId,
            uhg_role: this.usergroup.role,
          })
        }
      } catch ({ code, name }) {
        this.hasSubmitError = true
        return { code, name }
      }
      this.hideDialog()
      await this.loadCurrentGroupsWithUser()
    },
    async loadCurrentGroupsWithUser () {
      this.groups = await lckClient.service('group').find({
        query: {
          $eager: '[users,aclset.[workspace, chapter]]',
          $limit: -1,
        },
      })
    },
    async updateUserSuggestions ({ query }) {
      const usersMatched = await lckClient.service('user').find({
        query: {
          blocked: false,
          name: {
            $ilike: `%${query}%`,
          },
        },
      })
      this.autocompleteUserSuggestions = usersMatched.data.map(d => ({
        label: d.name,
        value: d.id,
      }))
    },
  },
  async mounted () {
    await this.loadCurrentGroupsWithUser()
  },
}
</script>
