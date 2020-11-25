<template>
  <form
    class="p-fluid"
    @submit.prevent="$emit('submit')"
  >
    <slot />

    <div class="lck-form-footer">
      <p-button
        class="p-button-text p-button-secondary"
        :label="$t('form.cancel')"
        icon="pi pi-times"
        @click="$emit('cancel')"
      />
      <p-button
        :label="$t('form.save')"
        icon="pi pi-save"
        type="submit"
      />
    </div>
  </form>

</template>

<script lang="ts">
import Vue from 'vue'
import Button from 'primevue/button'

export default {
  name: 'LckForm',
  components: {
    'p-button': Vue.extend(Button)
  }
}
</script>

<style scoped>
.p-fluid .lck-form-footer {
  text-align: right;
}

.p-fluid .lck-form-footer .p-button {
  width: auto;
}
</style>
