import { fn } from '@storybook/test';
import SignUpForm from './SignUpForm.vue'
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof SignUpForm> = {
  title: 'components/forms/signup-form',
  component: SignUpForm,
  tags: ['autodocs'],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onSubmit: fn() },
}

export default meta;
type Story = StoryObj<typeof SignUpForm>;

export const Default: Story = {
  name: 'default one',
  render: () => ({
    components: { SignUpForm },
    template: `
      <SignUpForm />
    `
  })
}

      
// <docs lang="md">
// ### SignUp

// Allow an user to sign up.
// </docs>