<template>
  <lck-overlaypanel
    icon="pi pi-list"
    class-button="p-button-outlined p-button-secondary"
    :label="label"
  >
    <template #overlay-content="overlaySlotProps">
      <p-datatable
        :autoLayout="true"
        class="p-datatable-sm p-mb-2"
        dataKey="id"
        selectionMode="single"
        :value="views"
        @row-reorder="$emit('reorder', $event)"
        @row-select="$emit('input', $event.data.id)"
      >
        <template #empty>
          {{ $t("components.datatable.toolbar.views.noview") }}
        </template>
        <p-column
          bodyClass="handle"
          :rowReorder="true"
          rowReorderIcon="pi pi-ellipsis-v"
        />
        <p-column>
          <template #body="slotProps">
            <span
              :class="{
                'p-text-bold': slotProps.data.id === value,
              }"
            >
              <span v-if="slotProps.data.locked">
                <i class="pi pi-lock" />
              </span>
              {{ slotProps.data.text }}
            </span>
          </template>
        </p-column>
        <p-column bodyClass="fit">
          <template #body="slotProps">
            <span class="p-buttonset">
              <p-button
                class="p-button-sm p-button-text p-button-rounded p-button-info"
                icon="pi pi-pencil"
                @click="emitEvent('update', overlaySlotProps.toggleOverlayPanel, slotProps.data)"
              />
              <p-button
                v-if="!slotProps.data.locked"
                class="p-button-sm p-button-text p-button-rounded p-button-danger"
                icon="pi pi-trash"
                @click="emitEvent('delete', overlaySlotProps.toggleOverlayPanel, slotProps.data)"
              />
            </span>
          </template>
        </p-column>
      </p-datatable>
      <p-button
        :label="$t('components.datatable.toolbar.views.createLabel')"
        class="create-view-button"
        icon="pi pi-plus-circle"
        @click="emitEvent('create', overlaySlotProps.toggleOverlayPanel)"
      />
    </template>
  </lck-overlaypanel>
</template>

<script>
import Vue from 'vue'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import OverlayPanel from '@/components/ui/OverlayPanel/OverlayPanel'

export default {
  name: 'LckViewButton',
  components: {
    'p-button': Vue.extend(Button),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'lck-overlaypanel': OverlayPanel,
  },
  props: {
    views: {
      type: Array,
      required: false,
      default: () => ([]),
    },
    value: {
      type: String,
      required: false,
    },
  },
  data () {
    return {
      drag: false,
    }
  },
  computed: {
    label () {
      if (this.views.length === 0) return this.$t('components.datatable.toolbar.views.noview')
      return this.views.find(v => v.id === this.value)?.text
    },
  },
  methods: {
    emitEvent (eventName, toggleOverlayPanel, data) {
      toggleOverlayPanel()
      this.$emit(eventName, data)
    },
  },
}
</script>

<style scoped>
/deep/ .handle i {
  cursor: move;
}
/deep/ .handle,
.p-button.p-button-icon-only.p-button-sm {
  width: 1.5rem;
  padding: 0.5rem;
}
/deep/ .p-datatable-wrapper .p-datatable-thead > tr > th {
  background-color: transparent;
}
/deep/ .p-datatable-wrapper .p-datatable-tbody > tr > td.fit {
  width: 1%;
  text-align: right;
}
.create-view-button {
  width: 100%;
}
</style>
