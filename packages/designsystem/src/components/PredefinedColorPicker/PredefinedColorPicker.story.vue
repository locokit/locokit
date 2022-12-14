<template>
  <Story title="PredefinedColorPicker" icon="bi:palette">
    <Variant title="default">
      <PredefinedColorPicker
        :current-color="currentColor"
        label="Color"
        @update:current-color="logEvent('update:currentColor', $event)"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PredefinedColorPicker from './PredefinedColorPicker.vue'
import { reactive } from 'vue'
import { logEvent } from 'histoire/client'
import { ColorScheme } from '../../helpers/color'

const currentColor = reactive<ColorScheme>({
  backgroundColor: null,
  color: null,
  name: null,
})
</script>
