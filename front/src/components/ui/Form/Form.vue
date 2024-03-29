<template>
  <validation-observer v-slot="{ valid, reset, pristine }" tag="div">
    <form
      class="p-fluid"
      @submit.prevent="$emit('submit')"
      @reset.prevent="reset"
      ref="lck-form-record"
    >
      <slot />

      <div class="lck-form-footer">
        <p-button
          v-if="displayDeleteButton"
          class="p-button-text p-button-danger p-mr-auto"
          :class="{ 'full-width-button': fullWidthButton }"
          :label="$t('form.delete')"
          icon="bi bi-trash"
          @click="$emit('delete')"
        />
        <p-button
          v-if="displayCancelButton"
          class="p-button-text p-button-secondary"
          :class="{ 'full-width-button': fullWidthButton }"
          :label="$t('form.cancel')"
          icon="pi pi-times"
          @click="$emit('cancel')"
        />
        <p-button
          disabled
          v-if="submitting"
          :label="$t('form.waiting')"
          icon="pi pi-spin pi-spinner"
          :class="{ 'p-button-text': true, 'full-width-button': fullWidthButton }"
        />
        <p-button
          v-else
          :class="{ 'full-width-button': fullWidthButton }"
          :disabled="!valid || pristine"
          :label="labelButtonSave || $t('form.save')"
          icon="pi pi-save"
          type="submit"
        />

      </div>
    </form>
  </validation-observer>
</template>

<script lang="ts">
import Vue from 'vue'
import Button from 'primevue/button'
import { ValidationObserver } from 'vee-validate'

export default Vue.extend({
  name: 'LckForm',
  components: {
    'p-button': Vue.extend(Button),
    'validation-observer': Vue.extend(ValidationObserver),
  },
  props: {
    submitting: {
      type: Boolean,
      default: false,
    },
    displayCancelButton: {
      type: Boolean,
      default: true,
    },
    displayDeleteButton: {
      type: Boolean,
      default: false,
    },
    fullWidthButton: {
      type: Boolean,
      default: false,
    },
    reset: {
      type: Boolean,
      default: false,
    },
    labelButtonSave: {
      type: String,
      default: '',
    },
  },
  watch: {
    reset (newValue: boolean) {
      if (newValue) {
        (this.$refs['lck-form-record'] as HTMLFormElement).reset()
        this.$emit('reset-form')
      }
    },
  },
})
</script>

<style scoped>
.p-fluid .lck-form-footer {
  text-align: right;
}

.p-fluid .lck-form-footer .p-button {
  width: auto;
}

.p-fluid .lck-form-footer .full-width-button {
  width: 100%;
}
</style>
