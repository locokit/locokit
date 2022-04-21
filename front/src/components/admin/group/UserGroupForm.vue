<template>
  <p-card >
    <template #title>
      {{ group.name || $t('components.userGroupForm.createTitle') }}
    </template>
    <template #content>

      <span v-if="group.aclset">
        {{ $t('pages.groupManagement.form.text.workspace') }}<strong> {{ group.aclset.workspace.text }}</strong>
        <span>,
          {{ $t('pages.groupManagement.form.text.aclset') }} <strong>{{ group.aclset.label }}</strong>
        </span>
        <span v-if="group.aclset.chapter">,
          {{ $t('pages.groupManagement.form.text.chapter') }} <strong>{{ group.aclset.chapter.text }}</strong>
        </span>
      </span>

      <lck-form
        @cancel="$emit('cancel')"
        @submit="$emit('input', groupCloned)"
        :submitting="submitting"
      >
        <validation-provider
          vid="name"
          tag="div"
          class="p-field"
          :name="$t('components.userGroupForm.fields.name')"
          rules="required"
          v-slot="{
            errors,
            classes
          }"
        >
          <label for="name" class="label-field-required">
            {{ $t('components.userGroupForm.fields.name') }}
          </label>
          <p-input-text
            id="name"
            type="text"
            v-model="groupCloned.name"
            :placeholder="$t('components.userGroupForm.fields.namePlaceholder')"
          />
          <span :class="classes">{{ errors[0] }}</span>
        </validation-provider>
        <validation-provider
          vid="aclset"
          tag="div"
          :name="$t('components.userGroupForm.fields.aclSet')"
          class="p-field"
          rules="required"
          v-slot="{
            errors,
            classes
          }"
        >
          <label for="aclset" class="label-field-required">
            {{ $t('components.userGroupForm.fields.aclSet') }}
          </label>
          <lck-autocomplete
            id="aclset"
            :dropdown="true"
            :placeholder="$t('components.userGroupForm.fields.aclSetPlaceholder')"
            field="label"
            :suggestions="aclSetSuggestions"
            v-model="groupCloned.aclset"
            @item-select="groupCloned.aclset_id = $event.value.value"
            @search="$emit('search-aclset', $event)"
            @clear="groupCloned.aclset_id = null"
          />
          <span :class="classes">{{ errors[0] }}</span>
        </validation-provider>
      </lck-form>

      <p-button
        :label="$t('pages.groupManagement.form.action.addNewUserInGroup')"
        icon="pi pi-plus"
        class="p-my-2"
        @click="addNewUserInGroup(group.id, group.name)"
        v-if="group.id"
      />

      <p-datatable
        :value="group.users"
        :lazy="true"
        class="p-mx-auto"
        :resizableColumns="true"
        columnResizeMode="fit"
        v-if="group.id"
      >
        <p-column
          field="name"
          :header="$t('pages.groupManagement.form.input.user')"
        />
        <p-column
          field="uhg_role"
          headerStyle="width: 8rem"
          :header="$t('pages.groupManagement.form.input.role')"
        />
        <p-column
          field="isVerified"
          headerStyle="width: 5rem"
          :header="$t('pages.userManagement.isVerified')"
          sortField="isVerified"
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
          headerStyle="width: 8rem"
          bodyClass="p-text-center"
        >
          <template #body="slotProps">
            <span class="p-buttonset">
              <p-button
                icon="bi bi-pencil"
                class="p-button-text p-button-icon"
                @click="editUserInGroup(slotProps.data, group)"
                :title="$t('pages.userManagement.editUser')"
              />
              <p-button
                icon="bi bi-trash"
                class="p-button-text p-button-danger p-button-outlined p-button-icon"
                @click="deleteUserInGroup(slotProps.data, group)"
                :title="$t('pages.userManagement.disableUser.disable')"
              />
            </span>
          </template>
        </p-column>
      </p-datatable>

      <lck-dialog-form
        :visible.sync="openDialog"
        :header="isEditingUser ? $t('pages.groupManagement.form.text.editUserInGroup', {groupName: usergroup.groupName, userName: usergroup.userName }) : $t('pages.groupManagement.form.text.addNewUserInGroup', {groupName: usergroup.groupName })"
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
            <label for="userName" class="label-field-required">
              {{ $t('pages.groupManagement.form.input.user') }}
            </label>
            <lck-autocomplete
              id="userName"
              :dropdown="true"
              :placeholder="$t('pages.groupManagement.form.text.selectUser')"
              v-model="usergroup.userName"
              field="label"
              :suggestions="userSuggestions"
              @search="$emit('search-user', $event)"
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
    </template>
  </p-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { LckGroup, LckUser, LckUserGroup } from '@/services/lck-api/definitions'
import { ValidationProvider } from 'vee-validate'
import { GROUP_ROLE } from '@locokit/lck-glossary'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Checkbox from 'primevue/checkbox'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'

import Form from '@/components/ui/Form/Form.vue'
import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'
import DialogForm from '@/components/ui/DialogForm/DialogForm.vue'

const defaultUsergroup: {
  userId?: string;
  userName?: string;
  userIsVerified?: boolean;
  groupId?: string;
  groupName?: string;
  role: GROUP_ROLE;
} = {
  role: GROUP_ROLE.MEMBER,
}

export default Vue.extend({
  name: 'WorkspaceAdminUserGroupForm',
  components: {
    'lck-autocomplete': AutoComplete,
    'lck-form': Form,
    'lck-dialog-form': DialogForm,
    'p-card': Vue.extend(Card),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'p-button': Vue.extend(Button),
    'p-checkbox': Vue.extend(Checkbox),
    'p-dropdown': Vue.extend(Dropdown),
    'p-dialog': Vue.extend(Dialog),
    'p-input-text': Vue.extend(InputText),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    group: {
      type: Object,
      required: true,
    } as Vue.PropOptions<LckGroup>,
    submitting: {
      type: Boolean,
    },
    aclSetSuggestions: {
      type: Array,
      required: false,
      default () { return [] },
    },
    userSuggestions: {
      type: Array,
      required: false,
      default () { return [] },
    },
  },
  data: function () {
    return {
      groupCloned: new LckGroup(),
      openDialog: false,
      openConfirmation: false,
      isEditingUser: false,
      usergroup: {
        ...defaultUsergroup,
      },
      allRoles: Object.keys(GROUP_ROLE).map(key => ({ label: key, value: key })),
    }
  },
  methods: {
    hideDialog () {
      this.openDialog = false
    },
    hideConfirmation () {
      this.openConfirmation = false
    },
    addNewUserInGroup (groupId: string, groupName: string) {
      this.isEditingUser = false
      this.openDialog = true
      this.usergroup = {
        ...defaultUsergroup,
        groupId,
        groupName,
      }
    },
    editUserInGroup (data: LckUser & LckUserGroup, group: LckGroup) {
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
    deleteUserInGroup (data: LckUser & LckUserGroup, group: LckGroup) {
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
      this.$emit('delete-usergroup', this.usergroup.userId, this.usergroup.groupId)
      this.hideConfirmation()
    },
    async submitUser () {
      if (this.isEditingUser) {
        this.$emit('update-usergroup', this.usergroup.userId, this.usergroup.groupId, this.usergroup.role)
      } else {
        this.$emit('create-usergroup', this.usergroup.userId, this.usergroup.groupId, this.usergroup.role)
      }
      this.hideDialog()
    },
  },
  watch: {
    group: {
      handler (newValue: LckGroup) {
        if (!newValue) return
        // eslint-disable-next-line @typescript-eslint/camelcase
        this.groupCloned = {
          id: newValue.id,
          name: newValue.name,
          // eslint-disable-next-line @typescript-eslint/camelcase
          aclset_id: newValue.aclset_id,
          aclset: undefined,
        }
        if (newValue.aclset) {
          this.groupCloned.aclset = { ...newValue.aclset }
        }
      },
      immediate: true,
    },
  },
})
</script>
