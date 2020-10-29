<template>
  <p-multiselect
    class="multiselect-custom"
    v-on="$listeners"
    v-bind="$attrs"
    :placeholder="placeholder"
    :appendTo="appendTo"
  >
    <template #value="slotProps">
      <div
        class="option-item option-item-value"
        v-for="option of slotProps.value"
        :key="option.value"
      >
        <div>{{ option.label }}</div>
      </div>
    </template>
    <template #option="slotProps">
      <div class="country-item">
        <div>{{ slotProps.option.label }}</div>
      </div>
    </template>
  </p-multiselect>
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
    },
    placeholder: {
      type: String,
      default: "$t('components.dropdown.placeholder')"
    }
  }
}
</script>

<style scoped lang="scss">

.multiselect-custom {
  .p-multiselect-label:not(.p-placeholder) {
    padding-top: .25rem;
    padding-bottom: .25rem;
  }

  .option-item-value {
    padding: 0 .5rem;
    border-radius: 3px;
    display: inline-flex;
    margin-right: .5rem;
    background-color: var(--primary-color);
    color: var(--text-color);
  }
}
</style>
