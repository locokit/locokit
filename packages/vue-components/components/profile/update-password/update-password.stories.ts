import { fn } from '@storybook/test';
import UpdatePasswordForm from './UpdatePasswordForm.vue'
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof UpdatePasswordForm> = {
  title: 'components/forms/UpdatePasswordForm',
  component: UpdatePasswordForm,
  tags: ['autodocs'],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onSubmit: fn() },
}

export default meta;
type Story = StoryObj<typeof UpdatePasswordForm>;

export const Default: Story = {
  name: 'default one',
  render: () => ({
    components: { UpdatePasswordForm },
    template: `
      <UpdatePasswordForm
        :user="{
          id: 1,
          email: 'contact@locokit.com',
          profile: 'ADMIN',
          name: 'Companion Cube',
        }"
      />
    `
  })
}

// <docs lang="md">
// ### UpdatePasswordForm

// Allow user to update its password
// </docs>