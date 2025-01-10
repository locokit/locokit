import PickData from './PickData.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta: Meta<typeof PickData> = {
  title: 'components/ui/PickDataWithSearch',
  component: PickData,
  tags: ['autodocs'],
}

export default meta;
type Story = StoryObj<typeof PickData>;

export const Default: Story = {
  name: 'default one',
  render: () => ({
    components: { PickData },
    data: () => ({
      fromData: [
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
      ],
      toData: [
        {
          id: '3',
          name: 'Courage',
          description: 'Farore',
          color: 'bg-green-500',
        },
      ]
    }),
    template: `
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
    `
  })
}

// <docs lang="md">
// ### PickData

// This component is inspired by [Primevue's PickList](https://primevue.org/picklist/).

// Unlike Primevue's, this component allows you to manage a dynamic list of items but unfortunately it is not as good in Responsive and Accessibility.

// The v-model is only used on the right column.
// </docs>
