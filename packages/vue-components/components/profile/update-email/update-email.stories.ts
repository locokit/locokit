import { fn } from '@storybook/test';
import UpdateEmailForm from './UpdateEmailForm.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof UpdateEmailForm> = {
  title: 'components/forms/UpdateEmailForm',
  component: UpdateEmailForm,
  tags: ['autodocs'],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onSubmit: fn() },
}

export default meta;
type Story = StoryObj<typeof UpdateEmailForm>;

export const Default: Story = {
  name: 'default one',
  render: () => ({
    components: { UpdateEmailForm },
    template: `
      <UpdateEmailForm
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
// ### UpdateEmailForm

// Allow user to update its email
// </docs>
