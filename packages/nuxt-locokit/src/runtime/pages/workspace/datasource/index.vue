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
          <div class="my-2">
            <PrimeAccordion class="accordion-navbar" :active-index="0">
              <PrimeAccordionTab
                v-for="datasource in datasources.data"
                :key="datasource.slug"
              >
                <template #header>
                  <i class="bi-database"></i>
                  <span>{{ datasource.name }}</span>
                </template>
                <NuxtLink
                  class="nav-link"
                  :to="{
                    name: ROUTES_NAMES.WORKSPACE.DATASOURCE.UPDATE,
                    params: {
                      workspaceSlug: route.params.workspaceSlug,
                      datasourceSlug: datasource.slug,
                    },
                  }"
                >
                  <IdentityCard
                    class="nav-link hover:outline hover:outline-1 hover:outline-primary bg-primary-lighten"
                    :title="$t('pages.datasource.settings')"
                    icon="bi-database-fill-gear"
                    color-icon="text-primary"
                    border-color-tag="var(--primary-color)"
                    color-tag="var(--primary-color)"
                    bg-color-tag="var(--primary-color-lighten)"
                  />
                </NuxtLink>
                <NuxtLink
                  class="nav-link"
                  :to="{
                    name: ROUTES_NAMES.WORKSPACE.DATASOURCE.SCHEMA,
                    params: {
                      workspaceSlug: route.params.workspaceSlug,
                      datasourceSlug: datasource.slug,
                    },
                  }"
                >
                  <IdentityCard
                    class="nav-link mt-2 hover:outline hover:outline-1 hover:outline-primary bg-primary-lighten"
                    :title="$t('pages.datasource.schema')"
                    icon="b bi-diagram-3-fill"
                    color-icon="text-primary"
                    border-color-tag="var(--primary-color)"
                    color-tag="var(--primary-color)"
                    bg-color-tag="var(--primary-color-lighten)"
                  />
                </NuxtLink>
                <div>
                  <h6 class="my-4">
                    {{ $t('pages.datasource.subtitle') }}
                  </h6>
                  <NuxtLink
                    class="block h-full mb-4"
                    :to="{
                      name: ROUTES_NAMES.WORKSPACE.DATASOURCE.TABLE.CREATE,
                      params: {
                        workspaceSlug: route.params.workspaceSlug,
                        datasourceSlug: datasource.slug,
                      },
                    }"
                  >
                    <PrimeButton
                      class="p-button-rounded p-button-secondary w-full"
                    >
                      <div
                        class="relative flex flex-row justify-center text-center font-bold w-full"
                      >
                        <i class="bi bi-plus block font-medium" />
                        <p class="pl-1">
                          {{ $t('pages.datasource.addTable') }}
                        </p>
                      </div>
                    </PrimeButton>
                  </NuxtLink>
                  <div
                    v-for="table in datasource.tables"
                    :key="table.slug"
                    class="mt-2"
                  >
                    <NuxtLink
                      class="nav-link-table"
                      :to="{
                        name: ROUTES_NAMES.WORKSPACE.DATASOURCE.TABLE.RECORD,
                        params: {
                          workspaceSlug: route.params.workspaceSlug,
                          datasourceSlug: datasource.slug,
                          tableSlug: table.slug,
                        },
                      }"
                    >
                      <IdentityCard
                        class="nav-link hover:outline hover:outline-1 hover:outline-primary bg-primary-lighten"
                        :title="table.name"
                        icon="bi-table"
                        color-icon="text-primary"
                        border-color-tag="var(--primary-color)"
                        color-tag="var(--primary-color)"
                        bg-color-tag="var(--primary-color-lighten)"
                      />
                    </NuxtLink>
                  </div>
                </div>
              </PrimeAccordionTab>
            </PrimeAccordion>
          </div>
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
import PrimeAccordion from 'primevue/accordion'
import PrimeAccordionTab from 'primevue/accordiontab'
import { IdentityCard } from '@locokit/designsystem'
import { ROUTES_NAMES } from '../../../locokit-paths'
import { findDatasources } from '../../../services/datasource'
import { definePageMeta, useRoute } from '#imports'

const route = useRoute()

// Initialization
// Get paginated datasources with their tables
const datasources = await findDatasources(
  { params: { $eager: 'tables' } },
  route.params.workspaceSlug as string,
)

definePageMeta({
  redirect: {
    name: ROUTES_NAMES.WORKSPACE.DATASOURCE.ABOUT,
  },
})
</script>

<style lang="scss" scoped>
.nav-link.router-link-active {
  @apply block outline outline-1 outline-primary rounded;
}

.accordion-navbar {
  i span {
    vertical-align: middle;
  }

  span {
    margin: 0 0.2rem;
  }

  p {
    line-height: 1.5;
    margin: 0;
  }
}
</style>
