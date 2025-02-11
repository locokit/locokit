<template>
  <div class="flex items-stretch min-h-full">
    <div class="w-80 border-e border-slate-300">
      <div class="p-4">
        <Button
          as="router-link"
          label="Add a user"
          :to="{ name: ROUTE_NAMES.ADMIN.USERS.CREATE }"
          fluid
        />
      </div>
      <!-- <FilterBuilder fields-definition=""/> -->
      <ul>
        <li v-for="user in usersStore.users?.data">
          <RouterLink
            :to="{
              name: ROUTE_NAMES.ADMIN.USERS.RECORD,
              params: { id: user.id }
            }"
            class="flex px-4 py-2 group hover:bg-slate-300 focus:bg-slate-200"
            active-class="router-link-active ps-3 border-l-4 border-secondary bg-slate-200"
          >
            <div>
              <i class="bi bi-person-fill"></i>
            </div>
            <div class="flex flex-col w-full mx-2">
              <span class="group-[.router-link-active]:font-bold">
                {{ user.username }}
              </span>
              <!-- <span class="text-xs">
                {{ user.profile }}
              </span> -->
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
import { useStoreUsers } from '@/stores/users'
import ROUTE_NAMES from '@/router/routes'

const { t } = useI18n()
const usersStore = useStoreUsers()

// const fieldsDefinition = [
//   {
//     slug: 'long-name',
//     name: 'Field with super mega long name',
//     type: FIELD_TYPE.STRING,
//   },
// ]

onMounted(() => {
  usersStore.fetchUsers({
    //$joinEager: 'policy',
  })
})
</script>
