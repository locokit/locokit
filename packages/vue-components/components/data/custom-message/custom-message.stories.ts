import type { Meta, StoryObj } from '@storybook/vue3'

import CustomMessage from './custom-message.vue'

const meta: Meta<typeof CustomMessage> = {
  title: 'components/data/custom-message',
  component: CustomMessage,
}

export default meta
type Story = StoryObj<typeof CustomMessage>

export const Default: Story = {
  name: 'default one',
  render: () => ({
    components: { CustomMessage },
    template: `
      <CustomMessage status="success" custom-msg-tk-success-form="Good game" />
      <CustomMessage status="success" />
      <CustomMessage status="failed" custom-msg-tk-error-form="Try again" />
      <CustomMessage status="failed" />
    `,
  }),
}
