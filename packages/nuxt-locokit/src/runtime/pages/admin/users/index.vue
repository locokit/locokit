<template>
  <div class="flex h-full w-full">
    <nav
      class="w-72 px-2 py-4 space-y-2 overflow-y-hidden hover:overflow-y-auto bg-primary-lighten"
    >
      <div class="ml-2">
        <h2 class="mb-4">
          {{ $t('pages.adminUsers.title') }}
        </h2>
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
        <MessageForUser v-if="errorUsers" status="failed" />
        <div v-else>
          <PrimeInputText
            v-model="wantedUser"
            class="search-input w-full !mb-4"
            type="text"
            :placeholder="$t('pages.adminUsers.search')"
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
                  class="nav-link"
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
                    :subtitle="
                      user.lastname && user.firstname
                        ? `${user.lastname} ${user.firstname}`
                        : null
                    "
                    :icon="
                      user.blocked ? 'bi-person-fill-lock' : 'bi-person-fill'
                    "
                    :color-icon="
                      user.isVerified ? 'text-primary' : 'text-secondary'
                    "
                    :name-tag="
                      $t(
                        `pages.adminUsers.${
                          PROFILE.find(
                            (profile) => profile.value === user.profile,
                          ).name
                        }`,
                      )
                    "
                    border-color-tag="var(--primary-color)"
                    color-tag="var(--primary-color)"
                    bg-color-tag="var(--primary-color-lighten)"
                  />
                </NuxtLink>
              </div>
              <div class="bg-white rounded p-2">
                <p class="text-sm">
                  {{
                    t(
                      'pages.adminUsers.result',
                      {
                        elements:
                          users.limit > users.data.length
                            ? users.data.length
                            : users.limit,
                        total: users.total,
                      },
                      1,
                    )
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
                  class="nav-link"
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
                    :subtitle="
                      suggestionUser.lastname && suggestionUser.firstname
                        ? `${suggestionUser.lastname} ${suggestionUser.firstname}`
                        : null
                    "
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
                    :name-tag="
                      $t(
                        `pages.adminUsers.${
                          PROFILE.find(
                            (profile) =>
                              profile.value === suggestionUser.profile,
                          ).name
                        }`,
                      )
                    "
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
                template="PrevPageLink PageLinks NextPageLink RowsPerPageDropdown"
                :rows-per-page-options="[10, 20, 30]"
                @page="onPage($event)"
              />
            </div>
            <MessageForUser v-else-if="error" status="failed" />
            <div v-else>
              <p>{{ $t('pages.adminUsers.emptyResult') }}</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <main class="flex-1 overflow-y-auto">
      <NuxtPage @patch-user="patchUser" />
    </main>
  </div>
</template>

<script setup lang="ts">
import PrimeButton from 'primevue/button'
import PrimeInputText from 'primevue/inputtext'
import PrimePaginator, { PageState } from 'primevue/paginator'
import { storeToRefs } from 'pinia'
import {
  IdentityCard,
  FilterButton,
  MessageForUser,
} from '@locokit/designsystem'
import { useI18n } from 'vue-i18n'
import { COLUMN_TYPE } from '../../../helpers/filter'
import { ROUTES_NAMES } from '../../../paths'
import { useStoreUsers } from '../../../stores/users'
import { searchUsers } from '../../../services/user'
import { ApiUser, Filter, PROFILE } from '../../../interfaces/toMigrate'
import { ref } from '#imports'

const { t } = useI18n({ useScope: 'global' })

const usersStore = useStoreUsers()
const { users, error: errorUsers } = storeToRefs(usersStore)

const suggestionUsers = ref<ApiUser | null>(null)
const currentFilters = ref<Filter[] | null>(null)
const wantedUser = ref(null)
const error = ref(false)

const columnsDefinition = [
  {
    slug: 'username',
    name: `${t('pages.adminUsers.filters.username')}`,
    column_type_id: COLUMN_TYPE.STRING,
    original_type_id: COLUMN_TYPE.STRING,
  },
  {
    slug: 'firstName',
    name: `${t('pages.adminUsers.filters.firstName')}`,
    column_type_id: COLUMN_TYPE.STRING,
    original_type_id: COLUMN_TYPE.STRING,
  },
  {
    slug: 'lastName',
    name: `${t('pages.adminUsers.filters.lastName')}`,
    column_type_id: COLUMN_TYPE.STRING,
    original_type_id: COLUMN_TYPE.STRING,
  },
  {
    slug: 'email',
    name: `${t('pages.adminUsers.filters.email')}`,
    column_type_id: COLUMN_TYPE.STRING,
    original_type_id: COLUMN_TYPE.STRING,
  },
]

// Initialization
if (!users.value) {
  await usersStore.updateUsers()
}

const applySearch = () => {
  setTimeout(async () => {
    await search()
  }, 300)
}

const search = async (
  currentPageIndex = 0,
  limit: number | undefined = undefined,
) => {
  const res = await searchUsers({
    query: wantedUser.value,
    filters: currentFilters.value,
    pageIndex: currentPageIndex,
    limit,
  })
  if (res instanceof Error) {
    error.value = true
  } else {
    suggestionUsers.value = res
  }
}

const applyFilters = async (filters: Filter[]) => {
  currentFilters.value = filters
  await search()
}

const onPage = async (event: PageState) => {
  // event.page = New index page number
  await search(event.page, event.rows)
}

const patchUser = async (data: {
  id: string
  username: string
  lastName: string | null
  firstName: string | null
}) => {
  await usersStore.squashUsers({
    id: data.id,
    username: data.username,
    lastName: data.lastName,
    firstName: data.firstName,
  })
  if (suggestionUsers.value && suggestionUsers.value.total > 0) {
    const userFound = suggestionUsers.value.data.find(
      ({ id }: { id: string }) => id === data.id,
    )
    if (
      userFound &&
      (userFound.username !== data.username ||
        userFound.lastName !== data.lastName ||
        userFound.firstName !== data.firstName)
    ) {
      await search()
    }
  }
}
</script>

<style scoped>
.nav-link.router-link-active {
  @apply block outline outline-1 outline-primary rounded;
}
</style>
