<template>
  <form @submit.prevent="emitSubmit" class="p-text-left p-fluid">
    <div class="p-field">
      <label for="email">{{ $t('components.login.email') }}</label>
      <p-input-text
        id="email"
        type="text"
        v-model="form.email"
        :placeholder="$t('components.login.email')"
        required
      />
    </div>
    <div class="p-field">
      <label for="password">{{ $t('components.login.password') }}</label>
      <p-input-text
        id="password"
        type="password"
        class="rounded-sm"
        v-model="form.password"
        :placeholder="$t('components.login.password')"
        required
      />
    </div>

    <div
      v-if="error"
      class="p-mb-2 p-p-1 p-text-error"
    >
      {{ error.message }}
    </div>

    <p-button
      type="submit"
      :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'"
      :label="logInAgain ? $t('components.login.signinAgain') : $t('components.login.signin')"
      :disabled="loading"
      class="p-mb-4"
    />

    <div v-if="!logInAgain" class="footer-links">
      <router-link
        v-if="displaySignUpLink"
        :to="{ name: ROUTES_NAMES.SIGNUP }"
      >
        {{ $t('components.login.signup') }}
      </router-link>
      <router-link
        :to="{ name: ROUTES_NAMES.LOSTPASSWORD }"
      >
        {{ $t('components.login.lostpassword') }}
      </router-link>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'

import { ROUTES_NAMES } from '@/router/paths'

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

export default Vue.extend({
  name: 'LckLogin',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Error,
      default: null,
    },
    logInAgain: {
      type: Boolean,
      default: false,
    },
    displaySignUpLink: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      ROUTES_NAMES,
      form: {
        email: '',
        password: '',
      },
    }
  },
  components: {
    'p-input-text': Vue.extend(InputText),
    'p-button': Vue.extend(Button),
  },
  methods: {
    emitSubmit () {
      this.$emit('submit', this.form)
    },
  },
})
</script>

<style scoped>
form {
  text-align: left;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  justify-content: space-around;
}
</style>
