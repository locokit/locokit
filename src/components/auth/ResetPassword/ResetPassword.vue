<template>
  <form
    @submit.prevent="emitSubmit"
    class="p-text-left"
  >
    <div class="p-field">
      <label for="password">{{ $t('components.resetpassword.password') }}</label>
      <p-input-text
        id="password"
        type="password"
        v-model="password"
        :placeholder="$t('components.resetpassword.password')"
        required
      />
    </div>
    <div class="p-field">
      <label for="passwordCheck">{{ $t('components.resetpassword.passwordCheck') }}</label>
      <p-input-text
        id="passwordCheck"
        type="password"
        v-model="passwordCheck"
        :placeholder="$t('components.resetpassword.passwordCheck')"
        required
      />
    </div>
    <div class="p-mb-2 p-p-1 p-text-error">
      {{ error }}
    </div>
    <div class="p-mb-2 p-p-1 p-text-error" v-if="displayErrorMismatch">
      {{ $t('components.resetpassword.passwordMismatch') }}
    </div>
    <div class="p-d-flex p-flex-column">
      <p-button
        type="submit"
        :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'"
        :label="$t('components.resetpassword.submit')"
        :disabled="loading"
        class="p-mb-2"
      />
    </div>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

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
      displayErrorMismatch: false
    }
  },
  components: {
    'p-input-text': Vue.extend(InputText),
    'p-button': Vue.extend(Button)
  },
  methods: {
    emitSubmit () {
      this.displayErrorMismatch = (this.password !== this.passwordCheck)
      if (this.displayErrorMismatch) return
      this.$emit('submit', this.password)
    }
  }
})
</script>
