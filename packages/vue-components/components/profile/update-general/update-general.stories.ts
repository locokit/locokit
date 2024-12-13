import type { Meta, StoryContext, StoryObj } from '@storybook/vue3'
import { expect, fn, userEvent, waitFor, within } from '@storybook/test'
import UpdateGeneralForm from './update-general.vue'

const meta: Meta<typeof UpdateGeneralForm> = {
  title: 'components/profile/update-general',
  component: UpdateGeneralForm,
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

type Story = StoryObj<typeof UpdateGeneralForm>

export const Default: Story = {
  play: async ({ args, canvasElement }: StoryContext) => {
    const canvas = within(canvasElement)

    // Initial state test.
    const message = canvas.queryByTestId('form-global-message')
    const submitButton = canvas.getByRole('button', { name: "Submit" }) as HTMLButtonElement

    await expect(message).not.toBeInTheDocument()
    await expect(submitButton.disabled).toBe(false)

    // Valid use case test.
    const usernameInput = canvas.getByRole('textbox', { name: /Username/ })
    const lastNameInput = canvas.getByRole('textbox', { name: /Last name/ })
    const firstNameInput = canvas.getByRole('textbox', { name: /First name/ })

    const user = userEvent.setup({ delay: 60 })
    await user.clear(usernameInput)
      .then(() => user.type(usernameInput, 'rsmith'))
    await user.type(lastNameInput, 'Smith')
    await user.clear(firstNameInput)
      .then(() => user.type(firstNameInput, 'R.'))
    await user.click(submitButton)

    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledWith({
      id: '3e5ffeeb-af13-412a-92e8-b3f3fad50593',
      username: 'rsmith',
      lastName: 'Smith',
      firstName: 'R.',
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

    const usernameInput = canvas.getByRole('textbox', { name: /Username/ })
    const lastNameInput = canvas.getByRole('textbox', { name: /Last name/ })
    const firstNameInput = canvas.getByRole('textbox', { name: /First name/ })
    const submitButton = canvas.getByRole('button', { name: "Submit" }) as HTMLButtonElement

    // Oups, we forget to redefine a username.
    const user = userEvent.setup({ delay: 60 })
    await user.clear(usernameInput)
    await user.type(lastNameInput, 'Smith')
    await user.clear(firstNameInput)
      .then(() => user.type(firstNameInput, 'R.'))
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
