<template>
  <Story title="layout background" icon="bi:file-code-fill">
    <Variant title="default" auto-props-disabled>
      <layout-background>
        <p class="text-white">This is a layout background</p>
      </layout-background>
    </Variant>
    <Variant title="with prime card slot">
      <layout-background>
        <p-card class="bg-white p-4">
          <template #header> This is a header </template>
          <template #title> This is a title </template>
          This is the main part
          <template #footer> This is a footer </template>
        </p-card>
      </layout-background>
    </Variant>
    <Variant title="with image and logo">
      <div class="flex flex-col gap-8">
        <layout-background
          background-image-url="/davidrevoy_totoromastodon.jpg"
          logo-image-url="/logo.svg"
          text-bottom-right="This is a version emplacement"
          style="height: 600px"
        />
      </div>
    </Variant>
    <Variant title="with image, logo and slot">
      <div class="flex flex-col gap-8">
        <layout-background
          background-image-url="/davidrevoy_totoromastodon.jpg"
          logo-image-url="/logo.svg"
          logo-image-href="/home"
          text-bottom-right="This is a version emplacement"
          style="height: 600px"
        >
          <p-card class="bg-white p-4">
            <template #header> This is a header </template>
            <template #title> This is a title </template>
            This is the main part
            <template #footer> This is a footer </template>
          </p-card>
        </layout-background>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import LayoutBackground from './background.vue'
import PCard from 'primevue/card'
</script>

<docs lang="md">
### Layout background

This layout accept an image to be displayed in the background.

You can provide a slot to be displayed
in the center of the layout.
</docs>
