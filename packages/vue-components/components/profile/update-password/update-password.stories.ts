import type { Meta, StoryObj, StoryContext } from '@storybook/vue3';
import { expect, fn, userEvent, waitFor, within } from '@storybook/test';
import UpdatePasswordForm from './update-password.vue'

const meta: Meta<typeof UpdatePasswordForm> = {
  title: 'components/profile/update-password',
  component: UpdatePasswordForm,
  args: {
    // Use `fn` to spy on the submit event, which will appear in the actions panel
    // once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    onSubmit: fn(),
  },
}
export default meta

type Story = StoryObj<typeof UpdatePasswordForm>

export const Default: Story = {
  play: async ({ args, canvasElement }: StoryContext) => {
    const canvas = within(canvasElement)

    // Initial state test.
    const message = canvas.queryByTestId('form-global-message')
    const submitButton = canvas.getByRole('button', { name: "Submit" }) as HTMLButtonElement

    await expect(message).not.toBeInTheDocument()
    await expect(submitButton.disabled).toBe(false)

    // Valid use case test.
    const currentPasswordInput = canvas.getByLabelText(/Current password/i)
    const newPasswordInput = canvas.getByLabelText(/^New password/i)
    const confirmPasswordInput = canvas.getByLabelText(/Confirm/i)

    const user = userEvent.setup({ delay: 60 })
    await user.type(currentPasswordInput, 'password')
    await user.type(newPasswordInput, 'more_robust_password')
    await user.type(confirmPasswordInput, 'more_robust_password')
    await user.click(submitButton)

    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledWith({
      currentPassword: 'password',
      newPassword: 'more_robust_password',
    }))
  },
}

export const Loading: Story = {
  args: {
    loading: true,
  },
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement)
    const submitButton = canvas.getByRole('button', { name: "Submit" }) as HTMLButtonElement
    await expect(submitButton.disabled).toBe(true)
  },
}

export const WithValidationError: Story = {
  play: async ({ args, canvasElement }: StoryContext) => {
    const canvas = within(canvasElement)

    const currentPasswordInput = canvas.getByLabelText(/Current password/i)
    const newPasswordInput = canvas.getByLabelText(/^New password/i)
    const confirmPasswordInput = canvas.getByLabelText(/Confirm/i)
    const submitButton = canvas.getByRole('button', { name: "Submit" }) as HTMLButtonElement

    // Oups, new password inputs don't match.
    const user = userEvent.setup({ delay: 60 })
    await user.type(currentPasswordInput, 'password')
    await user.type(newPasswordInput, 'more_robust_password')
    await user.type(confirmPasswordInput, 'more_strong_password')
    await user.click(submitButton)

    await waitFor(() => expect(args.onSubmit).not.toHaveBeenCalled())
  },
}

export const WithMessage: Story = {
  args: {
    message: {
      status: 'error',
      text: "An error occurred, please retry later.",
    },
  },
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement)
    const errorMessage = canvas.queryByText(/An error occurred/)
    await expect(errorMessage).toBeInTheDocument()
  },
}
