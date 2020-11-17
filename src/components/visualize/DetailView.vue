<template>
  <div>
    <lck-dataDetail
      :crudMode="true"
      :definition="definition"
      :row="row"
      :autocompleteItems="autocompleteItems"
    />
<!--    <lck-dataDetail-->
<!--      :crudMode="true"-->
<!--      :definition="definition"-->
<!--      :row="row"-->
<!--      :autocompleteItems="autocompleteItems"-->
<!--      @update-suggestions="updateLocalAutocompleteSuggestions"-->
<!--      @update-cell="onUpdateCell"-->
<!--    />-->
  </div>
</template>

<script>
import Vue from 'vue'

import DataDetail from '@/components/store/DataDetail/DataDetail.vue'

import { retrieveRow, retrieveViewDefinition } from '@/store/visualize'

export default Vue.extend({
  name: 'DetailView',
  components: {
    'lck-dataDetail': DataDetail
  },
  props: {
    settings: {
      type: Object,
      default: () => (
        {}
      )
    }
  },
  data () {
    return {
      definition: {},
      autocompleteItems: null,
      row: {}
    }
  },
  async mounted () {
    this.definition = await retrieveViewDefinition(this.settings?.id)
    this.row = await retrieveRow(this.$route.query.rowId)
  }
  // Todo: Mounted get TableView -> content
})
</script>
