<template>
  <p-paginator
    paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #right>
      <div class="paginator-nav">
        <p class="label">Aller à la page</p>
        <p-dropdown
          v-if="pageslist.length > 0"
          :dropdown="true"
          :value="block.content.skip/block.content.limit"
          optionLabel="label"
          optionValue="value"
          appendTo="body"
          :options="pageslist"
          @change="onPage($event.value)"
        >
        </p-dropdown>
      </div>
    </template>
  </p-paginator>
</template>

<script>
import Vue from 'vue'
import PrimePaginator from 'primevue/paginator'
import Dropdown from 'primevue/dropdown'

export default {
  name: 'Paginator',
  components: {
    'p-paginator': Vue.extend(PrimePaginator),
    'p-dropdown': Vue.extend(Dropdown)
  }
}
</script>

<style scoped>
.paginator-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.paginator-nav p {
  margin: 0;
  font-size: 0.90rem;
}
</style>
