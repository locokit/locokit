<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PrimeButton from 'primevue/button'
import PrimeMenu from 'primevue/menu'

const { locale } = useI18n()
const menu = ref()
const items = ref([
  {
    label: 'Français',
    command: () => {
      locale.value = 'fr'
    },
  },
  {
    label: 'English',
    command: () => {
      locale.value = 'en'
    },
  },
])
const toggle = (event) => {
  menu.value.toggle(event)
}
</script>

<template>
  <prime-button
    icon="pi pi-language"
    severity="contrast"
    size="small"
    :label="locale.toUpperCase()"
    aria-haspopup="true"
    aria-controls="overlay_menu"
    @click="toggle"
    class="dark:text-black"
  />
  <prime-menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
</template>
