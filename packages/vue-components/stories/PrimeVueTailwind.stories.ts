import type { Meta, StoryObj } from '@storybook/vue3'

import PrimeVueTailwind from './PrimeVueTailwind.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'PrimeVue + Tailwind CSS = ❤️',
  component: PrimeVueTailwind,
} satisfies Meta<typeof PrimeVueTailwind>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {}
