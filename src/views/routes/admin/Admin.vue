<template>
  <layout-with-header>
    <template v-slot:default="slotProps">
      <div class="lck-layout-content">
        <lck-sidebar :sidebarActive="slotProps.sidebarActive" :items="sidebarItems" v-on="$listeners" />
        <div class="lck-page">
          <router-view />
        </div>
      </div>
    </template>
  </layout-with-header>
</template>

<script>
import Vue from 'vue'

import Sidebar from '@/components/visualize/Sidebar/Sidebar'
import { ROUTES_PATH } from '@/router/paths'
import LayoutWithHeader from '@/layouts/WithHeader.vue'

export default {
  name: 'Admin',
  components: {
    'layout-with-header': Vue.extend(LayoutWithHeader),
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
