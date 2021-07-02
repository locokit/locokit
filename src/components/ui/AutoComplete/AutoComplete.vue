<!-- AutoComplete for lck-front looking like the Dropdown component  -->
<!-- Based on AutoComplete component in Prime -->
<template>
  <p-autocomplete
    :dropdown="true"
    :placeholder="$t('components.datatable.autoCompletePlaceholder')"
    :field="field"
    :appendTo="appendTo"
    v-on="$listeners"
    v-bind="$attrs"
    class="lck-autocomplete"
    @complete="searchItems($event)"
  />
</template>

<script>
import Vue from 'vue'
import PrimeAutoComplete from 'primevue/autocomplete'

export default {
  name: 'LckAutoComplete',
  props: {
    appendTo: {
      type: String,
      default: 'body',
    },
    field: {
      type: String,
      required: false,
      default: 'label',
    },
  },
  components: {
    'p-autocomplete': Vue.extend(PrimeAutoComplete),
  },
  methods: {
    searchItems (event) {
      this.$emit('search', event)
    },
  },
}
</script>

<style scoped>

.lck-autocomplete {
  border: unset;
  border-radius: 0;
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

/deep/ .p-autocomplete-input {
  padding-right: 2.357rem;
}
</style>
