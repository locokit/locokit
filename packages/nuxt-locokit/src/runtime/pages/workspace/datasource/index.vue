<template>
  <div class="flex h-full w-full">
    <nav
      class="w-72 px-2 py-4 space-y-2 overflow-y-hidden hover:overflow-y-auto bg-primary-lighten"
    >
      <div class="ml-2">
        <h2 class="mb-4">{{ $t('pages.datasource.title') }}</h2>
        <div class="mb-4">
          <NuxtLink
            class="block h-full mb-4"
            :to="{ name: ROUTES_NAMES.WORKSPACE.DATASOURCE.CREATE }"
          >
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
          <div
            v-for="datasource in datasources.data"
            :key="datasource.slug"
            class="mb-2"
          >
            <NuxtLink
              class="flex py-2 px-4 transition duration-300"
              :to="{
                name: ROUTES_NAMES.WORKSPACE.DATASOURCE.UPDATE,
                params: {
                  workspaceSlug: route.params.workspaceSlug,
                  datasourceSlug: datasource.slug,
                },
              }"
            >
              <IdentityCard
                class="hover:outline hover:outline-1 hover:outline-primary"
                :title="datasource.name"
                icon="bi-database-fill-add"
                color-icon="
                  text-primary
                "
                border-color-tag="var(--primary-color)"
                color-tag="var(--primary-color)"
                bg-color-tag="var(--primary-color-lighten)"
              />
            </NuxtLink>
          </div>
          <div v-if="datasources && datasources.total > 0"></div>
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
import { IdentityCard } from '@locokit/designsystem'
import { ROUTES_NAMES } from '../../../locokit-paths'
import { findDatasources } from '../../../services/datasource'
import { useRoute } from '#imports'

const route = useRoute()

// Initialization
const datasources = await findDatasources(
  {},
  route.params.workspaceSlug as string,
)
</script>
