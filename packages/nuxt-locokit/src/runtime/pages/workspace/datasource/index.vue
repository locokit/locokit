<template>
  <div class="flex h-full w-full">
    <nav
      class="w-72 px-2 py-4 space-y-2 overflow-y-hidden hover:overflow-y-auto bg-primary-lighten"
    >
      <div class="ml-2">
        <h2 class="mb-4">{{ $t('pages.datasource.title') }}</h2>
        <div class="mb-4">
          <NuxtLink :to="{ name: ROUTES_NAMES.WORKSPACE.DATASOURCE.CREATE }">
            <PrimeButton class="p-button-rounded p-button-secondary w-full">
              <div
                class="relative flex flex-row justify-center text-center font-bold w-full"
              >
                <i class="bi bi-plus block font-medium" />
                <p class="pl-1">
                  {{ $t('pages.datasource.addDatasource') }}
                </p>
              </div>
            </PrimeButton>
          </NuxtLink>
        </div>
      </div>
    </nav>
    <main class="flex-1 overflow-y-auto">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import PrimeButton from 'primevue/button'
import { ROUTES_NAMES } from '../../../locokit-paths'
</script>
