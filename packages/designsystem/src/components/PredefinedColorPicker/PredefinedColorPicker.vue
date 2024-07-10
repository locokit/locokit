<template>
  <div class="flex flex-col">
    <label for="color">
      {{ $t('locokit.components.predefinedColorPicker.label') }}
    </label>
    <PrimeDropdown
      input-id="color"
      :options="COLOR_SCHEME"
      :model-value="currentColor"
      data-key="backgroundColor"
      dropdown-icon="bi-chevron-down"
      :show-clear="true"
      @change="onInput"
    >
      <template #value="slotProps">
        <SingleTag
          v-if="slotProps.value.color"
          :label="$t('locokit.components.predefinedColorPicker.text')"
          :color="slotProps.value.color"
          :background-color="slotProps.value.backgroundColor"
        />
      </template>
      <template #option="slotProps">
        <SingleTag
          :label="$t('locokit.components.predefinedColorPicker.text')"
          :color="slotProps.option.color"
          :background-color="slotProps.option.backgroundColor"
        />
      </template>
    </PrimeDropdown>
    <small id="color">
      {{ $t('locokit.components.predefinedColorPicker.help') }}
    </small>
  </div>
</template>

<script setup lang="ts">
import PrimeDropdown from 'primevue/dropdown'
import { COLOR_SCHEME } from '../../helpers/color'
import type { ColorScheme } from '../../helpers/color'
import SingleTag from '../SingleTag/SingleTag.vue'
import { ref } from 'vue'

const emit = defineEmits<(e: 'update:modelValue', value: ColorScheme) => void>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    modelValue: ColorScheme | null
  }>(),
  {
    modelValue: null,
  },
)

const currentColor = ref(props.modelValue)

const onInput = (event: { value: ColorScheme }) => {
  currentColor.value = {
    color: event.value.color,
    backgroundColor: event.value.backgroundColor,
  }
  emit('update:modelValue', currentColor.value)
}
</script>
