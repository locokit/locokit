<template>
  <lck-dialog-form
    :header="page.id ? $t('pages.workspace.page.edit') : $t('pages.workspace.page.create')"
    :submitting="submitting"
    :visible="visible"
    @close="$emit('close')"
    @input="$emit('input', { text: pageTextCopy, hidden: pageHiddenCopy, layout: selectedLayout })"
  >
    <validation-provider
      vid="pageTextField"
      tag="div"
      class="p-field"
      :name="$t('pages.workspace.page.pageName')"
      rules="required"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="pageTextField" class="label-field-required">{{ $t('pages.workspace.page.pageName') }}</label>
      <p-input-text
        id="pageTextField"
        v-model="pageTextCopy"
        autofocus
      />
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>
    <validation-provider
      vid="layoutType"
      tag="fieldset"
      class="p-field"
    >
      <legend>{{ $t('pages.workspace.page.layout.title') }}</legend>
      <div v-for="layoutType in layoutTypes" :key="layoutType">
        <p-radio-button
          :id="layoutType"
          :name="layoutType"
          :value="layoutType"
          v-model="selectedLayout"
        />
        <label :for="layoutType">
          {{ $t(`pages.workspace.page.layout.${layoutType}`) }}
        </label>
      </div>
    </validation-provider>
    <validation-provider
      vid="pageHiddenField"
      tag="div"
      class="p-field"
    >
      <label for="pageHiddenField">{{ $t('pages.workspace.page.pageHidden') }}</label>
      <p-input-switch
        id="pageHiddenField"
        v-model="pageHiddenCopy"
      />
    </validation-provider>
  </lck-dialog-form>
</template>

<script lang="ts">
import Vue from 'vue'

import { ValidationProvider } from 'vee-validate'

import InputText from 'primevue/inputtext'
import InputSwitch from 'primevue/inputswitch'
import RadioButton from 'primevue/radiobutton'

import LckDialogForm from '@/components/ui/DialogForm/DialogForm.vue'

const layoutTypes = [
  'classic',
  'center',
  'flex',
  'full',
]

export default {
  name: 'PageDialog',
  components: {
    'lck-dialog-form': LckDialogForm,
    'p-input-text': Vue.extend(InputText),
    'p-input-switch': Vue.extend(InputSwitch),
    'p-radio-button': Vue.extend(RadioButton),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    page: {
      type: Object,
      default: () => ({}),
    },
    submitting: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      pageTextCopy: '',
      pageHiddenCopy: false,
      layoutTypes,
      selectedLayout: null,
    }
  },
  watch: {
    page: {
      handler ({ text, hidden, layout }: { text: string; hidden: boolean; layout: string }) {
        this.pageTextCopy = text
        this.pageHiddenCopy = hidden
        this.selectedLayout = layout || this.layoutTypes[0]
      },
      immediate: true,
    },
  },
}
</script>

<style scoped>
.p-inputswitch {
  display: block;
}
</style>
