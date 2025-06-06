<template>
  <PrimeDataTable
    class="flex flex-col justify-between"
    size="small"
    :loading
    :value="items"
    showGridlines
    editMode="cell"
    @cell-edit-complete="onCellEditComplete"
    @cell-edit-init="onCellEditInit"
    @page="onPage"
  >
    <PrimeColumn
      v-for="field in fields"
      :key="field.id"
      :field="field.slug"
      :header="field.name"
      class="relative"
    >
      <template #body="slotProps">
        <div
          :title="slotProps.data[field.name]"
          class="whitespace-nowrap overflow-hidden text-ellipsis max-w-64"
        >
          {{ slotProps.data[field.name] }}
        </div>
      </template>

      <template #editor="slotProps">
        <input
          class="absolute inset-0 pl-2 rounded-none"
          type="text"
          v-model="cellValueModel"
          @keyup.enter="slotProps.editorSaveCallback"
          @keyup.escape="slotProps.editorCancelCallback"
          @blur="slotProps.editorCancelCallback"
        />
      </template>
    </PrimeColumn>
  </PrimeDataTable>
</template>

<script setup lang="ts">
import PrimeDataTable, {
  type DataTableCellEditCompleteEvent,
  type DataTableCellEditInitEvent,
} from 'primevue/datatable'
import PrimeColumn from 'primevue/column'
import { ref } from 'vue'

defineProps<{
  loading: boolean
  items: any[]
  total: number
  fields: any[]
}>()

const emit = defineEmits<{
  fetch: [params: { $skip: number; $limit: number; $sort?: Record<string, number> }]
  patch: [item: any, property: string, value: any]
}>()

function onPage(event) {
  emit('fetch', {
    $skip: event.page * 50,
    $limit: 50,
  })
}
function onCellEditComplete(event: DataTableCellEditCompleteEvent) {
  emit('patch', event.data, event.field, event.originalEvent.target.value)
}
const cellValueModel = ref()
function onCellEditInit(event: DataTableCellEditInitEvent) {
  cellValueModel.value = event.data[event.field]
}
</script>

<style>
:root {
  --p-virtualscroller-loader-mask-background: #ffffff55;
  --p-paginator-border-radius: 0;
}
.p-datatable-table {
  @apply relative;
}
.p-datatable-thead {
  @apply top-0 z-10 shadow-md;
}
</style>
