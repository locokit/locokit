<template>
  <div class="flex flex-row w-full py-1 shadow h-12 rounded">
    <i class="self-center mx-2 bi" :class="[icon, colorIcon]" />
    <div class="flex flex-col w-full mr-1">
      <span>
        {{ title }}
      </span>
      <p v-if="subtitle" class="text-xs line-clamp-1">
        {{ subtitle }}
      </p>
    </div>
    <div v-if="nameTag" class="self-center text-xs mr-1">
      <SingleTag
        v-tooltip="nameTag"
        :label="nameTag"
        :color="colorTag"
        :background-color="bgColorTag"
        :border-color="borderColorTag"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SingleTag from '../SingleTag/SingleTag.vue'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string | null
    icon: string
    colorIcon?: string | null
    nameTag?: string | null
    colorTag?: string | null
    bgColorTag?: string | null
    borderColorTag?: string | null
  }>(),
  {
    subtitle: null,
    colorIcon: null,
    nameTag: null,
    colorTag: null,
    bgColorTag: null,
    borderColorTag: null,
  },
)
</script>
