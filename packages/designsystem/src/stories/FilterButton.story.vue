<template>
  <Story title="FilterButton" icon="bi:funnel-fill">
    <Variant title="default">
      <div id="test">
        <FilterButton
          append-to="#test"
          :columns-definition="columnsDefinition"
        />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import FilterButton from '../components/FilterButton/FilterButton.vue'
import { COLUMN_TYPE } from '../helpers/filter'

const columnsDefinition = [
  {
    slug: 'name',
    name: 'Name',
    column_type_id: COLUMN_TYPE.STRING,
    original_type_id: COLUMN_TYPE.STRING,
  },
  {
    slug: 'long-name',
    name: 'Field with super mego long name',
    column_type_id: COLUMN_TYPE.STRING,
    original_type_id: COLUMN_TYPE.STRING,
  },
]
</script>
