import type { Meta, StoryContext, StoryObj } from '@storybook/vue3'
import { expect, fn, userEvent, waitFor, within } from '@storybook/test'
import UpdateEmailForm from './update-email.vue'

const meta: Meta<typeof UpdateEmailForm> = {
  title: 'components/profile/update-email',
  component: UpdateEmailForm,
  args: {
    user: {
      id: '3e5ffeeb-af13-412a-92e8-b3f3fad50593',
      username: 'ralph',
      lastName: '',
      firstName: 'Ralph',
      email: 'ralph@example.com',
      profile: 'member',
    },
    // Use `fn` to spy on the submit event, which will appear in the actions panel
    // once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    onSubmit: fn(),
  },
}
export default meta

type Story = StoryObj<typeof UpdateEmailForm>

export const Default: Story = {
  play: async ({ args, canvasElement }: StoryContext) => {
    const canvas = within(canvasElement)

    // Initial state test.
    const message = canvas.queryByTestId('form-global-message')
    const submitButton = canvas.getByRole('button', { name: "Submit" }) as HTMLButtonElement

    await expect(message).not.toBeInTheDocument()
    await expect(submitButton.disabled).toBe(false)

    // Valid use case test.
    const emailInput = canvas.getByRole('textbox', { name: /Email/i })
    const passwordInput = canvas.getByLabelText(/Password/)

    const user = userEvent.setup({ delay: 60 })
    await user.type(emailInput, 'ralph.smith@example.com')
    await user.type(passwordInput, 'password')
    await user.click(submitButton)

    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledWith({
      id: '3e5ffeeb-af13-412a-92e8-b3f3fad50593',
      newEmail: 'ralph.smith@example.com',
      password: 'password',
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

    const emailInput = canvas.getByRole('textbox', { name: /Email/i })
    const passwordInput = canvas.getByLabelText(/Password/)
    const submitButton = canvas.getByRole('button', { name: "Submit" }) as HTMLButtonElement

    // Oups, this email address is not valid.
    const user = userEvent.setup({ delay: 60 })
    await user.type(emailInput, 'ralph.smith')
    await user.type(passwordInput, 'password')
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
