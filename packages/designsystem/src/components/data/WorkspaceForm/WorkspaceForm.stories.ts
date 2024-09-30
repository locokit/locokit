import type { Meta, StoryObj } from '@storybook/vue3';
import WorkspaceForm from './WorkspaceForm.vue';
 
const meta: Meta<typeof WorkspaceForm> = {
  title: 'components/data/WorkspaceForm',
  component: WorkspaceForm,
};
 
export default meta;
type Story = StoryObj<typeof WorkspaceForm>;

export const Default: Story = {
  name: 'default one',
}

// <docs lang="md">
// ### WorkspaceForm

// Allow to create a new workspace
// </docs>
