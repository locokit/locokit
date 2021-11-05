<template>
  <layout-with-header>
    <template v-slot:default="slotProps">
      <div class="lck-layout lck-layout--with-nav">
        <nav class="lck-nav" :class="{'lck-nav--active': slotProps.sidebarActive}">
          <ul class="lck-nav-list">
            <li
              v-for="item in menuItems"
              :key="item.label"
              :aria-label="item.label"
              :title="item.label"
              class="lck-nav-item"
            >
              <router-link :to="item.to" class="lck-nav-item-link">
                <i class="bi" :class="item.icon" />
              </router-link>
            </li>
          </ul>
        </nav>
        <router-view :sidebarActive="slotProps.sidebarActive" />
      </div>
    </template>
  </layout-with-header>
</template>

<script>
import Vue from 'vue'

import { ROUTES_NAMES } from '@/router/paths'
import LayoutWithHeader from '@/layouts/WithHeader.vue'

export default {
  name: 'Admin',
  components: {
    'layout-with-header': Vue.extend(LayoutWithHeader),
  },
  computed: {
    menuItems () {
      return [{
        label: this.$t('pages.userManagement.title'),
        icon: 'bi-person',
        to: {
          name: ROUTES_NAMES.ADMIN.USER,
        },
      }, {
        label: this.$t('pages.groupManagement.title'),
        icon: 'bi-people',
        to: {
          name: ROUTES_NAMES.ADMIN.GROUP,
        },
      }]
    },
  },
}
</script>
