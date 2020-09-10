<template>
  <div class="p-mx-auto">
    <header class="p-my-4 lck-color-title p-ml-1">
      {{ $t('pages.databaseSchema.title')}}
    </header>
    <div v-if="tables" class="p-d-flex p-flex-row p-flex-wrap p-jc-start">
        <div
          v-for="table in tables"
          :key="table.id"
          class="p-shadow-8 p-pb-4 p-mx-4 p-mb-4"
          :class="{'relationIsActive' : currentRelationId === table.id}"
        >
            <div class="table-title p-px-4 p-py-2 p-text-center p-text-bold">
              {{ table.text }}
            </div>
            <div
              v-for="column in table.columns"
              :key="column.id"
              class="p-d-flex p-flew-row p-jc-between p-px-4 p-py-1"
              :class="{'table-column-key' : column.settings && column.settings.tableId}"
              @mouseover="showRelation(column.settings && column.settings.tableId)"
              @mouseleave="hideRelation"
            >
                <div :class="{'p-text-bold' : column.settings && column.settings.tableId}">
                  {{ column.text }}
                </div>
                <div class="p-ml-2">
                    {{ column.column_type_id }}
                </div>
            </div>
        </div>
    </div>
    <div v-else>
      {{ $t('pages.databaseSchema.noSchema') }}
    </div>
  </div>
</template>

<script>
import lckClient from '@/services/lck-api'

export default {
  name: 'DatabaseSchema',
  components: {},
  props: {},
  data () {
    return {
      tables: null,
      currentRelationId: null
    }
  },
  methods: {
    showRelation (relationId) {
      if (relationId) {
        this.currentRelationId = relationId
      }
    },
    hideRelation () {
      if (this.currentRelationId) {
        this.currentRelationId = null
      }
    }
  },
  async mounted () {
    // eslint-disable-next-line no-undef
    const tablesWithColumns = await lckClient.service('table').find({
      query: { $eager: '[columns]' }
    })
    if (tablesWithColumns && tablesWithColumns.data) {
      this.tables = tablesWithColumns.data
    }
  }
}
</script>

<style scoped>
  .table-title {
    background-color: #546e7a;
    color: white;
  }
  .table-column-key {
    cursor: pointer;
  }
  .table-column-key:hover {
    color: white;
  }
  .table-column-key:hover, .relationIsActive {
    background-color: RGBA(84, 110, 122, 0.4);
  }
</style>
