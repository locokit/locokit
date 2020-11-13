<template>
  <p-paginator
    :rows="rows"
    :first="skip"
    :totalRecords="totalRecords"
    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
    :currentPageReportTemplate="$t('components.paginator.currentPageReportTemplate')"
    @page="onPage($event.page)"
  >
    <template #right>
      <div class="paginator-nav"
        v-if="pagesList.length > 0"
      >
        <p class="label">
          {{ $t('components.paginator.selectPagePlaceholder') }}
        </p>
        <p-dropdown
          :dropdown="true"
          :value="skip/rows"
          optionLabel="label"
          optionValue="value"
          appendTo="body"
          :options="pagesList"
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
  name: 'LckPaginator',
  components: {
    'p-dropdown': Vue.extend(Dropdown),
    'p-paginator': Vue.extend(PrimePaginator)
  },
  props: {
    rows: {
      type: Number,
      required: false,
      default: 20
    },
    skip: {
      type: Number,
      required: false,
      default: 0
    },
    totalRecords: {
      type: Number,
      required: false,
      default: 0
    }
  },
  computed: {
    pagesList () {
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
