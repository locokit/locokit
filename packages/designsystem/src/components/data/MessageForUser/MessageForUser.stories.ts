import type { Meta, StoryObj } from '@storybook/vue3';
 
import MessageForUser from './MessageForUser.vue';
 
const meta: Meta<typeof MessageForUser> = {
  title: 'components/data/MessageForUser',
  component: MessageForUser,
};
 
export default meta;
type Story = StoryObj<typeof MessageForUser>;

export const Default: Story = {
  name: 'default one',
  render: () => ({
    components: { MessageForUser },
    template: `
      <MessageForUser status="success" custom-msg-tk-success-form="Good game" />
      <MessageForUser status="success" />
      <MessageForUser status="failed" custom-msg-tk-success-form="Try again" />
      <MessageForUser status="failed" />
    `
  })
}


// <docs lang="md">
// ### MessageForUser

// Allows you to display a message to the user to warn them of a failed or successful action.
// </docs>
