<template>
    <div class="lck-page">
      <p-card class="p-col-12 p-md-8 p-xl-6 p-mt-2 p-mx-auto">
        <template #title>
          {{ $t('pages.workspaceAdmin.settings.title') }}
        </template>
        <template #content>
          <lck-workspace-form
            :workspace="workspace"
            :submitting="submitting"
            @input="saveWorkspace"
          />
        </template>
      </p-card>
    </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Vue, { PropOptions } from 'vue'

import { lckServices } from '@/services/lck-api'
import { LckWorkspace } from '@/services/lck-api/definitions'

import WorkspaceForm from '@/components/visualize/WorkspaceForm/WorkspaceForm.vue'

import Card from 'primevue/card'

export default Vue.extend({
  name: 'WorkspaceSettings',
  components: {
    'lck-workspace-form': WorkspaceForm,
    'p-card': Vue.extend(Card),
  },
  props: {
    workspaceId: {
      type: String,
      required: true,
    } as PropOptions<string>,
  },
  data () {
    return {
      workspace: null as LckWorkspace | null,
      submitting: false as boolean,
    }
  },
  async mounted () {
    await this.fetchWorkspace()
  },
  methods: {
    /**
     * Fetch the workspace.
     */
    async fetchWorkspace () {
      try {
        this.workspace = await lckServices.workspace.get(this.workspaceId)
      } catch (error: any) {
        this.displayToastOnError(error)
      }
    },
    async saveWorkspace (newWorkspace: LckWorkspace) {
      this.submitting = true
      try {
        this.workspace = await lckServices.workspace.patch(this.workspaceId, {
          ...newWorkspace,
        })
      } catch (error: any) {
        this.displayToastOnError(error)
      }
      this.submitting = false
    },
    /**
     * Display an error toast whose the content is based on the error code.
     */
    displayToastOnError (error: Error & { code: number }) {
      this.$toast.add({
        severity: 'error',
        summary: this.$t('error.basic'),
        detail: this.$t('error.http.' + error.code),
        life: 5000,
      })
    },
  },
})
</script>
