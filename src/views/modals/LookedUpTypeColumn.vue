<template>
  <div>
    <label for="local-field-id" class="p-mt-4 p-d-block">
      {{ $t('pages.databaseSchema.lookedUpType.localField') }}
    </label>
    <p-dropdown
      id="local-field-id"
      :disabled="!Boolean(this.localFields.length)"
      appendTo="body"
      v-model="localFieldId"
      @change="onLocalFieldChange"
      :options="localFields"
      dataKey="id"
      optionValue="id"
      optionLabel="text"
      :placeholder="$t('pages.databaseSchema.lookedUpType.localFieldPlaceholder')"
    />
    <label for="foreign-field-id" class="p-mt-4 p-d-block">
      {{ $t('pages.databaseSchema.lookedUpType.foreignField') }}
    </label>
    <p-dropdown
      id="foreign-field-id"
      :disabled="!Boolean(this.foreignFields.length)"
      appendTo="body"
      v-model="foreignFieldId"
      :options="foreignFields"
      dataKey="id"
      optionValue="id"
      optionLabel="text"
      :placeholder="$t('pages.databaseSchema.lookedUpType.foreignFieldPlaceholder')"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { lckServices } from '@/services/lck-api'
import Dropdown from 'primevue/dropdown'
import { Paginated } from '@feathersjs/feathers'
import { LckTableColumn } from '@/services/lck-api/definitions'

export default {
  name: 'LookedUpTypeColumn',
  components: {
    'p-dropdown': Vue.extend(Dropdown)
  },
  props: {
    databaseId: String,
    tableId: String,
    columnToHandle: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      relationTableId: null as string | null,
      localFields: [] as LckTableColumn[],
      localFieldId: null as string | null,
      foreignFields: [] as LckTableColumn[],
      foreignFieldId: null as string | null
    }
  },
  methods: {
    async loadLocalFields () {
      const localFields = await lckServices.tableColumn.find({
        query: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
          // eslint-disable-next-line @typescript-eslint/camelcase
          table_id: this.tableId,
          $limit: 100
        }
      }) as Paginated<LckTableColumn>
      this.localFields = localFields?.data
    },
    async loadForeignFields () {
      if (this.relationTableId) {
        const foreignFields = await lckServices.tableColumn.find({
          query: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            table_id: this.relationTableId,
            $limit: 100
          }
        }) as Paginated<LckTableColumn>
        this.foreignFields = foreignFields?.data
      }
    },
    onLocalFieldChange (data: { value: string }) {
      this.relationTableId = this.localFields?.find(field => field.id === data.value)?.table_id || null
      this.loadForeignFields()
    }
  },
  mounted () {
    if (this.columnToHandle && this.columnToHandle.settings) {
      this.localFieldId = this.columnToHandle.settings.localField
      this.foreignFieldId = this.columnToHandle.settings.foreignField
      this.relationTableId = this.columnToHandle.settings.tableId
    }
    this.loadLocalFields()
    this.loadForeignFields()
  },
  watch: {
    localFieldId () {
      this.$emit('local-field-id-change', this.localFieldId)
    },
    foreignFieldId () {
      this.$emit('foreign-field-id-change', this.foreignFieldId)
    },
    relationTableId () {
      this.$emit('relation-table-id-change', this.relationTableId)
    }
  }
}
</script>
