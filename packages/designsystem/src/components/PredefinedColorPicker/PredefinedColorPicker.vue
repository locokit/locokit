<template>
  <div class="flex flex-col">
    <label for="color">
      {{ $t('components.predefinedColorPicker.label') }}
    </label>
    <PrimeDropdown
      input-id="color"
      :options="COLOR_SCHEME"
      :model-value="currentColor"
      data-key="backgroundColor"
      :show-clear="true"
      @change="onInput"
    >
      <template #value="slotProps">
        <SingleTag
          v-if="slotProps.value.color"
          :label="$t('components.predefinedColorPicker.text')"
          :color="slotProps.value.color"
          :background-color="slotProps.value.backgroundColor"
        />
      </template>
      <template #option="slotProps">
        <SingleTag
          :label="$t('components.predefinedColorPicker.text')"
          :color="slotProps.option.color"
          :background-color="slotProps.option.backgroundColor"
        />
      </template>
    </PrimeDropdown>
    <small id="color">
      {{ $t('components.predefinedColorPicker.help') }}
    </small>
  </div>
</template>

<script setup lang="ts">
import PrimeDropdown from 'primevue/dropdown'
import { COLOR_SCHEME, ColorScheme } from '../../helpers/color'
import { SingleTag } from '@locokit/designsystem'

const emit = defineEmits<{
  (e: 'update:currentColor', value: ColorScheme): void
}>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    currentColor: ColorScheme | null
  }>(),
  {
    currentColor: null,
  },
)

const onInput = (event: { value: ColorScheme }) => {
  emit('update:currentColor', event.value)
}
</script>
