import { fn } from '@storybook/test';
import PasswordForm from './PasswordForm.vue'
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof PasswordForm> = {
  title: 'components/forms/PasswordForm',
  component: PasswordForm,
  tags: ['autodocs'],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onSubmit: fn() },
}

export default meta;
type Story = StoryObj<typeof PasswordForm>;

export const Default: Story = {
  name: 'default one',
  render: () => ({
    components: { PasswordForm },
    template: `
      <PasswordForm
        label-tk-submit="Change password"
      />
    `
  })
}

// <docs lang="md">
// ### PasswordForm

// Form which allow an user to reset his password.

// This form is actually used for the reset password and the verify signup page.

// This is the main reason the submit button has a props
// specifying its label.
// </docs>
