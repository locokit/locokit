<template>
  <form
    @submit.prevent="$emit('input')"
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
            type="submit"
            icon="pi pi-check"
            class="p-button-primary"
          />
        </slot>
      </template>
    </p-dialog>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

export default {
  name: 'LckDialog',
  components: {
    'p-dialog': Vue.extend(Dialog),
    'p-button': Vue.extend(Button),
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
