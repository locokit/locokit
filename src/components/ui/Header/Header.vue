<template>
  <header
    :class="{'has-burger-menu' : hasBurgerMenu}"
    class="lck-header p-px-2 p-d-flex p-jc-between"
  >
    <a
      v-if="hasBurgerMenu"
      class="menu-button p-my-auto"
      @click="onToggle"
    >
      <i class="pi pi-bars"></i>
    </a>
    <router-link
      :to="ROUTES_PATH.WORKSPACE"
      class="p-my-auto p-m-auto"
      @click.native="setToggle"
    >
      <img
        class="mobile-hide"
        alt="logo"
        :src="logoUrl"
      />
      <img
        class="mobile-show mobile-logo"
        alt="logo mobile"
        :src="logoMobileUrl"
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
  name: 'LckHeader',
  components: {
    'p-button': Vue.extend(Button),
    'p-menu': Vue.extend(Menu),
  },
  props: {
    logoUrl: {
      type: String,
      required: true,
    },
    logoMobileUrl: {
      type: String,
      required: true,
    },
    isSuperAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasBurgerMenu: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data () {
    return {
      ROUTES_PATH,
    }
  },
  computed: {
    items: function () {
      const result = []
      if (this.isSuperAdmin) {
        result.push({
          label: this.$t('pages.admin.title'),
          icon: 'pi pi-cog',
          command: () => {
            this.$refs.menu.hide()
            this.$router.push(ROUTES_PATH.ADMIN)
          },
        })
      }
      return result.concat([
        {
          label: this.$t('pages.account.title'),
          icon: 'pi pi-user',
          command: () => {
            this.$refs.menu.hide()
            this.$router.push(ROUTES_PATH.PROFILE)
          },
        },
        {
          label: this.$t('common.logout'),
          icon: 'pi pi-lock-open',
          command: () => {
            this.logoutClick()
          },
        },
      ])
    },
  },
  methods: {
    toggle (event) {
      this.$refs.menu.toggle(event)
    },
    onToggle () {
      this.$emit('menu-button-click')
    },
    setToggle () {
      this.$emit('prevent-opacity-mobile', false)
    },
    logoutClick () {
      this.$emit('logout-click')
    },
  },
}
</script>

<style scoped>
.lck-header {
  height: var(--header-height) !important;
  border-bottom: 1px solid var(--header-border-bottom-color);
  background-color: var(--header-background-color);
  z-index: 1000;
}

.menu-button {
  line-height: var(--header-height);
  display: none;
  width: var(--header-height);
  height: var(--header-height);
  cursor: pointer;
  transition: background-color .2s;
  text-align: center;
  color: var(--primary-color);
}

.menu-button:hover {
  background-color: var(--surface-c);
}

.menu-button i {
  font-size: 1.5rem;
  line-height: inherit;
}

@media screen and (max-width: 900px) {
  .menu-button {
    display: block;
  }
}
</style>
