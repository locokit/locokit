<template>
  <prime-card class="p-col">
    <template slot="content">
      <form>
        <div class="p-field p-text-left">
          <label for="email">{{ $t('components.login.email') }}</label>
          <prime-input-text
            id="email"
            type="text"
            v-model="form.email"
            :placeholder="$t('components.login.email')"
          />
        </div>
        <div class="p-field p-text-left">
          <label for="password">{{ $t('components.login.password') }}</label>
          <prime-input-text
            id="password"
            type="password"
            class="rounded-sm"
            v-model="form.password"
            :placeholder="$t('components.login.password')"
          />
        </div>
        <div class="flex items-center justify-center">
          <prime-button
            :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'"
            :label="$t('components.login.signin')"
            @click="emitSubmit"
          />
          <!-- <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
            Forgot Password?
          </a> -->
        </div>
      </form>
    </template>
  </prime-card>
</template>

<script lang="ts">
import Vue from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Card from 'primevue/card'

export default Vue.extend({
  props: {
    loading: Boolean
  },
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  components: {
    'prime-card': Vue.extend(Card),
    'prime-input-text': Vue.extend(InputText),
    'prime-button': Vue.extend(Button)
  },
  methods: {
    emitSubmit () {
      this.$emit('submit', this.form)
    }
  }
})
</script>

<style>
</style>
