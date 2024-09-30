import { fn } from '@storybook/test';
import LostPasswordForm from './LostPasswordForm.vue'
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof LostPasswordForm> = {
  title: 'components/forms/LostPasswordForm',
  component: LostPasswordForm,
  tags: ['autodocs'],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onSubmit: fn() },
}

export default meta;
type Story = StoryObj<typeof LostPasswordForm>;

export const Default: Story = {
  name: 'default one',
  render: () => ({
    components: { LostPasswordForm },
    template: `
      <LostPasswordForm />
    `
  })
}

// <docs lang="md">
// ### LostPasswordForm

// Form which allow an user to report the loss of his password.
// </docs>
