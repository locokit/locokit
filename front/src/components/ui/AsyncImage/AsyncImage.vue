<template>
  <span v-if="!src">{{ $t('components.asyncimage.noimage') }}</span>
  <p-spinner v-else-if="loading" style="width: 1.5rem; height: 1.5rem;" />
  <img
    v-else-if="!loading && link"
    :src="link"
    :title="title"
    class="async-image"
    @click.prevent="$emit('click')"
  />
  <span
    v-else-if="error"
    class="bi bi-exclamation-circle p-text-error"
    :title="$t('components.asyncimage.error')"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import { getAttachmentBlob } from '@/services/lck-api/helpers'

export default Vue.extend({
  name: 'LckAsyncImage',
  components: {
    'p-spinner': Vue.extend(ProgressSpinner),
  },
  props: {
    src: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
  },
  data () {
    return {
      loading: false,
      link: '',
      error: false,
    }
  },
  methods: {
    async getLink () {
      if (!this.src) return
      this.loading = true
      try {
        const blob = await getAttachmentBlob(this.src)
        this.link = URL.createObjectURL(blob)
      } catch {
        this.error = true
      }
      this.loading = false
    },
  },
  watch: {
    src: {
      handler () {
        this.getLink()
      },
      immediate: true,
    },
  },
})
</script>

<style scoped>
.async-image {
  height: 100%;
  max-height: 100%;
  margin: unset;
  padding: unset;
  display: inline;
}
img:hover {
  cursor: pointer;
}
</style>
