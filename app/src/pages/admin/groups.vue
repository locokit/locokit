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
      </div>
      <!-- <FilterBuilder fields-definition=""/> -->
      <ul>
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
    </div>
    <div class="w-full px-6 py-8">
      <RouterView/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { FilterBuilder } from '@locokit/vue-components'
import { FIELD_TYPE } from '@locokit/definitions'
import { useStoreGroups } from '@/stores/groups'
import ROUTE_NAMES from '@/router/routes'

const { t } = useI18n()
const groupsStore = useStoreGroups()

// const fieldsDefinition = [
//   {
//     slug: 'long-name',
//     name: 'Field with super mega long name',
//     type: FIELD_TYPE.STRING,
//   },
// ]

onMounted(() => {
  groupsStore.fetchGroups({
    $joinEager: 'policy',
  })
})
</script>
