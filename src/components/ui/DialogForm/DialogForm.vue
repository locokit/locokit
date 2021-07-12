<template>
  <validation-observer v-slot="{ invalid, handleSubmit, reset }">
    <form
      @submit.prevent="handleSubmit(() => $emit('input'))"
      @reset.prevent="reset"
      v-if="visible"
    >
      <p-dialog
        :visible="visible"
        :style="{width: '600px'}"
        :header="header"
        :modal="true"
        :contentStyle="{ ...contentStyle, 'max-height': '70vh'}"
        :closeOnEscape="true"
        class="p-fluid"
        @hide="$emit('close')"
        @update:visible="$emit('close')"
      >
        <slot>
        </slot>

        <template
          #footer
        >
          <slot name='footer'>
            <p-button
              :label="$t('form.cancel')"
              icon="pi pi-times"
              class="p-button-text p-button-secondary"
              @click="$emit('close')"
            />
            <p-button
              disabled
              v-if="submitting"
              :label="$t('form.waiting')"
              icon="pi pi-spin pi-spinner"
              class="p-button-text"
            />
            <p-button
              v-else
              :label="$t('form.submit')"
              :disabled="invalid"
              type="submit"
              icon="pi pi-check"
              class="p-button-primary"
            />
          </slot>
        </template>
      </p-dialog>
    </form>
  </validation-observer>
</template>

<script lang="ts">
import Vue from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { ValidationObserver } from 'vee-validate'

export default {
  name: 'LckDialog',
  components: {
    'p-dialog': Vue.extend(Dialog),
    'p-button': Vue.extend(Button),
    'validation-observer': Vue.extend(ValidationObserver),
  },
  props: {
    header: {
      type: String,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    submitting: {
      type: Boolean,
      default: false,
    },
    contentStyle: {
      type: Object,
    },
  },
}
</script>
