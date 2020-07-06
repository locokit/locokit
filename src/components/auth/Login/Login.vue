<template>
  <div class="w-full max-w-xs">
    <form class="bg-white px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          {{ $t('components.login.email') }}
        </label>
        <input
          class="shadow-sm appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          :placeholder="$t('components.login.email')"
          v-model="form.email"
        >
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
          {{ $t('components.login.password') }}
        </label>
        <input
          class="shadow-sm appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          :placeholder="$t('components.login.password')"
          v-model="form.password"
        >
      </div>
      <div class="flex items-center justify-center">
        <button
          class="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm focus:outline-none focus:shadow-outline"
          type="button"
          @click="emitSubmit"
        >
          {{ $t('components.login.signin') }}
        </button>
        <!-- <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
          Forgot Password?
        </a> -->
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data () {
    return {
      form: {
        email: 'superadmin@makina-corpus.net',
        password: 'pouetpouet'
      }
    }
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
