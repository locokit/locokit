<template>
  <div
      class="p-mx-auto p-px-2"
  >
    <div class="lck-color-page-title p-my-4">
      <h1>{{ $t('pages.userManagement.title') }}</h1>
    </div>
    <div v-if="users" class="p-d-flex p-flex-row p-flex-wrap p-jc-start">
      <prime-datatable :value="users" :paginator="true" :rows="10"
                       class="p-datatable-sm p-datatable-striped p-datatable-responsive"
                       :resizableColumns="true" columnResizeMode="fit"
                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                       :currentPageReportTemplate="$t('components.paginator.currentPageReportTemplate')">
        <prime-column field="id" headerClass="lck-datatable-align-center p-col-1" bodyClass="lck-datatable-align-center" :header="$t('pages.userManagement.id')" sortable></prime-column>
        <prime-column field="first_name" :header="$t('pages.userManagement.firstName')" sortable></prime-column>
        <prime-column field="last_name" :header="$t('pages.userManagement.lastName')" sortable></prime-column>
        <prime-column field="email" :header="$t('pages.userManagement.email')" sortable></prime-column>
        <prime-column field="profile" headerClass="p-col-1"  :header="$t('pages.userManagement.profile')" sortable></prime-column>
        <prime-column headerClass="p-col-1" bodyClass="lck-datatable-button-group">
            <template #body="slotProps">
            <prime-button icon="pi pi-pencil" class="p-button-rounded p-button-outlined p-mr-2" @click="editUser(slotProps.data)" />
            <prime-button icon="pi pi-trash" class="p-button-rounded p-button-outlined" @click="confirmDeleteUser(slotProps.data)" />
          </template>
        </prime-column>
      </prime-datatable>
    </div>

    <div v-else class="p-d-flex p-flex-row p-flex-wrap p-jc-start">
      <p>{{ $t('pages.userManagement.noUser') }}</p>
    </div>
  </div>
</template>

<script>
import lckClient from '@/services/lck-api'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Vue from 'vue'
import Button from 'primevue/button'
export default {
  name: 'UserManagement',
  data () {
    return {
      users: null
    }
  },
  methods: {
    editUser (user) {
      this.user = { ...user }
      alert(this.user.id)
    },
    confirmDeleteUser (user) {
      this.user = { ...user }
      alert(this.user.id)
    }
  },
  components: {
    'prime-datatable': Vue.extend(DataTable),
    'prime-column': Vue.extend(Column),
    'prime-button': Vue.extend(Button)
  },
  async mounted () {
    // eslint-disable-next-line no-undef
    const usersList = await lckClient.service('user').find()
    if (usersList && usersList.data) {
      this.users = usersList.data
    }
  }
}

</script>

<style scoped>

</style>
