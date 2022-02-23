<template>
  <iframe v-if="src" :src="src" />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { LckTableRow } from '@/services/lck-api/definitions'
import { ExternalAppURLPart, EXTERNAL_APP_URL_PART_TYPE } from '@locokit/lck-glossary/src'

export default Vue.extend({
  name: 'ExternalApp',
  props: {
    content: {
      type: Object as PropType<Record<string, LckTableRow | null>>,
    },
    settings: {
      type: Object as PropType<{ parts: ExternalAppURLPart[]}>,
    },
  },
  computed: {
    src () {
      return (this.settings as { parts: ExternalAppURLPart[]})?.parts.map(currentPart => {
        switch (currentPart.type) {
          case EXTERNAL_APP_URL_PART_TYPE.STRING:
            return currentPart.string
          case EXTERNAL_APP_URL_PART_TYPE.SOURCE:
            const currentSource = (((this.content) as Record<string, LckTableRow>)[currentPart.id as string] as LckTableRow)
            if (!currentSource) return null // then the join will be null, and we don't display the iframe before the url is complete
            if (currentPart.fieldId === 'id') {
              return currentSource.id
            } else {
              return currentSource.data[currentPart.fieldId as string]
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
  min-height: 500px;
  height: 100%;
}
</style>
