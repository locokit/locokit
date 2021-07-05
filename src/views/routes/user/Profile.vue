<template>
  <div
    class="generic-view-container  p-12 p-sm-10 p-md-10 p-xl-8 p-d-flex p-flex-column p-as-center p-mx-auto"
  >
    <div class="lck-color-primary p-my-4">
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
        <template
          slot="content"
          v-if="authState.data.user && authState.data.user.groups"
        >
          <p-card v-for="group in authState.data.user.groups" :key="group.id">
            <template slot="title">
              {{ group.name }} ({{ group.uhg_role }})
            </template>
            <template slot="content">
              <router-link
                class="no-decoration-link"
                :to="'/workspace/' + group.aclset.workspace.id"
              >
                {{ group.aclset.workspace.text }}
              </router-link>
              <span v-if="group.aclset.manager">(manager)</span>
            </template>
          </p-card>
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

        <template
          slot="content"
          v-if="authState.data.user && authState.data.user.email"
        >
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
          <div class="p-field p-grid p-mb-3">
            <div class="p-d-flex p-md-12">
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
                  :mediumRegex="`${regexPasswordRules}(?=.{8,})`"
                  :strongRegex="`${regexPasswordRules}(?=.{12,})`"
                  :weakLabel="$t('pages.account.edit.passwordStrength.weak')"
                  :mediumLabel="$t('pages.account.edit.passwordStrength.medium')"
                  :strongLabel="$t('pages.account.edit.passwordStrength.strong')"
                  :promptLabel="$t('pages.account.edit.prompt')"
                  @blur="handleBlur"
                  aria-describedby="password-rules"
                />
              </div>
            </div>
            <small
              class="p-text-italic"
              id="password-rules"
            >
              {{ $t('pages.account.edit.passwordRules.rules') }}
            </small>
          </div>
          <div class="p-field p-grid">
            <label
              class="p-col p-md-3"
              for="passwordCheck"
            >
              {{ $t('pages.account.edit.passwordCheck') }}
            </label>
            <div class="p-col p-md-3">
              <p-input-text
                id="passwordCheck"
                type="password"
                v-model="password.passwordCheck"
                @blur="handleBlur"
              />
            </div>
          </div>
          <div
            class="p-text-error"
          >
            <p
              class="p-invalid"
              v-if="displayErrorMismatch"
            >
              {{ $t('pages.account.edit.passwordMismatch') }}
            </p>
            <p
              class="p-invalid"
              v-if="incorrectPassword"
            >
              {{ $t('pages.account.edit.passwordIncorrect') }}
            </p>
            <div
              v-if="errorPasswordRules"
            >
              <p class="p-invalid">
                {{ $t('pages.account.edit.passwordRules.error') }}
              </p>
              <ul class="p-invalid">
                <li
                  v-for="error in errorPasswordRules"
                  :key="error"
                >
                  {{ $t(`pages.account.edit.passwordRules.${error}`) }}
                </li>
              </ul>
            </div>
          </div>
        </template>
        <template
          slot="content"
          v-else
        >
          {{ $t('pages.account.view.nodata') }}
        </template>

        <template
          slot="footer"
          v-if="authState.data.user && authState.data.user.email"
        >
          <div class="p-field p-grid p-jc-end">
            <div class="p-col p-md-3">
              <p-button
                class="p-button-primary"
                type="button"
                :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-check-circle'"
                :label="loading ? $t('form.submitting') : $t('form.submit')"
                :disabled="(!password.oldPassword || !password.password || !password.passwordCheck ) || loading || displayErrorMismatch"
                @click="submitPassword"
              />
            </div>
          </div>
        </template>
      </p-card>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'

import { lckClient } from '@/services/lck-api'
import {
  authState,
  logout,
} from '@/store/auth'
import { ROUTES_PATH } from '@/router/paths'
import { regexPasswordRules } from '@/services/lck-utils/regex'

export default {
  name: 'Profile',
  data () {
    return {
      authState,
      loading: false,
      password: {
        oldPassword: null,
        password: null,
        passwordCheck: null,
      },
      displayErrorMismatch: false,
      incorrectPassword: false,
      errorPasswordRules: null,
      regexPasswordRules,
    }
  },
  components: {
    'p-card': Vue.extend(Card),
    'p-button': Vue.extend(Button),
    'p-password': Vue.extend(Password),
    'p-input-text': Vue.extend(InputText),
  },
  methods: {
    async submitPassword () {
      this.loading = true
      this.errorPasswordRules = null
      this.incorrectPassword = false
      try {
        await lckClient.service('authManagement').create(
          {
            action: 'passwordChange',
            value: {
              user: { email: authState.data.user?.email },
              ...this.password,
            },
          },
        )
        this.password = {
          oldPassword: null,
          password: null,
          passwordCheck: null,
        }
      } catch (error) {
        if (error.data && error.data.failedRules) {
          this.errorPasswordRules = error.data.failedRules
        }
        if (error.errors && error.errors.oldPassword) {
          this.incorrectPassword = true
        }
      }
      this.loading = false
    },
    // Check if mismatch between the password input
    handleBlur () {
      if (this.password.password && this.password.passwordCheck) {
        this.displayErrorMismatch = (this.password.password !== this.password.passwordCheck)
      }

      if (!this.password.password && !this.password.passwordCheck) {
        this.displayErrorMismatch = false
      }
    },
    logout () {
      logout()
      this.$router.push(ROUTES_PATH.HOME)
    },
  },
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

</style>
