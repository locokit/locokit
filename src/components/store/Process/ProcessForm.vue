<template>
  <lck-form
    @submit="$emit('input', processCloned)"
  >
    <div class="p-field">
      <label for="text">
        {{ $t('components.process.form.textLabel') }}
      </label>
      <p-input-text
        id="text"
        type="text"
        v-model="processCloned.text"
        :placeholder="$t('components.process.form.textLabel')"
      />
    </div>
    <div class="p-field">
      <label for="url">
        {{ $t('components.process.form.urlLabel') }}
      </label>
      <p-input-text
        id="url"
        type="text"
        v-model="processCloned.url"
        :placeholder="$t('components.process.form.urlLabel')"
      />
    </div>
  </lck-form>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import InputText from 'primevue/inputtext'
import Form from '@/components/ui/Form/Form.vue'
import { LckProcess } from '@/services/lck-api/definitions'

export default {
  name: 'LckProcess',
  props: {
    process: {
      type: Object as PropType<LckProcess>,
      required: true
    }
  },
  data () {
    return {
      processCloned: new LckProcess()
    }
  },
  components: {
    'p-input-text': Vue.extend(InputText),
    'lck-form': Form
  },
  watch: {
    process: {
      handler ({ id, text, url }) {
        this.processCloned = { id, text, url }
      },
      immediate: true
    }
  }
}
</script>

<style>

</style>
