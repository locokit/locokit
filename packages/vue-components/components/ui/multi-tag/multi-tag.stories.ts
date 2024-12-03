import type { Meta, StoryObj } from '@storybook/vue3'
import MultiTag from './multi-tag.vue'
import { COLOR_SCHEME } from '@locokit/definitions'

const meta: Meta<typeof MultiTag> = {
  title: 'components/ui/multi-tag',
  component: MultiTag,
}

const options = COLOR_SCHEME.slice(0, 6).map((color) => ({
  ...color,
  label: color.name,
}))

export default meta
type Story = StoryObj<typeof MultiTag>

export const Default: Story = {
  name: 'default one',
  render: () => ({
    components: { MultiTag },
    data: () => ({
      options,
    }),
    template: `
      <MultiTag :options="options" />
    `,
  }),
}
