<template>
  <p-multiselect
    class="multiselect-custom"
    v-on="$listeners"
    v-bind="$attrs"
    :placeholder="$t('components.datatable.placeholder')"
    :appendTo="appendTo"
    :options="options"
  >
    <template #value="slotProps">
      <!-- Selected options -->
      <lck-badge
        v-for="option of slotProps.value"
        :key="option"
        :backgroundColor="optionsObject[option].backgroundColor"
        :color="optionsObject[option].color"
        :label="optionsObject[option].label"
      />
    </template>
    <template #option="slotProps">
      <!-- Item of the options list -->
      <lck-badge
        :backgroundColor="slotProps.option.backgroundColor"
        :color="slotProps.option.color"
        :label="slotProps.option.label"
      />
    </template>
  </p-multiselect>
</template>

<script lang='ts'>
import Vue, { PropOptions } from 'vue'
import PrimeMultiSelect from 'primevue/multiselect'

import Badge from '@/components/ui/Badge/Badge.vue'

import { objectFromArray } from '@/services/lck-utils/arrays'
import { SelectValue } from '@/services/lck-api/definitions'

export default Vue.extend({
  name: 'LckMultiSelect',
  components: {
    'p-multiselect': Vue.extend(PrimeMultiSelect),
    'lck-badge': Badge,
  },
  props: {
    appendTo: {
      type: String,
      default: 'body',
    },
    options: {
      type: Array,
      default: () => [],
    } as PropOptions<SelectValue[]>,
  },
  computed: {
    optionsObject () {
      return objectFromArray(this.options, 'value')
    },
  },
})
</script>

<style>
.p-multiselect-header .p-multiselect-close {
  display: none;
}
</style>
