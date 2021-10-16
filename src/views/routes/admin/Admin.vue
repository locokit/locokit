<template>
  <div class="lck-layout">
    <lck-sidebar :items="sidebarItems" v-on="$listeners" />
    <div class="h-full o-auto h-max-full">
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/visualize/Sidebar/Sidebar'
import { ROUTES_PATH } from '@/router/paths'

export default {
  name: 'Admin',
  components: {
    'lck-sidebar': Sidebar,
  },
  computed: {
    sidebarItems () {
      return [{
        id: 0,
        label: this.$t('pages.admin.sidebar.usersAndGroups'),
        subitems: [{
          id: 0,
          label: this.$t('pages.userManagement.title'),
          to: `${ROUTES_PATH.ADMIN}${ROUTES_PATH.USERMANAGEMENT}`,
        }, {
          id: 1,
          label: this.$t('pages.groupManagement.title'),
          to: `${ROUTES_PATH.ADMIN}${ROUTES_PATH.GROUPMANAGEMENT}`,
        }],
      }]
    },
  },
}
</script>
