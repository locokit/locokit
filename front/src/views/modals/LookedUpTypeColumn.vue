<template>
  <div>
    <validation-provider
      vid="local-field-id"
      tag="div"
      :name="$t('pages.databaseSchema.lookedUpType.localField')"
      class="p-field"
      rules="required"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="local-field-id" class="label-field-required">
        {{ $t('pages.databaseSchema.lookedUpType.localField') }}
      </label>
      <p-dropdown
        id="local-field-id"
        :disabled="!Boolean(localFields.length)"
        appendTo="body"
        v-model="localFieldId"
        @change="onLocalFieldChange"
        :options="localFields"
        dataKey="id"
        optionValue="id"
        optionLabel="text"
        :placeholder="$t('pages.databaseSchema.lookedUpType.localFieldPlaceholder')"
      />
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>
    <validation-provider
      vid="foreign-field-id"
      tag="div"
      :name="$t('pages.databaseSchema.lookedUpType.foreignField')"
      class="p-field"
      rules="required"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="foreign-field-id" class="label-field-required">
        {{ $t('pages.databaseSchema.lookedUpType.foreignField') }}
      </label>
      <p-dropdown
        id="foreign-field-id"
        :disabled="!Boolean(foreignFields.length)"
        appendTo="body"
        v-model="foreignFieldId"
        :options="foreignFields"
        dataKey="id"
        optionValue="id"
        optionLabel="text"
        :placeholder="$t('pages.databaseSchema.lookedUpType.foreignFieldPlaceholder')"
      />
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { ValidationProvider } from 'vee-validate'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { Paginated } from '@feathersjs/feathers'

import { lckServices } from '@/services/lck-api'
import { LckTableColumn } from '@/services/lck-api/definitions'

import Dropdown from 'primevue/dropdown'

export default Vue.extend({
  name: 'LookedUpTypeColumn',
  components: {
    'p-dropdown': Vue.extend(Dropdown),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    databaseId: String,
    tableId: String,
    columnToHandle: {
      type: Object,
      required: false,
    },
    columnType: {
      type: Number,
      required: false,
    },
  },
  data () {
    return {
      relationTableId: null as string | null,
      localFields: [] as LckTableColumn[],
      localFieldId: null as string | null,
      foreignFields: [] as LckTableColumn[],
      foreignFieldId: null as string | null,
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
          $limit: 100,
        },
      }) as Paginated<LckTableColumn>
      this.localFields = localFields?.data
    },
    async loadForeignFields () {
      if (this.relationTableId) {
        const foreignFields = await lckServices.tableColumn.find({
          query: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            table_id: this.relationTableId,
            ...this.foreignFieldsFilters,
            $limit: -1,
          },
        }) as LckTableColumn[]
        this.foreignFields = foreignFields
      }
    },
    onLocalFieldChange (data: { value: string }) {
      this.relationTableId = this.localFields?.find(field => field.id === data.value)?.settings.tableId || null
      this.loadForeignFields()
    },
  },
  computed: {
    foreignFieldsFilters () {
      // Prevent to have a LOOKED_UP_COLUMN linked to a VIRTUAL_LOOKED_UP_COLUMN
      return this.columnType === COLUMN_TYPE.LOOKED_UP_COLUMN
        ? {
          // eslint-disable-next-line @typescript-eslint/camelcase
          column_type_id: {
            $ne: COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN,
          },
        }
        : {}
    },
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
    },
  },
})
</script>
