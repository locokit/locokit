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
                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                       :currentPageReportTemplate="$t('components.paginator.currentPageReportTemplate')">
        <prime-column field="first_name" :header="$t('pages.userManagement.firstName')"></prime-column>
        <prime-column field="last_name" :header="$t('pages.userManagement.lastName')"></prime-column>
        <prime-column field="email" :header="$t('pages.userManagement.email')"></prime-column>
        <prime-column field="profile" :header="$t('pages.userManagement.profile')"></prime-column>
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
export default {
  name: 'UserManagement',
  data () {
    return {
      users: null
    }
  },
  components: {
    'prime-datatable': Vue.extend(DataTable),
    'prime-column': Vue.extend(Column)
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
