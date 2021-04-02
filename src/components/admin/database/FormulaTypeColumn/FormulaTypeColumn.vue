<template>
  <div class="p-field">
    <label for="column-formula">My formula</label>
    <p-input-text
      v-model="formula"
      @input="$emit('formula-change', $event)"
      id="column-formula"
      type="text"
    />
  </div>
</template>

<script>
import Vue from 'vue'

import InputText from 'primevue/inputtext'

export default {
  name: 'FormulaTypeColumn',
  components: {
    'p-input-text': Vue.extend(InputText)
  },
  props: {
    columnToHandle: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      formula: ''
    }
  },
  methods: {

  },
  watch: {
    'columnToHandle.settings.formula': {
      handler (newValue = '') {
        this.formula = newValue
      },
      immediate: true//,
      // deep: true
    }
  }
}
</script>

<style scoped>

</style>
