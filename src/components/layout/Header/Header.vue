<template>
  <header
    class="lck-header p-px-2 p-d-flex p-jc-between"
  >
    <a class="menu-button p-my-auto" @click="onToggle">
      <i class="pi pi-bars"></i>
    </a>
    <router-link
      :to="ROUTES_PATH.WORKSPACE"
      class="p-my-auto"
    >
      <img
        alt="logo"
        :src="logoUrl"
      />
    </router-link>

    <div class="p-my-auto">
      <prime-button icon="pi pi-user"  class="p-button-rounded"  @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" />
      <prime-menu id="overlay_menu" ref="menu" :model="items" :popup="true" />
    </div>
  </header>
</template>

<script>
import Vue from 'vue'
import { ROUTES_PATH } from '@/router/paths'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import { logout } from '@/store/auth'

export default {
  name: 'Header',
  props: {
    logoUrl: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      ROUTES_PATH
    }
  },
  computed: {
    items () {
      return [
        {
          label: 'Administration',
          icon: 'pi pi-cog',
          to: ROUTES_PATH.USERMANAGEMENT
        },
        {
          label: 'Votre profil',
          icon: 'pi pi-user',
          to: ROUTES_PATH.PROFILE
        },
        {
          label: 'Déconnexion',
          icon: 'pi pi-lock-open',
          command: () => {
            logout()
            this.$router.push(ROUTES_PATH.HOME)
          }
        }
      ]
    },
    adminItems () {
      return [
        {
          label: 'Administration',
          icon: 'pi pi-cog',
          to: ROUTES_PATH.USERMANAGEMENT
        },
        {
          label: 'Votre profil',
          icon: 'pi pi-user',
          to: ROUTES_PATH.PROFILE
        },
        {
          label: 'Déconnexion',
          icon: 'pi pi-lock-open',
          command: () => {
            logout()
            this.$router.push(ROUTES_PATH.HOME)
          }
        }
      ]
    }
  },
  methods: {
    toggle (event) {
      this.$refs.menu.toggle(event)
    },
    logout () {
      logout()
    }
  },
  components: {
    'prime-button': Vue.extend(Button),
    'prime-menu': Vue.extend(Menu)
  }
}
</script>

<style scoped>
  .lck-header {
    height: var(--header-height) !important;
    border-bottom: 1px solid var(--header-border-bottom-color);
    background-color: var(--header-background-color);
  }
</style>
