<template>
  <WithBanner>
    <div class="max-w-3xl mx-auto mt-8">
      <h1 class="mb-4">{{ $t('pages.createWorkspace.alternativeTitle') }}</h1>
      <WorkspaceForm />
    </div>
  </WithBanner>
</template>

<script setup lang="ts">
import { WorkspaceForm } from '@locokit/designsystem'
import { useI18n } from 'vue-i18n'
import WithBanner from '../../layouts/WithBanner.vue'
import { useHead } from '#imports'

const { t } = useI18n({ useScope: 'global' })

useHead({
  titleTemplate: `${t('pages.createWorkspace.title')} | %s`,
})
</script>

<style>
:root *[data-theme='test'] {
  --theme-text-color: #484848;
  --theme-bg-color: #dffbff;
  --theme-dark-bg-color: #a2f3ff;
  --theme-light-bg-color: #eefdff;
  --theme-bg-color-hover: var(--theme-dark-bg-color);
}

:root *[data-theme='malibu'] {
  --theme-text-color: #ffffff;
  --theme-bg-color: #55b3fe;
  --theme-dark-bg-color: #1d9afe;
  --theme-light-bg-color: #7ec5fe;
  --theme-bg-color-hover: var(--theme-dark-bg-color);
}
</style>
