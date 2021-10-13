<template>
  <div class="generic-view-container  p-12 p-sm-10 p-md-10 p-xl-8 p-d-flex p-flex-column p-as-center p-mx-auto">
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
          <p-card
            v-for="group in authState.data.user.groups"
            :key="group.id"
          >
            <template slot="title">
              {{ group.name }} ({{ group.uhg_role }})
            </template>
            <template slot="content">
              <router-link
                class="no-decoration-link"
                :to="`${ROUTES_PATH.WORKSPACE}/${group.id}`"
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
          <span class="icon-rounded"><i class="pi pi-envelope"></i></span> {{ $t('pages.account.edit.email.title') }}
        </template>

        <template
          slot="content"
          v-if="authState.data.user && authState.data.user.email"
        >
          <lck-form
            :displayCancelButton="false"
            :submitting="loading"
            @submit="submitEmail"
          >
            <validation-provider
              vid="newEmail"
              tag="div"
              :name="$t('pages.account.edit.email.new')"
              class="p-field p-grid"
              rules="required|email"
              v-slot="{
                errors,
                classes
              }"
            >
              <label
                class="label-field-required p-col-12 p-mb-2 p-md-4 p-mb-md-0"
                for="newEmail"
              >
                {{ $t("pages.account.edit.email.new") }}
              </label>
              <div class="p-col-12 p-md-8">
                <p-input-text
                  id="newEmail"
                  :placeholder="$t('pages.account.edit.email.email')"
                  type="email"
                  v-model="emailEdit.newEmail"
                />
              </div>
              <span
                :class="classes"
                class="p-my-2"
              >{{ errors[0] }}</span>
            </validation-provider>
            <validation-provider
              vid="password"
              tag="div"
              :name="$t('pages.account.edit.email.currentPassword')"
              class="p-field p-grid p-mb-4 p-mt-2"
              rules="required"
              v-slot="{
                errors,
                classes
              }"
            >
              <label
                class="label-field-required p-col-12 p-mb-2 p-md-4 p-mb-md-0"
                for="password"
              >
                {{ $t("pages.account.edit.email.currentPassword") }}
              </label>
              <div class="p-col-12 p-md-8">
                <p-password
                  :feedback="false"
                  id="password"
                  v-model="emailEdit.password"
                />
              </div>
              <span
                :class="classes"
                class="p-my-2"
              >{{ errors[0] }}</span>
            </validation-provider>
            <div class="p-text-error">
              <p
                class="p-invalid"
                v-if="emailEdit.error"
              >
                {{ emailEdit.error }}
              </p>
            </div>
          </lck-form>
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
          <span class="icon-rounded"><i class="pi pi-lock"></i></span> {{ $t('pages.account.edit.title') }}
        </template>

        <template
          slot="content"
          v-if="authState.data.user && authState.data.user.email"
        >
          <lck-form
            :displayCancelButton="false"
            :submitting="loading"
            @submit="submitEmail"
          >
            <validation-provider
              vid="oldPassword"
              tag="div"
              :name="$t('pages.account.edit.oldPassword')"
              class="p-field p-grid p-mb-3"
              rules="required"
              v-slot="{
                errors,
                classes
              }"
            >
              <label
                class="p-col p-md-3 label-field-required"
                for="oldPassword"
              >
                {{ $t("pages.account.edit.oldPassword") }}
              </label>
              <div class="p-col-12 p-md-8">
                <p-password
                  :feedback="false"
                  id="password"
                  v-model="password.oldPassword"
                />
              </div>
              <span
                :class="classes"
                class="p-my-2"
              >{{ errors[0] }}</span>
            </validation-provider>

            <validation-provider
              vid="newPassword"
              tag="div"
              :name="$t('pages.account.edit.newPassword')"
              class="p-field p-grid p-mb-3"
              rules="required"
              v-slot="{
                errors,
                classes
              }"
            >
              <label
                class="p-col p-md-3 label-field-required"
                for="password"
              >
                {{ $t("pages.account.edit.newPassword") }}
              </label>
              <div class="p-col-12 p-md-8">
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
              <small
                class="p-text-italic"
                id="password-rules"
              >
                {{ $t('pages.account.edit.passwordRules.rules') }}
              </small>
              <span
                :class="classes"
                class="p-my-2"
              >{{ errors[0] }}</span>
            </validation-provider>

            <validation-provider
              vid="passwordCheck"
              tag="div"
              :name="$t('pages.account.edit.passwordCheck')"
              class="p-field p-grid"
              rules="required"
              v-slot="{
                errors,
                classes
              }"
            >
              <label
                class="p-col p-md-3 label-field-required"
                for="passwordCheck"
              >
                {{ $t("pages.account.edit.passwordCheck") }}
              </label>
              <div class="p-col-12 p-md-8">
                <p-input-text
                  id="passwordCheck"
                  type="password"
                  v-model="password.passwordCheck"
                  @blur="handleBlur"
                />
              </div>

              <span
                :class="classes"
                class="p-my-2"
              >{{ errors[0] }}</span>
            </validation-provider>

            <div class="p-text-error">
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
              <div v-if="errorPasswordRules">
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
          </lck-form>
        </template>
        <template
          slot="content"
          v-else
        >
          {{ $t('pages.account.view.nodata') }}
        </template>

      </p-card>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import Card from 'primevue/card'
// import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import { ValidationProvider } from 'vee-validate'

import LckForm from '@/components/ui/Form/Form.vue'

import { lckClient } from '@/services/lck-api'
import { authState, logout } from '@/store/auth'
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
      emailEdit: {
        newEmail: null,
        password: null,
      } as { newEmail: null | string; password: null | string },
      displayErrorMismatch: false,
      incorrectPassword: false,
      errorPasswordRules: null,
      regexPasswordRules,
      ROUTES_PATH,
    }
  },
  components: {
    'lck-form': LckForm,
    'p-card': Vue.extend(Card),
    // 'p-button': Vue.extend(Button),
    'p-password': Vue.extend(Password),
    'p-input-text': Vue.extend(InputText),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  methods: {
    async submitPassword () {
      this.loading = true
      this.errorPasswordRules = null
      this.incorrectPassword = false
      try {
        await lckClient.service('authManagement').create({
          action: 'passwordChange',
          value: {
            user: { email: authState.data.user?.email },
            ...this.password,
          },
        })
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
    async submitEmail () {
      // The user and the new email address must be defined
      if (!authState.data.user || !this.emailEdit.newEmail) return
      try {
        // API call
        this.loading = true
        await lckClient.service('authManagement').create({
          action: 'identityChange',
          value: {
            user: { email: authState.data.user.email },
            password: this.emailEdit.password,
            changes: { email: this.emailEdit.newEmail },
          },
        })
        // Display pop-up
        this.$toast.add({
          severity: 'success',
          summary: this.$t('success.save'),
          detail: this.$t('pages.account.edit.email.success'),
          life: 5000,
        })
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error.impossibleOperation'),
          detail: error.errors?.password
            ? this.$t('pages.account.edit.passwordIncorrect')
            : this.$t('error.basic'),
          life: 5000,
        })
      }
      this.loading = false
    },
    // Check if mismatch between the password input
    handleBlur () {
      if (this.password.password && this.password.passwordCheck) {
        this.displayErrorMismatch =
          this.password.password !== this.password.passwordCheck
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
