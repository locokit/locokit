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
            <p-dropdown v-model="slotProps.data['profile']" :options="profiles" optionLabel="label" optionValue="value" placeholder="Select a profile">
              <template #option="slotProps">
                <span>{{slotProps.option.label}}</span>
              </template>
            </p-dropdown>
          </template>
          <template #body="slotProps">
            {{getProfileLabel(slotProps.data.profile)}}
          </template>
        </p-column>
        <p-column headerClass="p-col-1" bodyClass="lck-datatable-button-group">
            <template #body="slotProps">
            <p-button icon="pi pi-pencil" class="p-button-rounded p-button-outlined p-mr-2" @click="editUser(slotProps.data)" />
            <p-button icon="pi pi-eye" class="p-button-rounded p-button-outlined p-disabled" />
          </template>
        </p-column>
      </p-datatable>
    </div>

    <div v-else class="p-d-flex p-flex-row p-flex-wrap p-jc-start">

      <p>{{ $t('pages.userManagement.noUser') }}</p>

    </div>

    <p-dialog :visible.sync="userDialog" :style="{width: '450px'}" :header="$t('pages.userManagement.userDetails')" :modal="true" class="p-fluid">
      <div class="p-field">
        <label for="first_name">{{ $t('pages.userManagement.firstName') }}</label>
        <p-input-text id="first_name" v-model.trim="user.first_name" required="true" autofocus :class="{'p-invalid': submitted && !user.first_name}" />
        <small class="p-invalid" v-if="submitted && !user.first_name">First Name is required.</small>
      </div>
      <div class="p-field">
        <label for="last_name">{{ $t('pages.userManagement.lastName') }}</label>
        <p-input-text id="last_name" v-model.trim="user.last_name" required="true" autofocus :class="{'p-invalid': submitted && !user.last_name}" />
        <small class="p-invalid" v-if="submitted && !user.last_name">Last Name is required.</small>
      </div>
      <div class="p-field">
        <label for="email">{{ $t('pages.userManagement.email') }}</label>
        <p-input-text id="email" v-model.trim="user.email" required="true" autofocus :class="{'p-invalid': submitted && !user.last_name}" />
        <small class="p-invalid" v-if="submitted && !user.email">Last Name is required.</small>
      </div>
      <p class="p-field">
        <label for="profile">{{ $t('pages.userManagement.profile') }}</label>
        <p-dropdown id="profile"
                    v-model.trim="user.profile"
                    :options="profiles"
                    optionLabel="label"
                    optionValue="value"
                    :placeholder="$t('pages.userManagement.selectProfile')">
          <template #option="slotProps">
            <span>{{slotProps.option.label}}</span>
          </template>
        </p-dropdown>
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
      <template #footer>
        <p-button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
        <p-button label="Save" icon="pi pi-check" class="p-button-text" @click="saveUser" />
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
import Vue from 'vue'
import { retrieveUsersData } from '@/store/userManagement'

export default {
  name: 'UserManagement',
  data () {
    return {
      loading: false,
      editingRows: [],
      columns: null,
      usersWithPagination: null,
      user: {},
      userDialog: false,
      profiles: [{ label: 'User', value: 'USER' }, { label: 'Admin', value: 'ADMIN' }, { label: 'SuperAdmin', value: 'SUPERADMIN' }]
    }
  },
  methods: {
    addUser () {
      this.user = {}
      this.submitted = false
      this.userDialog = true
    },
    hideDialog () {
      this.userDialog = false
      this.submitted = false
    },
    editUser (user) {
      this.user = { ...user }
      this.userDialog = true
    },
    saveUser (user) {
      this.user = { ...user }
      alert('saved')
    },
    inactiveUser (user) {
      this.user = { ...user }
      alert(this.user.id)
    },
    submitted () {
      alert(this.user.id)
    },
    getProfileLabel (profile) {
      switch (profile) {
        case 'USER':
          return 'User'

        case 'ADMIN':
          return 'Admin'

        case 'SUPERADMIN':
          return 'SuperAdmin'

        default:
          return 'NA'
      }
    },
    async onPage (event) {
      const res = await retrieveUsersData(event.page)
      if (res) this.usersWithPagination = res
    }
  },
  components: {
    'p-toolbar': Vue.extend(Toolbar),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'p-button': Vue.extend(Button),
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-text': Vue.extend(InputText),
    'p-dialog': Vue.extend(Dialog)
  },
  async mounted () {
    const res = await retrieveUsersData()
    if (res) this.usersWithPagination = res
  }

}

</script>

<style scoped>

</style>
