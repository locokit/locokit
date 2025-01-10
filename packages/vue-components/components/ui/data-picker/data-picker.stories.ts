import type { Args, Meta, StoryObj } from '@storybook/vue3'
import DataPicker from './data-picker.vue'

const meta: Meta<typeof DataPicker> = {
  title: 'components/ui/data-picker',
  component: DataPicker,
}
export default meta

type Story = StoryObj<typeof DataPicker>

export const Default: Story = {
  args: {
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
    modelValue: [
      {
        id: '3',
        name: 'Courage',
        description: 'Farore',
        color: 'bg-green-500',
      },
    ],
  },
  render: (args: Args) => ({
    components: { DataPicker },
    setup() {
      return { args };
    },
    template: `
      <data-picker v-model="toData" v-bind="args">
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
  }),
}
