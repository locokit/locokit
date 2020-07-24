<template>
  <Card class="p-col">
    <template slot="content">
      <form>
        <div class="p-field p-text-left">
          <label for="email">{{ $t('components.login.email') }}</label>
          <InputText id="email" type="text" v-model="form.email" placeholder="$t('components.login.email')" />
        </div>
        <div class="p-field p-text-left">
          <label for="password">{{ $t('components.login.password') }}</label>
          <InputText id="password" type="password"  class="rounded-sm" v-model="form.password" placeholder="$t('components.login.password')" />
        </div>
        <div class="flex items-center justify-center">
          <Button
            :label="$t('components.login.signin')"
            class=""
            @click="emitSubmit"
         />
          <!-- <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
            Forgot Password?
          </a> -->
        </div>
      </form>
    </template>
  </Card>
</template>

<script type="ts">
import Vue from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Card from 'primevue/card'

export default Vue.extend({
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    emitSubmit () {
      this.$emit('submit', this.form)
    }
  },
  components: { InputText, Button, Card }
})
</script>

<style>

</style>
