import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, within } from '@storybook/test'
import SignUpForm from './sign-up.vue'

const meta: Meta<typeof SignUpForm> = {
  title: 'components/auth/sign-up',
  component: SignUpForm,
}

export default meta
type Story = StoryObj<typeof SignUpForm>

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    expect.assertions(2)
    const canvas = within(canvasElement)
    const errorMessage = canvas.queryByTestId('global-error')
    await expect(errorMessage).not.toBeInTheDocument()
    const submitButton = canvas.getByRole('button', { name: "Sign up" }) as HTMLButtonElement
    await expect(submitButton.disabled).toBe(false)
  },
}

export const Loading: Story = {
  args: {
    loading: true,
  },
  play: async ({ canvasElement }) => {
    expect.assertions(1)
    const canvas = within(canvasElement)
    const submitButton = canvas.getByRole('button', { name: "Sign up" }) as HTMLButtonElement
    await expect(submitButton.disabled).toBe(true)
  },
}

export const WithErrorMessage: Story = {
  args: {
    error: new Error("An error occurred, please retry later."),
  },
  play: async ({ canvasElement }) => {
    expect.assertions(1)
    const canvas = within(canvasElement)
    const errorMessage = canvas.getByTestId('global-error')
    await expect(errorMessage).toBeInTheDocument()
  },
}
