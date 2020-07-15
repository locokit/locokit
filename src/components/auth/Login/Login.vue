<template>
  <div class="w-full max-w-xs">
    <el-form class="bg-white px-8 pt-6 pb-8 mb-4">
      <el-form-item :label="$t('components.login.email')" class="font-bold" >
        <el-input v-model="form.email" :placeholder="$t('components.login.email')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('components.login.password')" class="font-bold" >
        <el-input class="rounded-sm" v-model="form.password" type="password"></el-input>
      </el-form-item>
      <div class="flex items-center justify-center">
        <el-button
          class="bg-primary text-white"
          @click="emitSubmit"
        >
          {{ $t('components.login.signin') }}
        </el-button>
        <!-- <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
          Forgot Password?
        </a> -->
      </div>
    </el-form>
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
