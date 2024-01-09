<template>
  <div class="pick-data flex text-lck mb-4">
    <div class="from-container flex-[1_1_50%]">
      <div
        class="bg-primary-lighten border-t border-x border-slate-300 p-2 font-bold rounded-t-md"
      >
        <slot name="fromDataHeader" />
      </div>
      <transition-group
        name="picklist"
        tag="ul"
        class="border border-slate-300 py-2 bg-white outline-0 max-h-[36rem] min-h-[22rem] overflow-auto"
        role="listbox"
        aria-multiselectable="true"
        :tabindex="fromData && fromData.length > 0 ? 0 : -1"
      >
        <div
          v-if="fromData.length === 0"
          class="flex items-center justify-center min-h-[20rem]"
        >
          <slot name="fromNoResult" />
        </div>
        <template v-for="(item, i) of fromData" :key="item.id">
          <li
            :id="item.id"
            class="bg-transparent cursor-pointer overflow-hidden relative [&:not(.selected)]:hover:bg-slate-200"
            :class="[
              fromSelect.find((select) => select.id === item.id)
                ? 'selected !bg-secondary-light hover:!bg-secondary-lighten'
                : '',
            ]"
            role="option"
            @click="onItemClickFrom(item)"
          >
            <slot name="item" :item="item" :index="i" />
          </li>
        </template>
      </transition-group>
      <div
        class="bg-primary-lighten border-x border-b border-slate-300 rounded-b-md p-2"
      >
        <slot name="fromDataFooter" />
      </div>
    </div>
    <div class="m-1 p-1.5 flex flex-col self-center gap-2">
      <slot name="controlsStart" />
      <PrimeButton
        class="p-button-secondary"
        type="button"
        icon="bi bi-chevron-right"
        :disabled="fromSelect.length === 0"
        @click="moveInListTo"
      />
      <PrimeButton
        class="p-button-secondary"
        type="button"
        icon="bi bi-chevron-left"
        :disabled="toSelect.length === 0"
        @click="moveInListFrom"
      />
      <slot name="controlsEnd" />
    </div>
    <div class="to-container flex-[1_1_50%]">
      <div
        class="bg-primary-lighten border-t border-x border-slate-300 p-2 font-bold rounded-t-md"
      >
        <slot name="toDataHeader" />
      </div>
      <transition-group
        name="picklist"
        tag="ul"
        class="border border-slate-300 py-2 bg-white outline-0 max-h-[36rem] min-h-[22rem] overflow-auto"
        role="listbox"
        aria-multiselectable="true"
        :tabindex="toData && toData.length > 0 ? 0 : -1"
      >
        <div
          v-if="toData.length === 0"
          class="flex items-center justify-center min-h-[20rem]"
        >
          <slot name="toNoResult" />
        </div>
        <template v-for="(item, i) of toData" :key="item.id">
          <li
            :id="item.id"
            class="bg-transparent cursor-pointer overflow-hidden relative [&:not(.selected)]:hover:bg-slate-200"
            :class="[
              toSelect.find((select) => select.id === item.id)
                ? 'selected !bg-secondary-light hover:!bg-secondary-lighten'
                : '',
            ]"
            role="option"
            @click="onItemClickTo(item)"
          >
            <slot name="item" :item="item" :index="i" />
          </li>
        </template>
      </transition-group>
      <div
        class="bg-primary-lighten border-x border-b border-slate-300 rounded-b-md p-2"
      >
        <slot name="toDataFooter" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PrimeButton from 'primevue/button'
import { ref, watch } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fromData: Array<Record<string, any>>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelValue: Array<Record<string, any>>
  }>(),
  {},
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromSelect = ref<Array<Record<string, any>>>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toSelect = ref<Array<Record<string, any>>>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toData = ref<Array<Record<string, any>>>(props.modelValue)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onItemClickFrom = (item: Record<string, any>) => {
  const alreadySelected = fromSelect.value.findIndex(({ id }) => id === item.id)
  if (alreadySelected >= 0) {
    fromSelect.value.splice(alreadySelected, 1)
  } else {
    fromSelect.value.push(item)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onItemClickTo = (item: Record<string, any>) => {
  const alreadySelected = toSelect.value.findIndex(({ id }) => id === item.id)
  if (alreadySelected >= 0) {
    toSelect.value.splice(alreadySelected, 1)
  } else {
    toSelect.value.push(item)
  }
}

const moveInListTo = () => {
  if (fromSelect.value.length > 0) {
    fromSelect.value.forEach((select) => {
      toData.value.push(select)
    })
    fromSelect.value = []
    emit('update:modelValue', toData)
  }
}

const moveInListFrom = () => {
  if (toSelect.value.length > 0) {
    toSelect.value.forEach((select) => {
      const indexToRemove = toData.value.findIndex(({ id }) => id === select.id)
      toData.value.splice(indexToRemove, 1)
    })
    toSelect.value = []
    emit('update:modelValue', toData)
  }
}

watch(
  () => props.modelValue,
  (modelValue) => {
    toData.value = modelValue
  },
)
</script>
