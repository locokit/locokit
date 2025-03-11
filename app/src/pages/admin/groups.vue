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
      <ul v-if="groupsStore.groups?.data">
        <li v-for="group in groupsStore.groups?.data" :key="group.id">
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
    </div>
    <div class="w-full px-6 py-8">
      <RouterView/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import PrimeIconField from 'primevue/iconfield'
import PrimeInputIcon from 'primevue/inputicon'
import PrimeInputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import { useStoreGroups } from '@/stores/groups'
import type { GroupResult } from '@locokit/sdk'
import ROUTE_NAMES from '@/router/routes'

const { t } = useI18n()
const groupsStore = useStoreGroups()
const search = ref<string | null>(null)

onMounted(() => {
  groupsStore.fetchGroups({
    $joinEager: 'policy',
  })
})

watch(search, (search) => {
  groupsStore.fetchGroups({
    $joinEager: 'policy',
    name: { $ilike: `%${search}%` },
  })
})
</script>
