<template>
  <Story title="ui/ButtonWithStatus" icon="bi:file-code-fill">
    <Variant title="default" auto-props-disabled>
      <div class="flex flex-col gap-8">
        <ButtonWithStatus label-tk="Submit" type="submit" />
        <ButtonWithStatus
          label-tk="Snowing"
          type="button"
          icon="bi-cloud-snow"
        />
        <ButtonWithStatus
          label-tk="Snowing full width"
          type="button"
          icon="bi-cloud-snow"
          class="!w-full"
        />
        <ButtonWithStatus type="button" icon="bi-cloud-snow" />
        <ButtonWithStatus label-tk="Disabled" type="submit" disabled />
        <ButtonWithStatus
          label-tk="Submit with icon"
          type="submit"
          icon="bi-check-lg"
        />
        <ButtonWithStatus
          label-tk="Loading"
          type="submit"
          icon="bi-save2"
          :is-submitting="true"
        />
        <ButtonWithStatus
          label-tk="Submit"
          type="submit"
          icon="bi-save2"
          status-form="success"
        />
        <ButtonWithStatus
          label-tk="Submit"
          type="submit"
          icon="bi-save2"
          status-form="failed"
        />
      </div>
    </Variant>
    <Variant title="styling">
      <div class="flex flex-col gap-8">
        <ButtonWithStatus
          label-tk="Danger !"
          type="submit"
          icon="bi-exclamation-circle"
          class-button="!bg-red-500 !border-red-500 !focus:ring-red-500-dark !enabled:hover:bg-red-500-dark !enabled:hover:border-red-500-dark"
        />
        <ButtonWithStatus
          label-tk="Submit primary"
          type="submit"
          icon="bi-save2"
          primary
        />
        <ButtonWithStatus
          label-tk="Submit secondary"
          type="submit"
          icon="bi-save2"
          secondary
        />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ButtonWithStatus from '../components/ButtonWithStatus/ButtonWithStatus.vue'
</script>

<docs lang="md">
### ButtonWithStatus

It is recommended to use it as a button submit within the form.

The state of the button changes depending on the response sent by the API when the form is validated.

There are 4 states:

- failed
- success
- default
- loading

Two default theme are provided : `primary` and `secondary`.

You can override the class by providing the `class-button` property,
as the "danger" button is styled in the `styling` variant.
</docs>
