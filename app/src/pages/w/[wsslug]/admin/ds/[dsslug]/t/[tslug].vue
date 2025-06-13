<template>
  <main class="flex flex-col h-full max-h-full">
    <div class="min-h-12 h-12 border-b p-3">Filtres (à venir) {{ idField }}</div>
    <data-table
      v-if="currentTable"
      class="grow overflow-auto"
      :loading="stateRecords.loading"
      :items="stateRecords.records"
      :total="stateRecords.total"
      :fields="currentTable.fields"
      @fetch="onFetch"
      @patch="onPatch"
    />
    <prime-paginator
      class="bg-white"
      :rows="50"
      :totalRecords="stateRecords.total"
      template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      @page="onFetch({ first: $event.page * 50 })"
    />
  </main>
</template>

<script setup lang="ts">
import ROUTE_NAMES from '@/router/routes'
import { useRoute } from 'vue-router'
import { computed, inject, watch } from 'vue'
import DataTable from '@/components/data-table.vue'
import PrimePaginator from 'primevue/paginator'
import type { DatasourceResult } from '@locokit/sdk/dist/src/services/core/datasource/datasource.schema'
import { useRecords } from '@/composables/useRecords'

const route = useRoute()

definePage({
  name: ROUTE_NAMES.WORKSPACE.ADMIN.DATASOURCES.TABLES.SLUG,
})
const datasource = inject<DatasourceResult>('datasource')

const { state: stateRecords, fetchRecords } = useRecords()

const serviceRecordParams = computed(() => ({
  workspace: route.params.wsslug,
  datasource: route.params.dsslug,
  table: route.params.tslug,
}))

const currentTable = computed(() => {
  if (!datasource.value?.tables) return null
  return datasource.value.tables.find((t) => t.slug === route.params.tslug)
})
const idField = computed(() => {
  console.log(currentTable.value)
  if (!currentTable.value) return null
  return currentTable.value.fields?.filter((f) => f.primary)
})

async function onFetch(params: { first: number }) {
  await fetchRecords(serviceRecordParams.value, {
    $skip: params.first,
    $limit: 50,
  })
}

async function onPatch(item, field, value) {
  console.log('on patch', item, field, value, idField.value)
}

watch(
  () => route.params.tslug,
  async () => {
    await fetchRecords(serviceRecordParams.value, {
      $skip: 0,
      $limit: 50,
    })
  },
  {
    immediate: true,
  },
)
</script>
