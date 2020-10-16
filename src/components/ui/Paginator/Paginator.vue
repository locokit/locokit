<template>
  <p-paginator
    paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #right="slotProps">
      first : {{slotProps.state.first}}
      page : {{slotProps.state.page}}
      rows : {{slotProps.state.rows}}
    </template>
  </p-paginator>
</template>

<script>
import Vue from 'vue'
import PrimePaginator from 'primevue/paginator'

export default {
  name: 'Paginator',
  components: {
    'p-paginator': Vue.extend(PrimePaginator)
  }
}
</script>

<style scoped>

</style>
