import type { Meta, StoryContext, StoryObj } from '@storybook/vue3';
import { expect, fn, userEvent, waitFor, within } from '@storybook/test'
import PasswordForm from './password.vue'

const meta: Meta<typeof PasswordForm> = {
  title: 'components/auth/password',
  component: PasswordForm,
  // Use `fn` to spy on the submit event, which will appear in the actions panel
  // once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onSubmit: fn() },
}
export default meta;

type Story = StoryObj<typeof PasswordForm>;

export const Default: Story = {
  play: async ({ args, canvasElement }: StoryContext) => {
    const canvas = within(canvasElement)

    // Initial state test.
    const errorMessage = canvas.queryByTestId('form-generic-message')
    const submitButton = canvas.getByRole('button', { name: "Save" }) as HTMLButtonElement

    await expect(errorMessage).not.toBeInTheDocument()
    await expect(submitButton.disabled).toBe(false)

    // Valid use case test.
    // <input type="password"/> elements do not have a role...
    const passwordInput1 = canvas.getByLabelText(/Password [^\(]/)
    const passwordInput2 = canvas.getByLabelText(/Password \(check\)/)

    const user = userEvent.setup({ delay: 100 })
    await user.type(passwordInput1, "password")
    await user.type(passwordInput2, "password")
    await user.click(submitButton)

    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledWith("password"));
  },
}

export const LoadingState: Story = {
  args: {
    loading: true,
  },
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement)
    const submitButton = canvas.getByRole('button', { name: "Save" }) as HTMLButtonElement
    await expect(submitButton.disabled).toBe(true)
  },
}

export const WithValidationError: Story = {
  play: async ({ args, canvasElement }: StoryContext) => {
    const canvas = within(canvasElement)
    const passwordInput1 = canvas.getByLabelText(/Password [^\(]/)
    const passwordInput2 = canvas.getByLabelText(/Password \(check\)/)
    const submitButton = canvas.getByRole('button', { name: "Save" })

    const user = userEvent.setup({ delay: 100 })
    await user.type(passwordInput1, 'password')
    await user.type(passwordInput2, 'secret')
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
