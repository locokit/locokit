<template>
  <Story title="PredefinedColorPicker" icon="bi:palette-fill">
    <Variant title="default">
      <PredefinedColorPicker v-model="currentColor" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PredefinedColorPicker from '../components/PredefinedColorPicker/PredefinedColorPicker.vue'
import { ref } from 'vue'
import { ColorScheme } from '../helpers/color'

const currentColor = ref<ColorScheme>({
  backgroundColor: null,
  color: null,
})
</script>

<docs lang="md">
### PredefinedColorPicker

Allow to select available background color and text color.
</docs>
