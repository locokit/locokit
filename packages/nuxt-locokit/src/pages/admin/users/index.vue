<template>
  <div class="flex h-full w-full">
    <nav
      class="w-72 px-2 py-4 space-y-2 overflow-y-hidden hover:overflow-y-auto bg-primary-lighten"
    >
      <div class="ml-2">
        <h2 class="mb-4">{{ $t('pages.adminUsers.title') }}</h2>
        <div class="mb-4">
          <NuxtLink :to="{ name: ROUTES_NAMES.ADMIN.USERS.CREATE }">
            <PrimeButton class="p-button-rounded p-button-secondary w-full">
              <div
                class="relative flex flex-row justify-center text-center font-bold w-full"
              >
                <i class="bi bi-plus block font-medium" />
                <p class="pl-1">
                  {{ $t('pages.adminUsers.addUser') }}
                </p>
              </div>
            </PrimeButton>
          </NuxtLink>
        </div>

        <div>
          <PrimeInput
            v-model="wantedUser"
            class="search-input w-full !mb-4"
            type="text"
            @input="applySearch"
          />

          <div id="filter-container" class="mb-4">
            <FilterButton
              append-to="#filter-container"
              :columns-definition="columnsDefinition"
              @submit-filters="applyFilters"
            />
          </div>
          <div class="m-1">
            <div
              v-if="
                suggestionUsers === null &&
                users &&
                users.data &&
                users.data.length > 0
              "
            >
              <div v-for="user in users.data" :key="user.id" class="mb-2">
                <NuxtLink
                  :to="{
                    name: ROUTES_NAMES.ADMIN.USERS.RECORD,
                    params: {
                      id: user.id,
                    },
                  }"
                >
                  <IdentityCard
                    class="hover:outline hover:outline-1 hover:outline-primary"
                    :title="user.username"
                    :subtitle="user.name"
                    :icon="
                      user.blocked ? 'bi-person-fill-lock' : 'bi-person-fill'
                    "
                    :color-icon="
                      user.isVerified ? 'text-primary' : 'text-secondary'
                    "
                    :name-tag="user.profile"
                    border-color-tag="var(--primary-color)"
                    color-tag="var(--primary-color)"
                    bg-color-tag="var(--primary-color-lighten)"
                  />
                </NuxtLink>
              </div>
              <div class="bg-white p-2">
                <p class="text-sm">
                  {{
                    $t('pages.adminUsers.result', {
                      elements:
                        users.limit > users.data.length
                          ? users.data.length
                          : users.limit,
                      total: users.total,
                    })
                  }}
                </p>
              </div>
            </div>
            <div v-else-if="suggestionUsers && suggestionUsers.total > 0">
              <div
                v-for="suggestionUser in suggestionUsers.data"
                :key="suggestionUser.id"
                class="mb-2"
              >
                <NuxtLink
                  :to="{
                    name: ROUTES_NAMES.ADMIN.USERS.RECORD,
                    params: {
                      id: suggestionUser.id,
                    },
                  }"
                >
                  <IdentityCard
                    class="hover:outline hover:outline-1 hover:outline-primary"
                    :title="suggestionUser.username"
                    :subtitle="suggestionUser.name"
                    :icon="
                      suggestionUser.blocked
                        ? 'bi-person-fill-lock'
                        : 'bi-person-fill'
                    "
                    :color-icon="
                      suggestionUser.isVerified
                        ? 'text-primary'
                        : 'text-secondary'
                    "
                    :name-tag="suggestionUser.profile"
                    border-color-tag="var(--primary-color)"
                    color-tag="var(--primary-color)"
                    bg-color-tag="var(--primary-color-lighten)"
                  />
                </NuxtLink>
              </div>
              <PrimePaginator
                :rows="suggestionUsers.limit"
                :total-records="suggestionUsers.total"
                :page-link-size="3"
                template="PageLinks RowsPerPageDropdown"
                :rows-per-page-options="[10, 20, 30]"
                @page="onPage($event)"
              />
            </div>
            <div v-else>
              <p>{{ $t('pages.adminUsers.emptyResult') }}</p>
            </div>
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
import PrimeInput from 'primevue/inputtext'
import PrimePaginator, { PageState } from 'primevue/paginator'
import { storeToRefs } from 'pinia'
import { IdentityCard, FilterButton } from '@locokit/designsystem'
import { COLUMN_TYPE, Filter } from '../../../helpers/filter'
import { ROUTES_NAMES } from '../../../paths'
import { useStoreUsers } from '../../../stores/users'
import { ref } from '#imports'

const usersStore = useStoreUsers()
const { users } = storeToRefs(usersStore)

const suggestionUsers = ref(null)
const currentFilters = ref<Filter[] | null>(null)
const wantedUser = ref(null)

const columnsDefinition = [
  {
    slug: 'name',
    name: 'Name',
    column_type_id: COLUMN_TYPE.STRING,
    original_type_id: COLUMN_TYPE.STRING,
  },
]
const applySearch = () => {
  setTimeout(() => {
    searchUsers()
  }, 300)
}

const searchUsers = async (
  currentPageIndex = 0,
  limit: number | undefined = undefined,
) => {
  suggestionUsers.value = await usersStore.searchUsers({
    query: wantedUser.value,
    filters: currentFilters.value,
    pageIndex: currentPageIndex,
    limit,
  })
}

const applyFilters = (filters: Filter[]) => {
  currentFilters.value = filters
  searchUsers()
}

const onPage = (event: PageState) => {
  console.log('Bouh')
  // event.page = New index page number
  searchUsers(event.page, event.rows)
}
</script>

<style scoped>
.search-input {
  @apply py-2 px-[2.5rem];
  background: white url('../../../assets/search.svg') no-repeat 10px center;
}
</style>
