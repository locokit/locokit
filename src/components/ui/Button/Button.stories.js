import Button from 'primevue/button'

export default {
  component: Button,
  title: 'components/ui/Buttons',
  decorators: [() => ({ template: '<div style="margin: 1em;"><story /></div>' })],
}

export const Buttons = () => ({
  components: { Button },
  template: `
    <div>
      <div>
        <Button class="p-button">Default</Button>
        <Button class="p-button p-button-outlined">Default outline</Button>
        <Button class="p-button p-button-text">Default text</Button>
      </div>

      <div style="margin-top: 1em;">
        <Button class="p-button" disabled>Default disabled</Button>
        <Button class="p-button p-button-outlined" disabled>Default outline disabled</Button>
        <Button class="p-button p-button-text" disabled>Default text disabled</Button>
      </div>
      
      <div style="margin-top: 1em;">
        <Button class="p-button p-button-secondary">Secondary</Button>
        <Button class="p-button p-button-outlined p-button-secondary">Secondary outline</Button>
        <Button class="p-button p-button-text p-button-secondary">Secondary outline</Button>
      </div>

      <div style="margin-top: 1em;">
        <Button class="p-button p-button-secondary" disabled>Secondary disabled</Button>
        <Button class="p-button p-button-outlined p-button-secondary" disabled>Secondary outline disabled</Button>
        <Button class="p-button p-button-text p-button-secondary" disabled>Secondary outline disabled</Button>
      </div>
    </div>
    `,
  methods: { },
})
Buttons.storyName = 'Button states'
