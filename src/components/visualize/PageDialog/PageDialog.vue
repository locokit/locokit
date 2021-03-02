<template>
  <lck-dialog-form
    :header="page.id ? $t('pages.workspace.editPage') : $t('pages.workspace.createPage')"
    :submitting="submitting"
    :visible="visible"
    @close="$emit('close')"
    @input="$emit('input', { text: pageTextCopy, hidden: pageHiddenCopy, layout: selectedLayout })"
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
    <fieldset class="p-field">
      <legend>LAYOUT</legend>
      <div v-for="layoutType in layoutTypes" :key="layoutType.name">
        <p-radio-button
          :id="layoutType.name"
          :name="layoutType.name"
          :value="layoutType.name"
          v-model="selectedLayout"
        />
        <label :for="layoutType.name">{{ layoutType.label }}</label>
        <img :src="layoutType.img" alt=""/>
      </div>
    </fieldset>
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
import RadioButton from 'primevue/radiobutton'

const layoutTypes = [
  { name: 'classic', label: 'Mise en page classique', img: 'classic-layout' },
  { name: 'center', label: 'Mise en page centrée', img: 'centered-layout' },
  { name: 'flex', label: 'Mise en page flexible', img: 'flex-layout' },
  { name: 'full', label: 'Mise en page pleine', img: 'full-layout' }
]

export default {
  name: 'PageDialog',
  components: {
    'lck-dialog-form': LckDialogForm,
    'p-input-text': Vue.extend(InputText),
    'p-input-switch': Vue.extend(InputSwitch),
    'p-radio-button': Vue.extend(RadioButton)
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
      pageHiddenCopy: false,
      layoutTypes,
      selectedLayout: null
    }
  },
  watch: {
    page: {
      handler ({ text, hidden, layout }) {
        this.pageTextCopy = text
        this.pageHiddenCopy = hidden
        this.selectedLayout = layout
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
