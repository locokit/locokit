<template>
  <div
    class="generic-view-container  p-12 p-sm-10 p-md-10 p-xl-8 p-d-flex p-flex-column p-as-center p-mx-auto"
  >
    <div class="lck-color-page-title p-my-4">
      <h1>{{ $t('pages.profile.title') }}</h1>
    </div>
    <section class="p-mb-4">
      <prime-card>
        <template slot="title">
          <span class="icon-rounded"><i class="pi pi-user"></i></span> {{ $t('pages.profile.title') }}
        </template>
        <template slot="content">
          <h4>{{ authState.data.user.name }}</h4>
          <strong>{{ $t('pages.profile.email') }}&nbsp;</strong>{{ authState.data.user.email }}
          <br>
          <strong>{{ $t('pages.profile.role') }}&nbsp;</strong>{{ authState.data.user.profile }}
        </template>
      </prime-card>
    </section>
    <section class="p-mb-4">
      <prime-card>
        <template slot="title">
          <span class="icon-rounded"><i class="pi pi-users"></i></span> {{ $t('pages.profile.groups') }}
        </template>
        <template slot="content">
          <div v-for="group in authState.data.user.groups" :key="group.id">
            <h4 class="group-title">{{ group.name }}</h4>
            <div class="lck-ul-content">
              <span class="p-badge">Espace de travail</span>&nbsp;
              <router-link
                class="no-decoration-link"
                :to="'/workspace/' + group.workspace.id"
              >
                {{ group.workspace.text }}
              </router-link>
              ({{ group.workspace_role }})
            </div>

          </div>
        </template>
      </prime-card>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import {
  authState,
  logout
} from '@/store/auth'
import { ROUTES_PATH } from '@/router/paths'
import Vue from 'vue'
import Card from 'primevue/card'

export default {
  name: 'Profile',
  data () {
    return {
      authState
    }
  },
  components: {
    'prime-card': Vue.extend(Card)
  },
  methods: {
    logout () {
      logout()
      this.$router.push(ROUTES_PATH.HOME)
    }
  }
}
</script>
<style scoped lang="scss">
.icon-rounded {
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--primary-color);
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  padding: 0.5rem;
}

.icon-rounded i {
  color: #fff;
  font-size: 1.5rem !important;
}

.lck-ul-content span.p-badge {
  background-color: var(--primary-color) !important;
  border-radius: var(--border-radius);
  padding: 0.1rem 0.5rem;
  position: relative;
  overflow: visible;
  margin-right: 1rem;
  line-height: 1.5rem;

  &:after {
    content: '';
    width: 0;
    height: 0;
    border-top: 0.75rem solid transparent;
    border-bottom: 0.75rem solid transparent;
    border-left: 0.7rem solid var(--primary-color);
    position: absolute;
    right: -0.6rem;
    top: 0rem;
    border-radius: var(--border-radius);
  }
}

</style>
