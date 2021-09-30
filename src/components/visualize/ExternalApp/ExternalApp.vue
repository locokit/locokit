<template>
  <iframe
    :src="src"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { LckTableRow } from '@/services/lck-api/definitions'
import { ExternalAppURLPart, EXTERNAL_APP_URL_PART_TYPE } from '@locokit/lck-glossary'

export default Vue.extend({
  name: 'ExternalApp',
  props: {
    id: {
      type: String,
    },
    content: {
      type: Object as PropType<Record<string, LckTableRow | null>>,
    },
    settings: {
      type: Object as PropType<{ parts: ExternalAppURLPart[]}>,
    },
  },
  computed: {
    src () {
      return (this.settings as { parts: ExternalAppURLPart[]}).parts.map(currentPart => {
        switch (currentPart.type) {
          case EXTERNAL_APP_URL_PART_TYPE.STRING:
            return currentPart.string
          case EXTERNAL_APP_URL_PART_TYPE.SOURCE:
            if (currentPart.fieldId === 'id') {
              return (((this.content) as Record<string, LckTableRow>)[currentPart.id as string] as LckTableRow).id
            } else {
              return (((this.content) as Record<string, LckTableRow>)[currentPart.id as string] as LckTableRow).data[currentPart.fieldId as string]
            }
        }
      }).join('')
    },
  },
})
</script>

<style scoped>
iframe {
  border: unset;
  width: 100%;
  height: 100%;
}
</style>
