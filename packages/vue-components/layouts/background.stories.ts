import type { Meta, StoryObj } from '@storybook/vue3';

import LayoutBackground from './background.vue';
import PrimeCard from 'primevue/card'

const meta: Meta<typeof LayoutBackground> = {
  title: 'layouts/background',
  component: LayoutBackground,
}

export default meta;
type Story = StoryObj<typeof LayoutBackground>;

export const Default: Story = {
  name: 'default one',
  render:() => ({
    components: { LayoutBackground },
    template: `
      <layout-background class="border border-black">
        <p>This is a layout background</p>
      </layout-background>
    `
  })
}

export const WithPrimeCardSlot: Story = {
  name: 'with prime card slot',
  render: () => ({
    components: { LayoutBackground, PrimeCard },
    template: `
      <layout-background>
        <prime-card class="bg-white p-4">
          <template #header> This is a header </template>
          <template #title> This is a title </template>
          This is the main part
          <template #footer> This is a footer </template>
        </prime-card>
      </layout-background>
    `
  })
}

export const WithImageAndLogo: Story = {
  name: 'with image and logo',
  render: () => ({
    components: { LayoutBackground, PrimeCard },
    template: `
      <div class="flex flex-col gap-8">
        <layout-background
          background-image-url="/davidrevoy_totoromastodon.jpg"
          logo-image-url="/logo.svg"
          text-bottom-right="This is a version emplacement"
          style="height: 600px"
        />
      </div>
    `
  })
}

export const WithImageLogoAndSlot: Story = {
  name: 'with image, logo and slot',
  render: () => ({
    components: { LayoutBackground, PrimeCard },
    template: `
      <layout-background
        background-image-url="/davidrevoy_totoromastodon.jpg"
        logo-image-url="/logo.svg"
        logo-image-href="/home"
        text-bottom-right="This is a version emplacement"
        style="height: 600px"
      >
        <prime-card class="bg-white p-4 h-full">
          <template #header> This is a header </template>
          <template #title> This is a title </template>
          This is the main part
          <template #footer> This is a footer </template>
        </prime-card>
      </layout-background>
    `
  })
}

export const WithImageLogoAndSlotSmallDevice: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'Small mobile',
    },
  },
  name: 'with image, logo and slot on a small device',
  render: () => ({
    components: { LayoutBackground, PrimeCard },
    template: `
      <layout-background
        background-image-url="/davidrevoy_totoromastodon.jpg"
        logo-image-url="/logo.svg"
        logo-image-href="/home"
        text-bottom-right="This is a version emplacement"
      >
        <prime-card class="bg-white p-4">
          <template #header> This is a header </template>
          <template #title> This is a title </template>
          This is the main part
          <template #footer> This is a footer </template>
        </prime-card>
      </layout-background>
    `
  })
}
