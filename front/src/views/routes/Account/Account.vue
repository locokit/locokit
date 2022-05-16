<template>
  <layout-with-header>
    <template v-slot:default="slotProps">
      <div class="lck-layout-content lck-layout--with-nav">
        <nav
          class="lck-nav"
          :class="{'lck-nav--active': slotProps.sidebarActive}"
        >
          <ul class="lck-nav-list">
            <li
              v-for="item in menuItems"
              :key="item.label"
              :aria-label="item.label"
              :title="item.label"
              class="lck-nav-item"
            >
              <router-link :to="item.to" class="lck-nav-item-link" exact>
                <i :class="`bi ${item.icon}`" />
              </router-link>
            </li>
          </ul>
        </nav>
        <router-view :sidebarActive="slotProps.sidebarActive" />
      </div>
    </template>
  </layout-with-header>
</template>

<script lang="ts">
import Vue from 'vue'

import { ROUTES_NAMES } from '@/router/paths'
import LayoutWithHeader from '@/layouts/WithHeader.vue'

export default Vue.extend({
  name: 'Account',
  components: {
    'layout-with-header': Vue.extend(LayoutWithHeader),
  },
  computed: {
    menuItems () {
      return [{
        label: 'Mon profile',
        icon: 'bi-person',
        to: {
          name: ROUTES_NAMES.PROFILE.USER,
        },
      }, {
        label: 'Mes groupes',
        icon: 'bi-people',
        to: {
          name: ROUTES_NAMES.PROFILE.GROUPS,
        },
      }]
    },
  },
})
</script>

<style scoped>

</style>
