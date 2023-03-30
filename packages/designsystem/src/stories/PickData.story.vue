<template>
  <Story title="PickDataWithSearch" icon="bi:nintendo-switch">
    <Variant title="default">
      <PickData v-model="toData" :from-data="fromData">
        <template #fromDataHeader>Todo</template>
        <template #toDataHeader>Done</template>
        <template #item="slotProps">
          <div class="flex p-2 mb-2">
            <span
              class="w-[4rem] h-[2.5rem] rounded mx-4 self-center"
              :class="slotProps.item.color"
            />
            <div class="flex flex-col">
              <span class="font-bold text-lg">{{ slotProps.item.name }}</span>
              <span>{{ slotProps.item.description }}</span>
            </div>
          </div>
        </template>
      </PickData>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PickData from '../components/PickData/PickData.vue'
import { ref } from 'vue'

const fromData = ref<Record<string, any>[]>([
  {
    id: '1',
    name: 'Force',
    description: 'Din',
    color: 'bg-red-500',
  },
  {
    id: '2',
    name: 'Sagesse',
    description: 'Nayru',
    color: 'bg-indigo-500',
  },
])

const toData = ref<Record<string, any>[]>([
  {
    id: '3',
    name: 'Courage',
    description: 'Farore',
    color: 'bg-green-500',
  },
])
</script>

<docs lang="md">
### PickData

This component is inspired by [Primevue's PickList](https://primevue.org/picklist/).

Unlike Primevue's, this component allows you to manage a dynamic list of items but unfortunately it is not as good in Responsive and Accessibility.

The v-model is only used on the right column.
</docs>
