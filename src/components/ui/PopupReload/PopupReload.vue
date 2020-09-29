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
  },
  methods: {
    updateAvailable () {
      this.updateExists = true
    },
    reload () {
      // Reload of the home app
      window.location.reload()
    }
  }
})
</script>
