import type { Meta, StoryObj } from '@storybook/vue3';
import ButtonLocokit from './ButtonLocokit.vue';
import { fn } from '@storybook/test';
 
const meta: Meta<typeof ButtonLocokit> = {
  title: 'components/ui/ButtonLocokit',
  component: ButtonLocokit,
};
 
export default meta;
type Story = StoryObj<typeof ButtonLocokit>;

export const Default: Story = {
  name: 'default one',
  args: {
    onClick: fn()
  }
}

// <docs lang="md">
// ### ButtonLocokit

// Allow to create a new workspace
// </docs>
