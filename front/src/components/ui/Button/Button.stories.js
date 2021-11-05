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

      <div style="margin-top: 1em;">
        <Button class="p-button p-button-success">Success</Button>
        <Button class="p-button p-button-success p-button-outlined">Success outline</Button>
        <Button class="p-button p-button-success p-button-text">Success text</Button>
      </div>

      <div style="margin-top: 1em;">
        <Button class="p-button p-button-success" disabled>Success disabled</Button>
        <Button class="p-button p-button-success p-button-outlined" disabled>Success outline disabled</Button>
        <Button class="p-button p-button-success p-button-text" disabled>Success text disabled</Button>
      </div>

      <div style="margin-top: 1em;">
        <Button class="p-button p-button-warning">Warning</Button>
        <Button class="p-button p-button-warning p-button-outlined">Warning outline</Button>
        <Button class="p-button p-button-warning p-button-text">Warning text</Button>
      </div>

      <div style="margin-top: 1em;">
        <Button class="p-button p-button-warning" disabled>Warning disabled</Button>
        <Button class="p-button p-button-warning p-button-outlined" disabled>Warning outline disabled</Button>
        <Button class="p-button p-button-warning p-button-text" disabled>Warning text disabled</Button>
      </div>

      <div style="margin-top: 1em;">
        <Button class="p-button p-button-danger">Danger</Button>
        <Button class="p-button p-button-danger p-button-outlined">Danger outline</Button>
        <Button class="p-button p-button-danger p-button-text">Danger text</Button>
      </div>

      <div style="margin-top: 1em;">
        <Button class="p-button p-button-danger" disabled>Danger disabled</Button>
        <Button class="p-button p-button-danger p-button-outlined" disabled>Danger outline disabled</Button>
        <Button class="p-button p-button-danger p-button-text" disabled>Danger text disabled</Button>
      </div>
    </div>
    `,
  methods: { },
})
Buttons.storyName = 'Button states'
