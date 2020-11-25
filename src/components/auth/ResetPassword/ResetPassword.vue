<template>
  <form
    @submit.prevent="emitSubmit"
    class="p-text-left p-fluid"
  >
    <div class="p-field">
      <label for="password">{{ $t('components.resetpassword.password') }}</label>
      <p-password
        id="password"
        v-model="password"
        :mediumRegex="`${regexPasswordRules}(?=.{8,})`"
        :strongRegex="`${regexPasswordRules}(?=.{12,})`"
        :placeholder="$t('components.resetpassword.password')"
        :weakLabel="$t('pages.account.edit.passwordStrength.weak')"
        :mediumLabel="$t('pages.account.edit.passwordStrength.medium')"
        :strongLabel="$t('pages.account.edit.passwordStrength.strong')"
        :promptLabel="$t('pages.account.edit.prompt')"
        @blur="handleBlur"
        required
      />
      <small
        class="p-text-italic"
        id="password-rules"
      >
        {{ $t('pages.account.edit.passwordRules.rules') }}
      </small>
    </div>
    <div class="p-field">
      <label for="passwordCheck">{{ $t('components.resetpassword.passwordCheck') }}</label>
      <p-input-text
        id="passwordCheck"
        type="password"
        v-model="passwordCheck"
        :placeholder="$t('components.resetpassword.passwordCheck')"
        @blur="handleBlur"
        required
      />
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
      <div
        v-if="error && error.data && error.data.failedRules.length > 0"
      >
        <p class="p-invalid">
          {{ $t('pages.account.edit.passwordRules.error') }}
        </p>
        <ul class="p-invalid">
          <li
            v-for="failedRule in  error.data.failedRules"
            :key="failedRule"
          >
            {{ $t(`pages.account.edit.passwordRules.${failedRule}`) }}
          </li>
        </ul>
      </div>
    </div>
    <div class="p-d-flex p-flex-column">
      <p-button
        type="submit"
        :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'"
        :label="$t('components.resetpassword.submit')"
        :disabled="loading || displayErrorMismatch"
        class="p-mb-2"
      />
    </div>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Password from 'primevue/password'
import { regexPasswordRules } from '@/services/regex'

export default Vue.extend({
  name: 'LckResetPassword',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: Error,
      default: null
    }
  },
  data () {
    return {
      password: '',
      passwordCheck: '',
      displayErrorMismatch: false,
      regexPasswordRules
    }
  },
  components: {
    'p-input-text': Vue.extend(InputText),
    'p-password': Vue.extend(Password),
    'p-button': Vue.extend(Button)
  },
  methods: {
    emitSubmit () {
      this.$emit('submit', this.password)
    },
    // Check if mismatch between the password input
    handleBlur () {
      if (this.password && this.passwordCheck) {
        this.displayErrorMismatch = (this.password !== this.passwordCheck)
      }

      if (!this.password && !this.passwordCheck) {
        this.displayErrorMismatch = false
      }
    }
  }
})
</script>
