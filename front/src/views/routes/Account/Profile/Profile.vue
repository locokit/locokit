<template>
  <div class="profile-container">
    <div class="generic-view-container p-12 p-sm-10 p-md-10 p-xl-8 p-d-flex p-flex-column p-as-center p-mx-auto">
      <div class="lck-color-primary p-my-4">
        <h1>{{ $t('pages.account.title') }}</h1>
      </div>
      <section class="p-mb-4">
        <p-card>
          <template #title>
            <div class="p-d-flex p-flex-row">
              <span class="icon-rounded">
                <i class="bi bi-person" aria-hidden="true"/>
              </span>
              <h2>
                {{ $t('pages.account.profile') }}
              </h2>
            </div>
          </template>
          <template
            #content
            v-if="authState.data.user"
          >
            <lck-form
              class="p-mb-2"
              :displayCancelButton="false"
              :submitting="loading"
              @submit="submitUsername"
            >
              <validation-provider
                vid="username"
                tag="div"
                :name="$t('pages.account.username')"
                class="p-field p-grid p-mb-3"
                rules="required"
                v-slot="{
                  errors,
                  classes
                }"
              >
                <label
                  class="label-field-required p-col-12 p-mb-2 p-md-4 p-mb-md-0"
                  for="username"
                >
                  {{ $t('pages.account.username') }}
                </label>
                <div class="p-col-12 p-md-8">
                  <p-input-text id="username" v-model="username"/>
                </div>
                <span :class="classes" class="p-my-2">{{ errors[0] }}</span>
              </validation-provider>
              <validation-provider
                vid="email"
                tag="div"
                :name="$t('pages.account.email')"
                class="p-field p-grid p-mb-3"
                rules="required|email"
              >
                <label
                  class="p-col-12 p-mb-2 p-md-4 p-mb-md-0"
                  for="email"
                >
                  {{ $t('pages.account.email') }}
                </label>
                <div class="p-col-12 p-md-8">
                  <p class="p-text-bold"> {{ authState.data.user.email }} </p>
                </div>
              </validation-provider>
              <div
                class="p-field p-grid p-mb-3"
              >
                <label
                  class="p-col-12 p-mb-2 p-md-4 p-mb-md-0"
                >
                  {{ $t('pages.account.role') }}
                </label>
                <div class="p-col-12 p-md-8">
                  <p-tag :value="$t(`common.profiles.${authState.data.user.profile}`)"/>
                </div>
              </div>
            </lck-form>
          </template>
          <template
            #content
            v-else
          >
            {{ $t('pages.account.nodata') }}
          </template>
        </p-card>
      </section>
      <section class="p-mb-4">
        <p-card>
          <template #title>
            <div class="p-d-flex p-flex-row">
              <span class="icon-rounded">
                <i class="bi bi-envelope" aria-hidden="true"/>
              </span>
              <h2>
                {{ $t('pages.account.edit.email.title') }}
              </h2>
            </div>
          </template>
          <template
            #content
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
                class="p-field p-grid p-mb-3"
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
                  {{ $t('pages.account.edit.email.new') }}
                </label>
                <div class="p-col-12 p-md-8">
                  <p-input-text
                    id="newEmail"
                    :placeholder="$t('pages.account.edit.email.email')"
                    type="email"
                    v-model="emailEdit.newEmail"
                  />
                </div>
                <span :class="classes" class="p-my-2">{{ errors[0] }}</span>
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
                  {{ $t('pages.account.edit.email.currentPassword') }}
                </label>
                <div class="p-col-12 p-md-8">
                  <p-password
                    :feedback="false"
                    id="password"
                    toggleMask
                    v-model="emailEdit.password"
                  />
                </div>
                <span :class="classes" class="p-my-2">{{ errors[0] }}</span>
              </validation-provider>
            </lck-form>
          </template>
          <template
            #content
            v-else
          >
            {{ $t('pages.account.nodata') }}
          </template>
        </p-card>
      </section>
      <section class="p-mb-4">
      <p-card>
        <template #title>
          <div class="p-d-flex p-flex-row">
             <span class="icon-rounded">
              <i class="bi bi-shield-lock" aria-hidden="true"/>
            </span>
            <h2>
              {{ $t('pages.account.edit.title') }}
            </h2>
          </div>
        </template>
        <template
          #content
          v-if="authState.data.user && authState.data.user.email"
        >
          <lck-form
            :displayCancelButton="false"
            :submitting="loading"
            @submit="submitPassword"
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
                class="label-field-required p-col-12 p-mb-2 p-md-4 p-mb-md-0"
                for="oldPassword"
              >
                {{ $t('pages.account.edit.oldPassword') }}
              </label>
              <div class="p-col-12 p-md-8">
                <p-password
                  id="oldPassword"
                  :feedback="false"
                  toggleMask
                  v-model="password.oldPassword"
                />
              </div>
              <span
                :class="classes"
                class="p-my-2"
              >
                {{ errors[0] }}
              </span>
            </validation-provider>

            <validation-provider
              vid="newPassword"
              tag="div"
              :name="$t('pages.account.edit.newPassword')"
              class="p-field p-grid p-mb-3"
              :rules="{ required: true, regex: regexPasswordRules}"
              v-slot="{
                  errors,
                  classes,
                }"
            >
              <label
                class="label-field-required p-col-12 p-mb-2 p-md-4 p-mb-md-0"
                for="newPassword"
              >
                {{ $t('pages.account.edit.newPassword') }}
              </label>
              <div class="p-col-12 p-md-8">
                <p-password
                  id="newPassword"
                  v-model="password.password"
                  :mediumRegex="`${regexPasswordRules}(?=.{8,})`"
                  :strongRegex="`${regexPasswordRules}(?=.{12,})`"
                  :weakLabel="$t('pages.account.edit.passwordStrength.weak')"
                  :mediumLabel="$t('pages.account.edit.passwordStrength.medium')"
                  :strongLabel="$t('pages.account.edit.passwordStrength.strong')"
                  :promptLabel="$t('pages.account.edit.prompt')"
                  toggleMask
                  aria-describedby="password-rules"
                />
              </div>
              <div
                class="info-new-password p-col-12 p-mb-0"
              >
                <small
                  class="p-text-italic"
                  id="password-rules"
                >
                  {{ $t('pages.account.edit.passwordRules.rules') }}
                </small>
                <span
                  :class="classes"
                  class="p-my-2"
                >
                    {{ errors[0] }}
                  </span>
              </div>
            </validation-provider>

            <validation-provider
              vid="passwordCheck"
              tag="div"
              :name="$t('pages.account.edit.passwordCheck')"
              class="p-field p-grid"
              rules="required|passwordConfirm:@newPassword"
              v-slot="{
                errors,
                classes
              }"
            >
              <label
                class="label-field-required p-col-12 p-mb-2 p-md-4 p-mb-md-0"
                for="passwordCheck"
              >
                {{ $t('pages.account.edit.passwordCheck') }}
              </label>
              <div class="p-col-12 p-md-8">
                <p-password
                  id="passwordCheck"
                  :feedback="false"
                  toggleMask
                  v-model="password.passwordCheck"
                />
              </div>

              <span
                :class="classes"
                class="p-my-2"
              >
                {{ errors[0] }}
              </span>
            </validation-provider>
          </lck-form>
        </template>

        <template
          #content
          v-else
        >
          {{ $t('pages.account.nodata') }}
        </template>
      </p-card>
    </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import Password from 'primevue/password'
import { ValidationProvider } from 'vee-validate'

import LckForm from '@/components/ui/Form/Form.vue'

import { lckClient } from '@/services/lck-api'
import { authState, logout, updateUsername } from '@/store/auth'
import { ROUTES_PATH } from '@/router/paths'
import { regexPasswordRules } from '@/services/lck-utils/regex'

export default Vue.extend({
  name: 'Profile',
  components: {
    'lck-form': LckForm,
    'p-card': Vue.extend(Card),
    'p-password': Vue.extend(Password),
    'p-input-text': Vue.extend(InputText),
    'p-tag': Vue.extend(Tag),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  data () {
    return {
      authState,
      loading: false,
      username: authState.data.user?.name,
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
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error.impossibleOperation'),
          detail: this.$t('error.basic'),
          life: 5000,
        })
      }
      this.loading = false
    },
    async submitUsername () {
      if (this.username) {
        try {
          await lckClient.service('user').patch(this.authState.data.user?.id, {
            name: this.username,
          })
          updateUsername(this.username)
        } catch (error) {
          this.$toast.add({
            severity: 'error',
            summary: this.$t('error.impossibleOperation'),
            detail: this.$t('error.basic'),
            life: 5000,
          })
        }
      }
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          detail: (error as any).errors?.password
            ? this.$t('pages.account.edit.passwordIncorrect')
            : this.$t('error.basic'),
          life: 5000,
        })
      }
      this.loading = false
    },
    logout () {
      logout()
      this.$router.push(ROUTES_PATH.HOME)
    },
  },
})
</script>

<style scoped lang="scss">
.profile-container {
  overflow: auto;
  height: 100%;
}

.icon-rounded {
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--primary-color);
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  padding: 0.5rem;
  margin: auto 0.5rem auto 0;

  & i {
    color: var(--color-white);
    font-size: 1.5rem !important;
  }
}

.info-new-password {
  display: flex;
  flex-direction: column;
}
</style>
