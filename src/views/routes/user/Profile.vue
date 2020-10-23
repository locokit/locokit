<template>
  <div
    class="generic-view-container  p-12 p-sm-10 p-md-10 p-xl-8 p-d-flex p-flex-column p-as-center p-mx-auto"
  >
    <div class="lck-color-page-title p-my-4">
      <h1>{{ $t('pages.account.title') }}</h1>
    </div>
    <section class="p-mb-4">
      <p-card>
        <template slot="title">
          <span class="icon-rounded"><i class="pi pi-user"></i></span> {{ $t('pages.account.view.profile') }}
        </template>
        <template
          slot="content"
          v-if="authState.data.user"
        >
          <h4>{{ authState.data.user.name }}</h4>
          <strong>{{ $t('pages.account.view.email') }}&nbsp;</strong>{{ authState.data.user.email }}
          <br>
          <strong>{{ $t('pages.account.view.role') }}&nbsp;</strong>{{ authState.data.user.profile }}
        </template>
        <template
          slot="content"
          v-else
        >
          {{ $t('pages.account.view.nodata') }}
        </template>
      </p-card>
    </section>

    <section class="p-mb-4">
      <p-card>
        <template slot="title">
          <span class="icon-rounded"><i class="pi pi-users"></i></span> {{ $t('pages.account.view.groups') }}
        </template>
        <template slot="content"
          v-if="authState.data.user && authState.data.user.groups"
        >
          <div v-for="group in authState.data.user.groups" :key="group.id">
            <h4 class="group-title">{{ group.name }}</h4>
            <div class="lck-ul-content">
              <span class="p-badge">{{ $t('pages.account.view.workspaces') }}</span>&nbsp;
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
        <template
          slot="content"
          v-else
        >
          {{ $t('pages.account.view.nodata') }}
        </template>
      </p-card>
    </section>

    <section class="p-mb-4">
      <p-card>
        <template slot="title">
          <span class="icon-rounded"><i class="pi pi-user-edit"></i></span> {{ $t('pages.account.edit.title') }}
        </template>
        <template slot="content">
          <div class="p-field p-grid p-mb-3">
            <label
              class="p-col p-md-3"
              for="oldPassword"
            >
              {{ $t('pages.account.edit.oldPassword') }}
            </label>
            <div class="p-col p-md-3">
              <p-input-text
                id="oldPassword"
                type="password"
                v-model="password.oldPassword"
              />
            </div>
          </div>
          <div class="p-field p-grid">
            <label
              class="p-col p-md-3"
              for="password"
            >
              {{ $t('pages.account.edit.newPassword') }}
            </label>
            <div class="p-col p-md-3">
              <p-password
                id="password"
                v-model="password.password"
              />
            </div>
          </div>
          <div v-if="authState.error">
            <p class="p-invalid">{{ $t('error.basic') }}</p>
          </div>
        </template>
        <template #footer>
          <div class="p-field p-grid p-jc-end">
            <div class="p-col p-md-3">
              <p-button
                class="p-button-primary"
                type="button"
                :icon="authState.loading ? 'pi pi-spin pi-spinner' : 'pi pi-check-circle'"
                :label="authState.loading ? $t('form.submitting') : $t('form.submit')"
                :disabled="(!password.oldPassword || !password.password ) || authState.loading"
                @click="submitPassword"
              />
            </div>
          </div>
        </template>
      </p-card>
    </section>
  </div>
</template>

<script>
import {
  authState, logout, updatePassword
} from '@/store/auth'
import { ROUTES_PATH } from '@/router/paths'
import Vue from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Password from 'primevue/password'
import InputText from 'primevue/inputtext'

export default {
  name: 'Profile',
  data () {
    return {
      authState,
      password: {
        oldPassword: null,
        password: null
      }
    }
  },
  components: {
    'p-card': Vue.extend(Card),
    'p-button': Vue.extend(Button),
    'p-password': Vue.extend(Password),
    'p-input-text': Vue.extend(InputText)
  },
  methods: {
    async submitPassword () {
      await updatePassword(authState.data.user.email, this.password)
      this.password = {
        oldPassword: null,
        password: null
      }
    },
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
    top: 0;
    border-radius: var(--border-radius);
  }
}
</style>
