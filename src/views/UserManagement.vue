<template>
  <div
      class="p-mx-auto p-px-2"
  >
    <div class="lck-color-page-title p-my-4">
      <h1>{{ $t('pages.userManagement.title') }}</h1>
    </div>

    <div v-if="usersWithPagination && usersWithPagination.data.length > 0" class="p-d-flex p-flex-row p-flex-wrap p-jc-start">
      <p-toolbar class="w-full p-my-4">
        <template slot="left">
        </template>

        <template slot="right">
          <p-button :label="$t('pages.userManagement.addNewUser')" icon="pi pi-plus" class="p-mr-2" @click="addUser" />
        </template>
      </p-toolbar>
      <p-datatable
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
        <p-column field="id" headerClass="lck-datatable-align-center p-col-1" bodyClass="lck-datatable-align-center" :header="$t('pages.userManagement.id')" sortable>
        </p-column>
        <p-column field="first_name" :header="$t('pages.userManagement.firstName')" sortable>
          <template #editor="slotProps">
            <p-input-text v-model="slotProps.data[slotProps.column.field]" />
          </template>
        </p-column>
        <p-column field="last_name" :header="$t('pages.userManagement.lastName')" sortable>
          <template #editor="slotProps">
            <p-input-text v-model="slotProps.data[slotProps.column.field]" />
          </template>
        </p-column>
        <p-column field="email" :header="$t('pages.userManagement.email')" sortable>
          <template #editor="slotProps">
            <p-input-text v-model="slotProps.data[slotProps.column.field]" />
          </template>
        </p-column>
        <p-column field="profile" headerClass="p-col-1"  :header="$t('pages.userManagement.profile')" sortable>
          <template #editor="slotProps">
            <p-dropdown v-model="slotProps.data['profile']" :options="profiles" optionLabel="label" optionValue="value" placeholder="$t('page.userManagement.selectProfile">
              <template #option="slotProps">
                <span>{{slotProps.option.label}}</span>
              </template>
            </p-dropdown>
          </template>
          <template #body="slotProps">
             {{ slotProps.data['profile'] }}
          </template>
        </p-column>
        <p-column headerClass="p-col-1" bodyClass="lck-datatable-button-group">
          <template #body="slotProps">
            <span class="p-buttonset">
              <p-button icon="pi pi-pencil" class="p-button-rounded p-button p-mr-2" @click="editUser(slotProps.data)" :title="$t('pages.userManagement.editUser')"/>
              <p-button icon="pi pi-eye" class="p-button-rounded p-button-outlined p-disabled" :title="$t('pages.userManagement.disableUser')" />
            </span>
          </template>
        </p-column>
      </p-datatable>
    </div>

    <div v-else class="p-d-flex p-flex-row p-flex-wrap p-jc-start">

      <p>{{ $t('pages.userManagement.noUser') }}</p>

    </div>
    <p-dialog
      :visible.sync="openDialog"
      :style="{width: '450px'}"
      :modal="true"
      class="p-fluid">
      <template #header v-if="!editingUser">
        <h3>{{ $t('pages.userManagement.createUserDetails') }}</h3>
      </template>
      <template #header v-else>
        <h3>{{ $t('pages.userManagement.editUserDetails') }}</h3>
      </template>
      <template v-if="submitted">
        <p align="center">{{ $t('success.basic') }}</p>
      </template>
      <template v-else>
        <div class="p-field">
          <label for="first_name">{{ $t('pages.userManagement.firstName') }}</label>
          <p-input-text id="first_name" v-model.trim="user.first_name" required="true" autofocus :class="{'p-invalid': submitting && !user.first_name}" />
          <small class="p-invalid" v-if="submitting && !user.first_name">{{ $t('pages.userManagement.isRequired') }}..</small>
        </div>
        <div class="p-field">
          <label for="last_name">{{ $t('pages.userManagement.lastName') }}</label>
          <p-input-text id="last_name" v-model.trim="user.last_name" required="true" autofocus :class="{'p-invalid': submitting && !user.last_name}" />
          <small class="p-invalid" v-if="submitting && !user.last_name">{{$t('pages.userManagement.isRequired') }}.</small>
        </div>
        <div class="p-field">
          <label for="email">{{ $t('pages.userManagement.email') }}</label>
          <p-input-text id="email" v-model.trim="user.email" required="true" autofocus :class="{'p-invalid': submitting && !user.last_name}" />
          <small class="p-invalid" v-if="submitting && !user.email">{{ $t('pages.userManagement.isRequired') }}.</small>
        </div>
        <div class="p-field" v-if="!editingUser">
          <label for="password">{{ $t('pages.userManagement.password') }}</label>
          <p-password id="password" v-model.trim="user.password" required="true" autofocus :class="{'p-invalid': submitting && !user.last_name}" />
          <small class="p-invalid" v-if="submitting && !user.password">{{ $t('pages.userManagement.isRequired') }}.</small>
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
          <small class="p-invalid" v-if="submitting && !user.profile">{{ $t('pages.userManagement.isRequired') }}.</small>

        </p>
        <p class="p-field">
          <label>Groupes</label>
        </p>
        <p><em>TODO : ajouter les groupes</em></p>
        <div class="p-formgrid p-grid">
          <div class="p-field p-col">
          </div>
          <div class="p-field p-col">
          </div>
        </div>
      </template>

      <template #footer v-if="submitted">
        <p-button :label="$t('dialog.close')" icon="pi pi-check-circle" class="p-button-text" @click="hideDialog"/>

      </template>
      <template #footer v-else>
        <p-button
          :label="$t('form.cancel')"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
        <p-button
          v-if="!submitting"
          :label="$t(`pages.userManagement.buttons.${ editingUser ? 'editUser' : 'newUser'}`)"
          icon="pi pi-check"
          class="p-button-text"
          @click="saveUser"
        />
        <p-button
          disabled
          v-if="submitting"
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
  retrieveUsersData,
  createUser,
  updateUser
} from '@/store/userManagement'
import { USER_PROFILE } from '@locokit/lck-glossary'

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
      loading: false,
      editingRows: [],
      columns: null,
      usersWithPagination: null,
      user: {},
      openDialog: false,
      editingUser: null,
      submitting: false,
      submitted: false,
      profiles: Object.keys(USER_PROFILE).map(key => ({ label: key, value: key }))
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
    },
    editUser (user) {
      this.user = { ...user }
      this.submitted = false
      this.editingUser = true
      this.openDialog = true
    },
    async saveUser (error) {
      this.submitting = true
      const res = await error
      if (this.editingUser) {
        const userId = this.user.id
        await updateUser(userId, this.user)
      } else {
        await createUser(this.user)
      }
      if (res) alert(res)
      this.submitted = true
    },
    inactiveUser (user) {
      this.user = { ...user }
      alert(this.user.id)
    },
    async onPage (event) {
      const res = await retrieveUsersData(event.page)
      if (res) this.usersWithPagination = res
    }
  },
  async mounted () {
    const res = await retrieveUsersData()
    if (res) this.usersWithPagination = res
  }
}

</script>

<style scoped>

</style>
