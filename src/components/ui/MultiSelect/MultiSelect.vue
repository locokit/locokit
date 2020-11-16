<template>
  <p-multiselect
    class="multiselect-custom"
    v-on="$listeners"
    v-bind="$attrs"
    :placeholder="$t('components.datatable.placeholder')"
    :appendTo="appendTo"
  />
</template>

<script>
import Vue from 'vue'
import PrimeMultiSelect from 'primevue/multiselect'

export default {
  name: 'LckMultiSelect',
  components: {
    'p-multiselect': Vue.extend(PrimeMultiSelect)
  },
  props: {
    appendTo: {
      type: String,
      default: 'body'
    }
  }
}
</script>

<style>
.p-multiselect-header .p-multiselect-close {
  display: none;
}
</style>
