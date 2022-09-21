<template>
  <div>
    Page avec composants prime ?

    <p-calendar v-model="value" />
    <p-dropdown
      v-model="selectedCity"
      :options="cities"
      optionLabel="name"
      placeholder="Select a City"
    />
  </div>
</template>

<script setup>
import PCalendar from 'primevue/calendar'
import PDropdown from 'primevue/dropdown'

const value = ref()

const selectedCity = ref(null)
const cities = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
])
</script>
