<template>
  <layout-with-toolbar
    class="p-d-flex p-flex-column o-auto"
    style="background-color: white; width: 30rem; border-left: 1px solid var(--header-border-bottom-color);"
  >
    <template #toolbar>
      <span class="p-pl-1">
        <span class="pi pi-th-large"/>
        Processes
      </span>

      <div class="p-d-flex p-flex-wrap">
        <p-button
          :label="$t('form.add')"
          icon="pi pi-plus-circle"
          class="p-button-text p-button-primary"
          @click="onClickCreateProcess"
        />
      </div>
      <div class="">

      </div>
    </template>
  </layout-with-toolbar>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import Vue from 'vue'
import { lckServices } from '@/services/lck-api'
import Button from 'primevue/button'
import WithToolbar from '@/layouts/WithToolbar.vue'

export default {
  name: 'ProcessListing',
  components: {
    'layout-with-toolbar': WithToolbar,
    'p-button': Vue.extend(Button)
  },
  props: {
    workspaceId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      processResult: {}
    }
  },
  methods: {
    async loadProcesses () {
      this.loading = true
      try {
        this.processResult = await lckServices.process.find({
          workspace_id: this.workspaceId
        })
      } catch (error) {
        console.error(error)
      }
      this.loading = false
    }
  },
  mounted () {
    this.loadProcesses()
  }
}
</script>
