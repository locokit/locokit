import type { Meta, StoryContext, StoryObj } from '@storybook/vue3'
import { expect, fn, userEvent, waitFor, within } from '@storybook/test'
import SignUpForm from './sign-up.vue'

const meta: Meta<typeof SignUpForm> = {
  title: 'components/auth/sign-up',
  component: SignUpForm,
  // Use `fn` to spy on the submit event, which will appear in the actions panel
  // once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onSubmit: fn() }
}
export default meta

type Story = StoryObj<typeof SignUpForm>

export const Default: Story = {
  play: async ({ args, canvasElement }: StoryContext) => {
    const canvas = within(canvasElement)

    // Initial state test.
    const errorMessage = canvas.queryByTestId('form-generic-message')
    const submitButton = canvas.getByRole('button', { name: "Sign up" }) as HTMLButtonElement

    await expect(errorMessage).not.toBeInTheDocument()
    await expect(submitButton.disabled).toBe(false)

    // Valid use case test.
    const usernameInput = canvas.getByRole('textbox', { name: /Username/ })
    const emailInput = canvas.getByRole('textbox', { name: /Email/ })

    const user = userEvent.setup({ delay: 100 })
    await user.type(usernameInput, 'ralph')
    await user.type(emailInput, 'ralph@example.com')
    await user.click(submitButton)

    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledWith({
      username: 'ralph',
      email: 'ralph@example.com',
    }));
  },
}

export const LoadingState: Story = {
  args: {
    loading: true,
  },
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement)
    const submitButton = canvas.getByRole('button', { name: "Sign up" }) as HTMLButtonElement
    await expect(submitButton.disabled).toBe(true)
  },
}

export const WithValidationError: Story = {
  play: async ({ args, canvasElement }: StoryContext) => {
    const canvas = within(canvasElement)
    const usernameInput = canvas.getByRole('textbox', { name: /Username/ })
    const emailInput = canvas.getByRole('textbox', { name: /Email/ })
    const submitButton = canvas.getByRole('button', { name: "Sign up" }) as HTMLButtonElement

    const user = userEvent.setup({ delay: 100 })
    await user.type(usernameInput, 'ralph')
    await user.type(emailInput, 'ralph')
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
