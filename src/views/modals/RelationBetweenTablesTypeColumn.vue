<template>
  <validation-provider
    vid="relation-between-tables-id"
    tag="div"
    :name="$t('pages.databaseSchema.relationBetweenTablesType.relationTable')"
    class="p-field"
    rules="required"
    v-slot="{
        errors,
        classes
      }"
  >
    <label for="relation-between-tables-id" class="label-field-required">
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
    <span :class="classes">{{ errors[0] }}</span>
  </validation-provider></template>
<script>
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'

import { lckServices } from '@/services/lck-api'

import Dropdown from 'primevue/dropdown'

export default {
  name: 'RelationBetweenTablesTypeColumn',
  components: {
    'p-dropdown': Vue.extend(Dropdown),
    'validation-provider': Vue.extend(ValidationProvider),
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
