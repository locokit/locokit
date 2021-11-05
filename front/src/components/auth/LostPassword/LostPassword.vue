<template>
  <form
    @submit.prevent="emitSubmit"
    class="p-text-left p-fluid"
  >
    <div class="p-field">
      <label for="email">{{ $t('components.lostpassword.email') }}</label>
      <p-input-text
        id="email"
        type="text"
        v-model="email"
        :placeholder="$t('components.lostpassword.email')"
        required
      />
    </div>
    <div
      v-if="error"
      class="p-mb-2 p-p-1 p-text-error"
    >
      <span class="p-text-bold">{{ error.code }}</span>
      {{ error.message }}
    </div>
    <div class="p-d-flex p-flex-column">
      <p-button
        type="submit"
        :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'"
        :label="$t('components.lostpassword.submit')"
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
  name: 'LckLostPassword',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Error,
      default: null,
    },
  },
  data () {
    return {
      email: '',
    }
  },
  components: {
    'p-input-text': Vue.extend(InputText),
    'p-button': Vue.extend(Button),
  },
  methods: {
    emitSubmit () {
      this.$emit('submit', this.email)
    },
  },
})
</script>
