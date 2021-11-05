<template>
  <p-textarea
    v-model="stringValue"
    :cols="cols"
    :placeholder="$t('components.jsonField.placeholder')"
    :rows="rows"
    @blur="onBlur"
  />
</template>

<script lang='ts'>
import Vue from 'vue'

import Textarea from 'primevue/textarea'

export default {
  name: 'JSONField',
  components: {
    'p-textarea': Vue.extend(Textarea),
  },
  props: {
    value: {
      type: Object,
      default: () => ({}),
    } as Vue.PropOptions<Record<string, unknown>>,
    rows: {
      type: String,
      default: '5',
    },
    cols: {
      type: String,
      default: '30',
    },
  },
  data () {
    return {
      stringValue: '',
    }
  },
  methods: {
    onBlur () {
      try {
        this.$emit('blur', this.stringValue ? JSON.parse(this.stringValue) : {})
      } catch (error) {
        this.$emit('error', error)
      }
    },
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler (newValue) {
        try {
          this.stringValue = newValue ? JSON.stringify(newValue, undefined, 2) : ''
        } catch (error) {
          this.stringValue = ''
          this.$emit('error', error)
        }
      },
    },
  },
}
</script>

<style scoped>
textarea {
  font-family: Consolas, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New;
}
</style>
