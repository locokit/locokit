<template>
  <p-spinner v-if="loading" />
  <img v-else-if="link" :src="link" v-bind="$attrs" />
  <span v-else>No image ?</span>
</template>

<script lang="ts">
import Vue from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import { lckClient } from '@/services/lck-api'

export default {
  name: 'LckAsyncImage',
  components: {
    'p-spinner': Vue.extend(ProgressSpinner)
  },
  props: {
    src: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      link: ''
    }
  },
  methods: {
    async getLink () {
      this.loading = true
      const jwtToken = await lckClient.authentication.getAccessToken()
      const headers = new Headers()
      headers.append('Authorization', 'Bearer ' + jwtToken)
      // Fetch the image.
      const response = await fetch(this.src, { headers })

      // Create an object URL from the data.
      const blob = await response.blob()
      this.link = URL.createObjectURL(blob)
      this.loading = false
    }
  },
  watch: {
    src: {
      handler () {
        this.getLink()
      },
      immediate: true
    }
  }
}
</script>
