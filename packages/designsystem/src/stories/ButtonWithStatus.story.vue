<template>
  <Story title="ButtonWithStatus" icon="bi:file-code-fill">
    <Variant title="default" auto-props-disabled>
      <div class="flex flex-col gap-8">
        <ButtonWithStatus label-tk="Submit" type="submit" />
        <ButtonWithStatus
          label-tk="Snowing"
          type="button"
          icon="bi-cloud-snow"
        />
        <ButtonWithStatus
          label-tk="Snowing"
          type="button"
          icon="bi-cloud-snow"
          class="!w-full"
        />
        <ButtonWithStatus type="button" icon="bi-cloud-snow" />
        <ButtonWithStatus label-tk="Submit" type="submit" disabled />
        <ButtonWithStatus label-tk="Submit" type="submit" icon="bi-check-lg" />
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
    <Variant title="submitButton">
      <div class="flex flex-col gap-8">
        <ButtonWithStatus
          label-tk="Submit"
          type="submit"
          icon="bi-save2"
          class-button="!bg-primary !border-primary !focus:ring-primary-dark !enabled:hover:bg-primary-dark !enabled:hover:border-primary-dark"
        />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ButtonWithStatus from '../components/ButtonWithStatus/ButtonWithStatus.vue'
</script>
