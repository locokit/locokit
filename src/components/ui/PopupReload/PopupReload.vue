<template>
  <p-dialog
    :header="$t('sw.newVersion')"
    position="bottomright"
    :modal="true"
    :visible="true"
    @update:visible="$emit('cancel')"
  >
    <p class="p-m-0">{{ $t('sw.message') }}</p>
    <template #footer>
      <p-button
        :label="$t('sw.cancel')"
        icon="pi pi-times"
        class="p-button-text"
        @click="$emit('cancel')"
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
</template>

<script lang="ts">
import Vue from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

export default Vue.extend({
  name: 'lck-popup-reload',
  components: {
    'p-button': Vue.extend(Button),
    'p-dialog': Vue.extend(Dialog)
  },
  methods: {
    reload () {
      // Reload of the home app
      window.location.reload()
    }
  }
})
</script>
