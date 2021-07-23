<template>
  <lck-dialog-form
    :visible.sync="visible"
    :header="
      currentData.id
      ? $t('components.datatable.toolbar.views.editLabel')
      : $t('components.datatable.toolbar.views.createLabel')
    "
    @input="$emit('input', currentData)"
    @close="$emit('close')"
  >
    <validation-provider
      vid="viewTextField"
      tag="div"
      class="p-field"
      :name="$t('components.datatable.toolbar.views.viewTextLabel')"
      rules="required"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="viewTextField">
        {{ $t('components.datatable.toolbar.views.viewTextLabel') }}
      </label>
      <span class="field-required">*</span>
      <p-input-text
        id="viewTextField"
        v-model="currentData.text"
      />
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>
    <validation-provider
      vid="viewLockedField"
      tag="div"
      class="p-field"
    >
      <label for="viewLockedField">
        {{ $t('components.datatable.toolbar.views.viewLockedLabel') }}</label>
      <p-toggle-button
        id="viewLockedField"
        v-model="currentData.locked"
        :onLabel="$t('components.datatable.toolbar.views.viewLockedLabelOn')" onIcon="pi pi-lock"
        :offLabel="$t('components.datatable.toolbar.views.viewLockedLabelOff')" offIcon="pi pi-unlock"
        iconPos="right"
      />
    </validation-provider>
  </lck-dialog-form>
</template>

<script lang="ts">
import Vue from 'vue'

import { ValidationProvider } from 'vee-validate'

import InputText from 'primevue/inputtext'
import ToggleButton from 'primevue/togglebutton'

import DialogForm from '@/components/ui/DialogForm/DialogForm.vue'

export default {
  name: 'ViewDialog',
  components: {
    'lck-dialog-form': DialogForm,
    'p-input-text': Vue.extend(InputText),
    'p-toggle-button': Vue.extend(ToggleButton),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      currentData: {},
    }
  },
  watch: {
    value: {
      handler (newValue: {}) {
        this.currentData = {
          ...newValue,
        }
      },
      immediate: true,
    },
  },
}
</script>
