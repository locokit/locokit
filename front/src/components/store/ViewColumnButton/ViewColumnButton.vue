<template>
  <lck-overlaypanel
    icon="pi pi-eye-slash"
    class-button="p-button-outlined p-button-secondary"
    :disabled="disabled"
    :label="$tc('components.datatable.toolbar.lists.label', value.length)"
  >
    <template #overlay-content>
      <p-listbox
        :value="value"
        :options="columns"
        :multiple="true"
        :filter="true"
        optionLabel="text"
        optionValue="id"
        :style="{
          border: 'unset',
          width: '400px',
        }"
        v-on="$listeners"
      >
        <template #option="slotProps">
          <div>
            <i
              class="pi pi-check p-mr-2"
              v-if="value.indexOf(slotProps.option.id) > -1"
            />
            <i
              v-else
              class="pi pi-times p-mr-2"
            />
            {{slotProps.option.text}}
          </div>
        </template>
      </p-listbox>
    </template>
  </lck-overlaypanel>
</template>

<script>
import Vue from 'vue'
import Listbox from 'primevue/listbox'
import OverlayPanel from '@/components/ui/OverlayPanel/OverlayPanel'

export default {
  name: 'LckViewColumnButton',
  components: {
    'p-listbox': Vue.extend(Listbox),
    'lck-overlaypanel': OverlayPanel,
  },
  props: {
    columns: {
      type: Array,
      required: false,
      default: () => ([]),
    },
    value: {
      type: Array,
      required: false,
      default: () => ([]),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
::v-deep .p-overlaypanel.p-overlaypanel-content {
  padding: unset;
}
</style>

<style>
.p-listbox .p-listbox-list-wrapper .p-listbox-list {
  padding: 0;
}
</style>
