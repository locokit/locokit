<template>
  <div>
    <p-paginator
      :totalRecords="totalRecords"
      v-bind="$attrs"
      @click="onPage($event.value)"
    />
  </div>

</template>

<script>
import Vue from 'vue'
import PrimePaginator from 'primevue/paginator'

export default {
  name: 'Paginator',
  props: {
    rowsNumber: {
      type: Number,
      default: 20
    },
    totalRecords: {
      type: Number
    }
  },
  components: {
    'p-paginator': Vue.extend(PrimePaginator)
  },
  computed: {
  },
  methods: {
    onPage (pageIndexToGo) {
      this.$emit('update-content', pageIndexToGo)
    }
  }
}
</script>

<style scoped>

</style>
