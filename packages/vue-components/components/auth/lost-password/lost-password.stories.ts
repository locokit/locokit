import { fn } from '@storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3'
import LostPasswordForm from './lost-password.vue'

const meta: Meta<typeof LostPasswordForm> = {
  title: 'components/auth/lost-password',
  component: LostPasswordForm,
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onSubmit: fn() },
}

export default meta
type Story = StoryObj<typeof LostPasswordForm>

export const Default: Story = {
  render: () => ({
    components: { LostPasswordForm },
    template: `
      <LostPasswordForm />
    `,
  }),
}

export const WithMessage: Story = {
  render: () => ({
    components: { LostPasswordForm },
    template: `
      <LostPasswordForm :message="{status: 'error', text: 'Your email is incorrect'}" />
    `,
  }),
}
