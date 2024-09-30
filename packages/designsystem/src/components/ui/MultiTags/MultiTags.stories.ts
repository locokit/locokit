import type { Meta, StoryObj } from '@storybook/vue3';
import MultiTags from './MultiTags.vue';
import { COLOR_SCHEME } from '@/helpers/color'

const meta: Meta<typeof MultiTags> = {
  title: 'components/ui/MultiTags',
  component: MultiTags,
};

const options = COLOR_SCHEME.slice(0, 6).map((color) => ({
  ...color,
  label: 'placeholder',
}))
 
export default meta;
type Story = StoryObj<typeof MultiTags>;

export const Default: Story = {
  name: 'default one',
  render: () => ({
    components: { MultiTags },
    data: () =>  ({
      options
    }),
    template: `
      <MultiTags :options="options" />
    `
  })
}

// <docs lang="md">
// ### MultiTags

// Add a tags for multiselect
// </docs>
