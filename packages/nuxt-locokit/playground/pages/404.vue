<template>
  <WithBackground>
    <div
      class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 text-center"
    >
      <h1
        class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        {{ $t('pages.404.title') }}
      </h1>
      <router-link to="/" class="p-button p-component">
        <span
          class="pi pi-sign-in p-button-icon p-button-icon-left"
          aria-hidden="true"
        ></span>
        <span class="p-button-label">{{ $t('pages.404.link') }}</span>
      </router-link>
    </div>
  </WithBackground>
</template>

<script setup lang="ts">
import WithBackground from '../../src/layouts/WithBackground/WithBackground.vue'
</script>
