<!-- AutoComplete for lck-front looking like the Dropdown component  -->
<!-- Based on AutoComplete component in Prime -->
<template>
  <p-autocomplete
    :dropdown="true"
    :placeholder="$t('components.dropdown.placeholder')"
    field="label"
    :appendTo="appendTo"
    v-on="$listeners"
    v-bind="$attrs"
    class="lck-autocomplete"
  />
</template>

<script>
import Vue from 'vue'
import { AutoComplete as PrimeAutoComplete } from 'primevue/autocomplete'

export default {
  name: 'AutoComplete',
  props: {
    appendTo: {
      type: String,
      default: 'body'
    }
  },
  components: {
    'p-autocomplete': Vue.extend(PrimeAutoComplete)
  },
  methods: {}
}
</script>

<style scoped>

.lck-autocomplete {
  border: 1px solid #ced4da;
  border-radius: 3px;
}

/deep/ .p-button {
  background-color: transparent;
  color: #6c757d;
  width: 2.357rem;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  border: none;
  margin-left: -2.357rem;
}

/deep/ .p-button:enabled:hover {
  background-color: transparent;
  color: #6c757d;
  width: 2.357rem;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  border: none;
}
</style>
