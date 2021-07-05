<!-- AutoComplete for lck-front looking like the Dropdown component  -->
<!-- Based on AutoComplete component in Prime -->
<template>
  <p-autocomplete
    :field="field"
    :appendTo="appendTo"
    v-on="$listeners"
    v-bind="$attrs"
    :multiple="true"
    :placeholder="$t('components.multiAutocomplete.placeholder')"
    :class="multiLine ? 'lck-multi-autocomplete-multiLine' : 'lck-multi-autocomplete-singleLine'"
    @complete="searchItems($event)"
  />
</template>

<script>
import Vue from 'vue'
import PrimeAutoComplete from 'primevue/autocomplete'

export default {
  name: 'MultiLckAutoComplete',
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
    multiLine: {
      type: Boolean,
      required: false,
      default: true,
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

<style>
.lck-multi-autocomplete-multiLine .p-autocomplete-multiple-container > * {
  margin: 0.1em 0;
}

.lck-multi-autocomplete-multiLine .p-autocomplete-multiple-container {
  flex-wrap: wrap;
}

.lck-multi-autocomplete-singleLine .p-autocomplete-input-token {
  min-width: 50%;
}

.lck-multi-autocomplete-singleLine .p-autocomplete-multiple-container {
  overflow-x: auto;
}

</style>
