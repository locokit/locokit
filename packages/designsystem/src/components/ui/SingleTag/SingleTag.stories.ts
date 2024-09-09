// <style scoped>
// .wrapper {
//   display: grid;
//   grid-gap: 4px;
//   grid-template-columns: repeat(8, 100px);
//   grid-template-rows: 60px 60px 60px 60px;
//   grid-auto-flow: column;
// }
// </style>

import type { Meta, StoryObj } from '@storybook/vue3';
import SingleTag from './SingleTag.vue';
import { COLOR_SCHEME } from '@/helpers/color'

const meta: Meta<typeof SingleTag> = {
  title: 'components/ui/SingleTag',
  component: SingleTag,
  tags: ['autodocs'],
}
 
export default meta;
type Story = StoryObj<typeof SingleTag>;

export const Default: Story = {
  name: 'default one',
  render: () => ({
    components: { SingleTag },
    template: `
      <SingleTag class="m-4" label="placeholder" />
    `
  })
}
export const Example: Story = {
  name: 'example',
  render: () => ({
    components: { SingleTag },
    data: () =>  ({
      COLOR_SCHEME
    }),
    template: `
      <SingleTag class="m-4" v-bind="COLOR_SCHEME[17]" label="placeholder" />
    `
  })
}
export const AllColors: Story = {
  name: 'all colors',
  render: () => ({
    components: { SingleTag },
    data: () =>  ({
      COLOR_SCHEME
    }),
    template: `
      <div v-for="color in COLOR_SCHEME" :key="color.name">
        <SingleTag class="m-4" v-bind="color" label="placeholder" />
      </div>
    `
  })
}

// <docs lang="md">
// ### SingleTag

// Add a tag for single select or display a tag
// </docs>