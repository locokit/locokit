import { fn } from '@storybook/test';
import UpdateGeneralForm from './UpdateGeneralForm.vue'
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof UpdateGeneralForm> = {
  title: 'components/forms/UpdateGeneralForm',
  component: UpdateGeneralForm,
  tags: ['autodocs'],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onSubmit: fn() },
}

export default meta;
type Story = StoryObj<typeof UpdateGeneralForm>;

export const Default: Story = {
  name: 'default one',
  render: () => ({
    components: { UpdateGeneralForm },
    template: `
      <UpdateGeneralForm
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
// ### UpdateGeneralForm

// Form which allow an user to update its profile if this user is already logged.
// </docs>