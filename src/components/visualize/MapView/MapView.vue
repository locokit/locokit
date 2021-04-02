<template>
  <div
    v-if="definition && content && content.data"
    class="lck-mapview-block-content"
  >
    <lck-map
      v-if="resources"
      :resources="resources"
      :options="{
        maxZoom: 16,
        minZoom: 1
      }"
    />
    <span v-else>{{ $t('components.mapview.noData') }}</span>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { getLckGeoResources, LckGeoResource } from '@/services/lck-utils/map'

import { MapSettings } from '@locokit/lck-glossary'

import Map from '@/components/ui/Map/Map.vue'

export default Vue.extend({
  name: 'MapView',
  components: {
    'lck-map': Map
  },
  props: {
    definition: {
      type: Object
    },
    content: {
      type: Object
    },
    settings: {
      type: Object as PropType<MapSettings>,
      default: () => ({})
    }
  },
  computed: {
    resources (): LckGeoResource[] {
      return getLckGeoResources(this.definition?.columns, this.content?.data)
    }
  }
})
</script>

<style lang="scss" scoped>
.lck-mapview-block-content {
  height: 50vh;
}
</style>
