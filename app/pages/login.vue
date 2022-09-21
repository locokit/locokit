<template>
  <form @submit.stop.prevent="log">
    <input type="email" name="email" v-model="email" />
    <input type="password" name="password" v-model="password" />
    <select name="strategy" v-model="strategy">
      <option value="local">local</option>
      <option value="github">github</option>
    </select>
    <button type="submit">Connexion</button>
    <button @click="goToAuthGithub">github</button>
    <button @click="goToFeathersAuthGithub">github</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const githubClientId = '7e52d97dd4f7c2252de3'
const email = ref()
const password = ref()
const strategy = ref('github')
const log = async () => {
  console.log(email.value, password.value, strategy.value)
}
const goToAuthGithub = () => {
  window.location.replace(
    'https://github.com/login/oauth/authorize?login=mathieu@dartic.fr&client_id=' +
      githubClientId +
      '&redirect_uri=http://localhost:3000/github' +
      '&scope[]=profile&scope[]=email&scope[]=openid'
  )
}
const goToFeathersAuthGithub = () => {
  window.location.replace('http://localhost:3030/oauth/github')
}
</script>
