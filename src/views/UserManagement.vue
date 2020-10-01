<template>
  <div
      class="p-mx-auto p-px-2"
  >
    <div class="lck-color-page-title p-my-4">
      <h1>{{ $t('pages.userManagement.title') }}</h1>
    </div>

    <div
      class="p-d-flex p-flex-row p-flex-wrap p-jc-start"
    >
      <p-toolbar class="w-full p-my-4">
        <template slot="right">
          <p-button :label="$t('pages.userManagement.addNewUser')" icon="pi pi-plus" class="p-mr-2" @click="addUser" />
        </template>
      </p-toolbar>

      <p-datatable
        v-if="usersWithPagination && usersWithPagination.data.length > 0"
        :value="usersWithPagination.data"
        :paginator="true"
        :lazy="true"
        :rows="usersWithPagination.limit"
        :totalRecords="usersWithPagination.total"
        class="p-datatable-sm p-datatable-striped p-datatable-responsive editable-cell-table"
        :resizableColumns="true"
        columnResizeMode="fit"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        :currentPageReportTemplate="$t('components.paginator.currentPageReportTemplate')"
        @page="onPage($event)"
      >
        <p-column
          field="id"
            headerClass="lck-datatable-align-center p-col-1"
            bodyClass="lck-datatable-align-center"
            :header="$t('pages.userManagement.id')"
            sortable
          >
        </p-column>
        <p-column
          field="name"
          :header="$t('pages.userManagement.name')"
          sortable
        >
          <template #editor="slotProps">
            <p-input-text v-model="slotProps.data[slotProps.column.field]" />
          </template>
        </p-column>
        <p-column
          field="email"
          :header="$t('pages.userManagement.email')"
          sortable
        >
          <template #editor="slotProps">
            <p-input-text v-model="slotProps.data[slotProps.column.field]" />
          </template>
        </p-column>
        <p-column
          field="profile"
          headerClass="p-col-1"
          :header="$t('pages.userManagement.profile')"
          sortable
        >
          <template #editor="slotProps">
            <p-dropdown
              v-model="slotProps.data['profile']"
              :options="profiles" optionLabel="label"
              optionValue="value"
              placeholder="$t('page.userManagement.selectProfile"
            >
              <template #option="slotProps">
                <span>{{slotProps.option.label}}</span>
              </template>
            </p-dropdown>
          </template>
          <template #body="slotProps">
             {{ slotProps.data['profile'] }}
          </template>
        </p-column>
        <p-column
          headerClass="p-col-1"
          bodyClass="lck-datatable-button-group"
        >
          <template #body="slotProps">
            <span class="p-buttonset">
              <p-button
                icon="pi pi-pencil"
                class="p-button-rounded p-button p-mr-2"
                @click="editUser(slotProps.data)"
                :title="$t('pages.userManagement.editUser')"
              />
              <p-button icon="pi pi-eye" class="p-button-rounded p-button-outlined p-disabled" :title="$t('pages.userManagement.disableUser')" />
            </span>
          </template>
        </p-column>
      </p-datatable>
      <div v-else class="p-d-flex p-flex-row p-flex-wrap p-jc-start">
        <p>{{ $t('pages.userManagement.noUser') }}</p>
      </div>
    </div>

    <p-dialog
      :visible.sync="openDialog"
      :style="{width: '450px'}"
      :contentStyle="{overflow: 'visible'}"
      :modal="true"
      class="p-fluid"
    >
      <template #header v-if="!editingUser">
        <h3>{{ $t('pages.userManagement.createUserDetails') }}</h3>
      </template>
      <template #header v-else>
        <h3>{{ $t('pages.userManagement.editUserDetails') }}</h3>
      </template>

      <template v-if="submitted">
        <p>{{ $t('success.basic') }}</p>
      </template>
      <template v-else>
        <div class="p-field">
          <label for="name">{{ $t('pages.userManagement.name') }}</label>
          <p-input-text id="name"
            v-model.trim="user.name"
            required="true"
            autofocus
            :class="{'p-invalid': submitting && !user.name}"
          />
        </div>
        <div class="p-field">
          <label for="email">
            {{ $t('pages.userManagement.email') }}
          </label>
          <p-input-text
            id="email"
            type="email"
            v-model.trim="user.email"
            required="true"
            autofocus
            :class="{'p-invalid': submitting && !user.email}"
          />
        </div>
        <div class="p-field" v-if="!editingUser">
          <label for="password">
            {{ $t('pages.userManagement.password') }}
          </label>
          <p-password
            id="password"
            v-model.trim="user.password"
            required="true"
            autofocus
            :class="{'p-invalid': submitting && !user.password}"
          />
        </div>
        <p class="p-field">
          <label for="profile">{{ $t('pages.userManagement.profile') }}</label>
          <p-dropdown
            id="profile"
            v-model.trim="user.profile"
            :options="profiles"
            optionLabel="label"
            optionValue="value"
            required="true"
            :class="{'p-invalid': submitting && !user.profile}"
            :placeholder="$t('pages.userManagement.selectProfile')"
          >
            <template #option="slotProps">
              <span>{{slotProps.option.label}}</span>
            </template>
          </p-dropdown>
        </p>
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
          :label="$t('form.cancel')"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
        <p-button
          v-if="!submitting || hasSubmitError"
          :label="$t(`pages.userManagement.buttons.${ editingUser ? 'editUser' : 'newUser'}`)"
          icon="pi pi-check"
          class="p-button-text"
          @click="saveUser"
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
  </div>
</template>

<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Toolbar from 'primevue/toolbar'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Password from 'primevue/password'
import Vue from 'vue'
import {
  retrieveUsersData
} from '@/store/userManagement'
import { USER_PROFILE } from '@locokit/lck-glossary'
import lckClient from '@/services/lck-api'

export default {
  name: 'UserManagement',
  components: {
    'p-toolbar': Vue.extend(Toolbar),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'p-button': Vue.extend(Button),
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-text': Vue.extend(InputText),
    'p-dialog': Vue.extend(Dialog),
    'p-password': Vue.extend(Password)
  },
  data: function () {
    return {
      usersWithPagination: null,
      user: {},
      openDialog: false,
      editingUser: null,
      submitting: false,
      submitted: false,
      hasSubmitError: false,
      profiles: Object.keys(USER_PROFILE).map(key => ({ label: key, value: key })),
      currentPage: 0
    }
  },
  methods: {
    addUser () {
      this.user = {}
      this.submitted = false
      this.editingUser = false
      this.openDialog = true
    },
    hideDialog () {
      this.openDialog = false
      this.submitting = false
      this.submitted = false
      this.hasSubmitError = false
    },
    editUser (user) {
      this.user = {
        id: user.id,
        name: user.name,
        profile: user.profile,
        email: user.email
      }
      this.submitted = false
      this.editingUser = true
      this.openDialog = true
    },
    async saveUser () {
      this.submitting = true
      try {
        if (this.editingUser) {
          const userId = this.user.id
          await lckClient.service('user').patch(userId, this.user)
        } else {
          await lckClient.service('user').create(this.user)
        }
        this.submitted = true
        this.submitting = false
        this.retrieveUsersData()
      } catch (e) {
        this.hasSubmitError = true
      }
    },
    inactiveUser (user) {
      this.user = { ...user }
      alert(this.user.id)
    },
    async retrieveUsersData () {
      const res = await retrieveUsersData(this.currentPage)
      if (res) this.usersWithPagination = res
    },
    async onPage (event) {
      this.currentPage = event.page
      this.retrieveUsersData()
    }
  },
  async mounted () {
    this.retrieveUsersData()
  }
}
</script>
