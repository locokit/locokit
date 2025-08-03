<template>
  <div class="flex items-stretch min-h-full">
    <div class="w-80 border-e border-slate-300">
      <div class="p-4">
        <Button
          as="router-link"
          :label="t('locokit.pages.adminGroups.addGroup')"
          :to="{ name: ROUTE_NAMES.ADMIN.GROUPS.CREATE }"
          fluid
        />
        <PrimeIconField class="mt-4">
          <PrimeInputIcon class="bi bi-search" />
          <PrimeInputText v-model="search" :placeholder="t('locokit.pages.adminGroups.search')" />
        </PrimeIconField>
      </div>
      <error-handler :error="error">
        <ul v-if="groups.data">
          <li v-for="group in groups.data" :key="group.id">
            <RouterLink
              :to="{
                name: ROUTE_NAMES.ADMIN.GROUPS.RECORD,
                params: { id: group.id }
              }"
              class="flex px-4 py-2 group hover:bg-slate-300 focus:bg-slate-200"
              active-class="router-link-active ps-3 border-l-4 border-secondary bg-slate-200"
            >
              <div>
                <i class="bi bi-people-fill"></i>
              </div>
              <div class="flex flex-col w-full mx-2">
                <span class="group-[.router-link-active]:font-bold">
                  {{ group.name }}
                </span>
                <span class="text-xs">
                  {{ group.policy.name }}
                </span>
              </div>
              <div>
                <Tag value="0" class="text-xs px-2 py-1"/>
              </div>
            </RouterLink>
          </li>
        </ul>
        <p v-else-if="search">
          {{ t('locokit.pages.adminGroups.emptyResult') }}
        </p>
        <p v-else>
          {{ t('locokit.pages.adminGroups.emptyList') }}
        </p>
      </error-handler>
      <PrimePaginator
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        :rows="groups.limit ?? 0"
        :total-records="groups.total ?? 0"
        :page-link-size="3"
        :always-show="false"
        :dt="{
          gap: 0,
          background: 'transparent',
          nav: {
            button: {
              color: '{surface.700}',
            },
          },
        }"
        @page="(event) => page = event.page"
        class="mt-2"
      />
    </div>
    <div class="w-full px-6 py-8">
      <RouterView/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onWatcherCleanup, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Paginated } from '@feathersjs/feathers'
import Button from 'primevue/button'
import PrimeIconField from 'primevue/iconfield'
import PrimeInputIcon from 'primevue/inputicon'
import PrimeInputText from 'primevue/inputtext'
import PrimePaginator from 'primevue/paginator'
import Tag from 'primevue/tag'
import { SERVICES } from '@locokit/shared'
import type { GroupResult } from '@locokit/sdk'
import ErrorHandler from '@/components/error-handler.vue'
import { sdkClient } from '@/services/sdk'
import ROUTE_NAMES from '@/router/routes'

const { t } = useI18n()
const groupService = sdkClient.service(SERVICES.CORE_GROUP)
const groups = ref<Paginated<GroupResult>>({
  limit: 0, skip: 0, total: 0, data: []
})
const search = ref<string | null>(null)
const page = ref<number>(0)
const error = ref<Error | null>(null)
const GROUPS_PER_PAGE = 25

watch([search, page], async ([search, page]: [string | null, number]) => {
  const controller = new AbortController()
  onWatcherCleanup(() => {
    controller.abort()
  })

  const query: Record<string, unknown> = {}
  if (search) {
    query.name = { $ilike: `%${search}%` }
  }

  try {
    groups.value = await groupService.find({
      query: {
        ...query,
        $joinEager: 'policy',
        $limit: GROUPS_PER_PAGE,
        $skip: page * GROUPS_PER_PAGE,
        $sort: { name: 1 },
      },
      connection: {
        signal: controller.signal,
      },
    }) as Paginated<GroupResult>

    error.value = null
  } catch (e) {
    error.value = e as Error
  }
}, {
  immediate: true,
})
</script>
