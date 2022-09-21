<template>
  <form
    @submit.prevent="emitSubmit"
    class="text-left p-fluid"
  >
    <div class="mb-4">
      <label for="email">{{ $t('components.login.email') }}</label>
      <p-input-text
        id="email"
        type="email"
        v-model="form.email"
        :placeholder="$t('components.login.email')"
        required
      />
    </div>
    <div class="mb-4">
      <label for="password">{{ $t('components.login.password') }}</label>

      <p-password
        id="password"
        type="password"
        :placeholder="$t('components.login.password')"
        required
        v-model="form.password"
        toggleMask
        :feedback="false"
      />

      <nuxt-link :to="ROUTES.AUTH.LOSTPASSWORD" class="mt-2 block ml-auto">
        {{ $t('components.login.lostpassword') }}
      </nuxt-link>

    </div>

    <div
      v-if="error"
      class="mb-2 text-error"
    >
      {{ error.message }}
    </div>

    <div class="mt-8">
      <p-button
        type="submit"
        :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'"
        :label="logInAgain ? $t('components.login.loginAgain') : $t('components.login.login')"
        :disabled="loading"
      />
    </div>

    <div
      v-if="!logInAgain"
      class="footer-links"
    >
      <nuxt-link
        v-if="displaySignUpLink"
        :to="ROUTES.AUTH.SIGNUP"
      >
        {{ $t('components.login.signup') }}
      </nuxt-link>
    </div>
  </form>
</template>

<script setup lang="ts">

import { ROUTES } from '../../pages/paths'

import PPassword from 'primevue/password'
import PInputText from 'primevue/inputtext'
import PButton from 'primevue/button'
import { ref } from 'vue'

interface Props {
  loading?: boolean
  logInAgain?: boolean
  displaySignUpLink?: boolean
  error?: Error
}

const form = ref({
  email: 'mathieu@dartic.fr',
  password: 'POUET',
})
const emit = defineEmits(['submit'])

withDefaults(defineProps<Props>(), {
  loading: false,
  logInAgain: false,
  displaySignUpLink: false,
})

const emitSubmit = function () {
  emit('submit', form)
}

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
