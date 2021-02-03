<template>
  <lck-dialog-form
    :header="page.id ? $t('pages.workspace.editPage') : $t('pages.workspace.createPage')"
    :submitting="submitting"
    :visible="visible"
    @close="$emit('close')"
    @input="$emit('input', { text: pageTextCopy, hidden: pageHiddenCopy })"
  >
    <div class="p-field">
      <label for="pageTextField">{{ $t('pages.workspace.pageName') }}</label>
      <p-input-text
        id="pageTextField"
        v-model="pageTextCopy"
        required
        autofocus
      />
    </div>
    <div class="p-field">
      <label for="PageHiddenField">{{ $t('pages.workspace.pageHidden') }}</label>
      <p-input-switch
        id="PageHiddenField"
        v-model="pageHiddenCopy"
      />
    </div>
  </lck-dialog-form>
</template>

<script lang="ts">
import Vue from 'vue'
import LckDialogForm from '@/components/ui/DialogForm/DialogForm.vue'
import InputText from 'primevue/inputtext'
import InputSwitch from 'primevue/inputswitch'

export default {
  name: 'PageDialog',
  components: {
    'lck-dialog-form': LckDialogForm,
    'p-input-text': Vue.extend(InputText),
    'p-input-switch': Vue.extend(InputSwitch)
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    page: {
      type: Object,
      default: () => ({})
    },
    submitting: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      pageTextCopy: '',
      pageHiddenCopy: false
    }
  },
  watch: {
    page: {
      handler ({ text, hidden }) {
        this.pageTextCopy = text
        this.pageHiddenCopy = hidden
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.p-inputswitch {
  display: block;
}
</style>
