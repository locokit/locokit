<template>
  <div
    class="h-full"
  >
    <h1>Workspace</h1>
    {{ workspaceId }}
    <br/>
    <h1>Sections</h1>
    {{ sections }}<br/>
    <h1>Tables</h1>
    {{ tables }}<br/>
    <h1>Rows</h1>
    {{ rows }}
  </div>
</template>

<script>
import { retrieveChapters, retrieveTables, retrieveRows } from '@/store/visualize'

export default {
  name: 'Workspace',
  props: {
    workspaceId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      sections: [],
      tables: [],
      rows: []
    }
  },
  async mounted () {
    this.sections = await retrieveChapters(this.workspaceId)
    this.tables = await retrieveTables(1)
    this.rows = await retrieveRows()
  }
}
</script>
