<script setup lang="ts">
import { RouterView } from 'vue-router'
import ConfirmPopup from 'primevue/confirmpopup'
import Toast from 'primevue/toast'
</script>

<template>
  <Toast/>
  <ConfirmPopup/>
  <RouterView/>
</template>
