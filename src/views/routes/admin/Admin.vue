<template>
  <div class="p-grid h-full">
    <div class="sidebar-menu-container lck-bg-primary o-auto h-max-full">
      <Sidebar :items="items" />
    </div>
    <div class="main-container h-full p-col o-auto h-max-full">
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/visualize/Sidebar/Sidebar'
import { ROUTES_PATH } from '@/router/paths'

export default {
  name: 'Admin',
  components: { Sidebar },
  computed: {
    items () {
      return [{
        id: 0,
        label: this.$t('pages.admin.sidebar.usersAndGroups'),
        active: true,
        subitems: [{
          id: 0,
          label: this.$t('pages.userManagement.title'),
          to: `${ROUTES_PATH.ADMIN}${ROUTES_PATH.USERMANAGEMENT}`,
          active: this.$route.path === `${ROUTES_PATH.ADMIN}${ROUTES_PATH.USERMANAGEMENT}`
        }, {
          id: 1,
          label: this.$t('pages.groupManagement.title'),
          to: `${ROUTES_PATH.ADMIN}${ROUTES_PATH.GROUPMANAGEMENT}`,
          active: this.$route.path === `${ROUTES_PATH.ADMIN}${ROUTES_PATH.GROUPMANAGEMENT}`
        }]
      }]
    }
  }
}
</script>
