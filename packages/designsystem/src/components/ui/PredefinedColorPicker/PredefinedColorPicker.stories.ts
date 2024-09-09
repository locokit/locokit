import PredefinedColorPicker from './PredefinedColorPicker.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof PredefinedColorPicker> = {
  title: 'components/ui/PredefinedColorPicker',
  component: PredefinedColorPicker,
  tags: ['autodocs'],
}

export default meta;
type Story = StoryObj<typeof PredefinedColorPicker>;

export const Default: Story = {
  name: 'default one',
  render: () => ({
    components: { PredefinedColorPicker },
    data: () => ({
      currentColor: {
        backgroundColor: null,
        color: null,
      }
    }),
    template: `
      <PredefinedColorPicker v-model="currentColor" />
    `
  })
}
      
// <docs lang="md">
// ### PredefinedColorPicker

// Allow to select available background color and text color.
// </docs>
