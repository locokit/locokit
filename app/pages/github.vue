<template>
  <div>
    Retour de l'api github d'auth

    {{ currentRoute.query }}

    <p-button
      type="submit"
      icon="pi pi-spin pi-spinner"
      label="pouic"
    />

    <!-- <lck-chips /> -->

  </div>
</template>

<script setup lang="ts">
import PButton from 'primevue/button'
const currentRoute = useRoute()
</script>
