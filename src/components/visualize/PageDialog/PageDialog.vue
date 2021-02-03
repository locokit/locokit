<template>
  <lck-dialog
    :visible="visible"
    :header="page.id ? $t('pages.workspace.editPage') : $t('pages.workspace.createPage')"
    @close="$emit('close')"
  >
    <lck-form
      :submitting="submitting"
      @submit="$emit('input', { text: pageTextCopy, hidden: pageHiddenCopy })"
      @cancel="$emit('close')"
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
    </lck-form>
  </lck-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import LckForm from '@/components/ui/Form/Form.vue'
import LckDialog from '@/components/ui/Dialog/Dialog.vue'
import InputText from 'primevue/inputtext'
import InputSwitch from 'primevue/inputswitch'

export default {
  name: 'PageDialog',
  components: {
    'lck-form': LckForm,
    'lck-dialog': LckDialog,
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
