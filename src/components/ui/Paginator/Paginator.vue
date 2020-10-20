<template>
  <p-paginator
    :rows="rows"
    :totalRecords="totalRecords"
    :template="paginatorTemplate"
    :currentPageReportTemplate="currentPageReportTemplate"
    @page="onPage($event.page)"
  >
    <template #right>
      <div class="paginator-nav">
        <p class="label">Aller à la page</p>
        <p-dropdown
          v-if="pageslist.length > 0"
          :dropdown="true"
          :value="skip/rows"
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
  name: 'LCKPaginator',
  components: {
    'p-dropdown': Vue.extend(Dropdown),
    'p-paginator': Vue.extend(PrimePaginator)
  },
  props: {
    rows: {
      type: Number,
      required: true
    },
    skip: {
      type: Number,
      required: true
    },
    totalRecords: {
      type: Number,
      required: true
    },
    paginatorTemplate: {
      type: String,
      default: 'FirstPageLink PrevPageLink NextPageLink LastPageLink'
    },
    currentPageReportTemplate: {
      type: String,
      default: "$t('components.paginator.currentPageReportTemplate')"
    }
  },
  computed: {
    pageslist () {
      return Array.from({ length: Math.ceil(this.totalRecords / this.rows) }, (_, i) => ({
        value: i,
        label: i + 1
      }))
    }
  },
  methods: {
    onPage (pageIndexToGo) {
      this.$emit('update-content', pageIndexToGo)
    }
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
