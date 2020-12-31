<template>
  <p-dialog
    :visible="visible"
    :style="{ width: '600px' }"
    :modal="true"
    :contentStyle="{ 'max-height': '70vh' }"
    :closeOnEscape="true"
    class="p-fluid"
    @hide="$emit('close')"
    @update:visible="$emit('close')"
    :header="value.id ? $t('pages.workspace.editPage') : $t('pages.workspace.createPage')"
  >
    <lck-form
      @submit="$emit('input', currentData)"
      @cancel="$emit('close')"
    >
      <div class="p-field">
        <label for="PageTextField">{{ $t('pages.workspace.pageName') }}</label>
        <p-input-text
          id="PageTextField"
          v-model="currentData.text"
          required
          autofocus
        />
      </div>
      <div class="p-field">
        <label for="PageHiddenField">{{ $t('pages.workspace.pageHidden') }}</label>
        <p-input-switch
          id="PageHiddenField"
          v-model="currentData.hidden"
        />
      </div>
    </lck-form>
  </p-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import LckForm from '@/components/ui/Form/Form.vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputSwitch from 'primevue/inputswitch'

export default {
  name: 'ChapterDialog',
  components: {
    'lck-form': LckForm,
    'p-dialog': Vue.extend(Dialog),
    'p-input-text': Vue.extend(InputText),
    'p-input-switch': Vue.extend(InputSwitch)
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      currentData: {}
    }
  },
  watch: {
    value: {
      handler (newValue: {}) {
        this.currentData = {
          ...newValue
        }
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
