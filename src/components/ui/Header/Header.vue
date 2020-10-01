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
      <p-button
        icon="pi pi-user"
        class="p-button-rounded"
        @click="toggle"
        aria-haspopup="true"
        aria-controls="overlay_menu"
      />
      <p-menu
        id="overlay_menu"
        ref="menu"
        :model="items"
        :popup="true"
      />
    </div>
  </header>
</template>

<script>
import Vue from 'vue'
import { ROUTES_PATH } from '@/router/paths'
import Button from 'primevue/button'
import Menu from 'primevue/menu'

export default {
  name: 'Header',
  components: {
    'p-button': Vue.extend(Button),
    'p-menu': Vue.extend(Menu)
  },
  props: {
    logoUrl: {
      type: String,
      required: true
    },
    isSuperAdmin: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      ROUTES_PATH
    }
  },
  computed: {
    items: function () {
      const result = []
      if (this.isSuperAdmin) {
        result.push({
          label: 'Utilisateur Administration',
          icon: 'pi pi-cog',
          to: ROUTES_PATH.USERMANAGEMENT
        })
        result.push({
          label: 'Groupe Administration',
          icon: 'pi pi-cog',
          to: ROUTES_PATH.GROUPMANAGEMENT
        })
      }
      return result.concat([
        {
          label: 'Votre profil',
          icon: 'pi pi-user',
          to: ROUTES_PATH.PROFILE
        },
        {
          label: 'Déconnexion',
          icon: 'pi pi-lock-open',
          command: () => {
            this.logoutClick()
          }
        }
      ])
    }
  },
  methods: {
    toggle (event) {
      this.$refs.menu.toggle(event)
    },
    onToggle () {
      this.$emit('menuButtonClick')
    },
    logoutClick () {
      this.$emit('logoutClick')
    }
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
