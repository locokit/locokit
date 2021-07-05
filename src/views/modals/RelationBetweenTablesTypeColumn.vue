<template>
  <div class="p-my-4">
    <label for="relation-between-tables-id">
      {{ $t('pages.databaseSchema.relationBetweenTablesType.relationTable') }}
    </label>
    <p-dropdown
      id="relation-between-tables-id"
      appendTo="body"
      v-model="relationTableId"
      :options="relationTables"
      dataKey="id"
      optionValue="id"
      optionLabel="text"
      :placeholder="$t('pages.databaseSchema.relationBetweenTablesType.relationTablePlaceholder')"
    />
  </div>
</template>
<script>
import Vue from 'vue'
import { lckServices } from '@/services/lck-api'
import Dropdown from 'primevue/dropdown'

export default {
  name: 'RelationBetweenTablesTypeColumn',
  components: {
    'p-dropdown': Vue.extend(Dropdown),
  },
  props: {
    databaseId: String,
    columnToHandle: {
      type: Object,
      required: false,
    },
  },
  data () {
    return {
      relationTables: [],
      relationTableId: null,
    }
  },
  methods: {
    async loadRelationTables () {
      const relationTables = await lckServices.table.find({
        query: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          database_id: this.databaseId,
          $limit: 100,
        },
      })
      this.relationTables = relationTables?.data
    },
  },
  mounted () {
    this.loadRelationTables()
    if (this.columnToHandle && this.columnToHandle.settings) {
      this.relationTableId = this.columnToHandle.settings.tableId
    }
  },
  watch: {
    relationTableId () {
      this.$emit('relation-table-id-change', this.relationTableId)
    },
  },
}
</script>
