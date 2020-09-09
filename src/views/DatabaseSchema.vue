<template>
  <div class="p-mx-auto">
    <header class="p-my-4 lck-color-title p-ml-1">
      {{ $t('pages.databaseSchema.title')}}
    </header>
    <div v-if="schema" class="p-d-flex p-flex-row p-flex-wrap p-jc-start">
        <div
          v-for="table in schema.tables"
          :key="table.id"
          class="p-shadow-8 p-pb-4 p-mx-4 p-mb-4"
          :class="{'relationIsActive' : currentRelationId === table.id}"
        >
            <div class="schema-table-title p-px-4 p-py-2 p-text-center p-text-bold">
              {{ table.text }}
            </div>
            <div
              v-for="column in table.columns"
              :key="column.id"
              class="p-d-flex p-flew-row p-jc-between p-px-4 p-py-1"
              :class="{'schema-table-column-key' : column.settings && column.settings.tableId}"
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
export default {
  name: 'DatabaseSchema',
  components: {},
  props: {},
  data () {
    return {
      schema: null,
      currentRelationId: null
    }
  },
  methods: {
    showRelation (relationId) {
      if (relationId) {
        console.log('showRelation', relationId)
        this.currentRelationId = relationId
      }
    },
    hideRelation () {
      this.currentRelationId = null
    }
  },
  async mounted () {
    const token = localStorage.getItem('lck-auth')
    // eslint-disable-next-line no-undef
    const request = LCK_SETTINGS.API_URL + '/database?$eager=tables.[columns]'
    const headers = new Headers()
    headers.append('Authorization', 'Bearer ' + token)
    headers.append('content-type', 'application/json')
    const requestInit = {
      method: 'GET',
      headers
    }
    const schema = await fetch(request, requestInit).then((response) => response.json())
    console.log('schema', schema)
    // for now, by default, we use 0 as index database
    this.schema = schema.data[0]
  }
}
</script>

<style scoped>
  .schema-table-title {
    background-color: #546e7a;
    color: white;
  }
  .schema-table-column-key {
    cursor: pointer;
  }
  .schema-table-column-key:hover, .relationIsActive {
    background-color: RGBA(84, 110, 122, 0.4);
  }
  .schema-table-column-key:hover {
    color: white;
  }
</style>
