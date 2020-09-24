<template>
  <div id="popup">
    <p-dialog
      :header="$t('sw.newVersion')"
      :visible.sync="updateExists"
      position="bottomright"
      modal="true"
    >
      <p class="p-m-0">{{ $t('sw.message') }}</p>
      <template #footer>
        <p-button
          :label="$t('sw.cancel')"
          icon="pi pi-times"
          class="p-button-text"
          @click="updateExists = false"
        />

        <p-button
          :label="$t('sw.update')"
          icon="pi pi-check"
          class="p-button-text"
          @click="reload"
          autofocus
        />
      </template>
    </p-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

export default Vue.extend({
  components: {
    'p-button': Vue.extend(Button),
    'p-dialog': Vue.extend(Dialog)
  },
  data: () => ({
    refreshing: false,
    registration: null,
    updateExists: false
  }),
  created () {
    // Listen for swUpdated event and display refresh modal.
    document.addEventListener('swUpdated', this.updateAvailable, { once: true })
    // Listen for controllerchange event from Service Worker to update the app.
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Force update data
      if (this.refreshing) return
      this.refreshing = true
      // Reload of the home app
      window.location.reload()
    })
  },
  methods: {
    updateAvailable (event) {
      this.registration = event.detail
      this.updateExists = true
    },
    reload () {
      // Prevent for error in registration data
      if (!this.registration || !this.registration.waiting) { return }
      // Send message to Service Worker to skyWaiting and update app
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      // Close modal
      this.updateExists = false
    }
  }
})
</script>
