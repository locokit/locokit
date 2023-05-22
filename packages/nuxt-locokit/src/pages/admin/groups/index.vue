<template>
  <div class="flex h-full w-full">
    <nav
      class="w-72 px-2 py-4 space-y-2 overflow-y-hidden hover:overflow-y-auto bg-primary-lighten"
    >
      <div class="ml-2">
        <h2 class="mb-4">{{ $t('pages.adminGroups.title') }}</h2>
        <div class="mb-4">
          <NuxtLink :to="{ name: ROUTES_NAMES.ADMIN.GROUPS.CREATE }">
            <PrimeButton class="p-button-rounded p-button-secondary w-full">
              <div
                class="relative flex flex-row justify-center text-center font-bold w-full"
              >
                <i class="bi bi-plus block font-medium" />
                <p class="pl-1">
                  {{ $t('pages.adminGroups.addGroup') }}
                </p>
              </div>
            </PrimeButton>
          </NuxtLink>
        </div>
        <MessageForUser v-if="errorGroups" status="failed" />
        <div v-else>
          <PrimeInputText
            v-model="wantedGroup"
            class="search-input w-full !mb-4"
            type="text"
            :placeholder="$t('pages.adminGroups.search')"
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
                suggestionGroups === null &&
                groups &&
                groups.data &&
                groups.data.length > 0
              "
            >
              <div v-for="group in groups.data" :key="group.id" class="mb-2">
                <NuxtLink
                  class="nav-link"
                  :to="{
                    name: ROUTES_NAMES.ADMIN.GROUPS.RECORD,
                    params: {
                      id: group.id,
                    },
                  }"
                >
                  <IdentityCard
                    class="hover:outline hover:outline-1 hover:outline-primary"
                    :title="group.name"
                    :subtitle="group?.workspace?.name"
                    icon="
                      bi-people-fill
                    "
                    color-icon="text-primary"
                    name-tag="17"
                    border-color-tag="var(--primary-color)"
                    color-tag="var(--primary-color)"
                    bg-color-tag="var(--primary-color-lighten)"
                  />
                </NuxtLink>
              </div>
              <div class="bg-white p-2">
                <p class="text-sm">
                  {{
                    t(
                      'pages.adminGroups.result',
                      {
                        elements:
                          groups.limit > groups.data.length
                            ? groups.data.length
                            : groups.limit,
                        total: groups.total,
                      },
                      groups.data.length,
                    )
                  }}
                </p>
              </div>
            </div>
            <div v-else-if="suggestionGroups && suggestionGroups.total > 0">
              <div
                v-for="suggestionGroup in suggestionGroups.data"
                :key="suggestionGroup.id"
                class="mb-2"
              >
                <NuxtLink
                  class="nav-link"
                  :to="{
                    name: ROUTES_NAMES.ADMIN.GROUPS.RECORD,
                    params: {
                      id: suggestionGroup.id,
                    },
                  }"
                >
                  <IdentityCard
                    class="hover:outline hover:outline-1 hover:outline-primary"
                    :title="suggestionGroup.name"
                    :subtitle="suggestionGroup?.workspace?.name"
                    icon="
                      bi-people-fill
                    "
                    color-icon="text-primary"
                    name-tag="17"
                    border-color-tag="var(--primary-color)"
                    color-tag="var(--primary-color)"
                    bg-color-tag="var(--primary-color-lighten)"
                  />
                </NuxtLink>
              </div>
              <PrimePaginator
                :rows="suggestionGroups.limit"
                :total-records="suggestionGroups.total"
                :page-link-size="3"
                template="PrevPageLink PageLinks NextPageLink RowsPerPageDropdown"
                :rows-per-page-options="[10, 20, 30]"
                @page="onPage($event)"
              />
            </div>
            <MessageForUser v-else-if="error" status="failed" />
            <div v-else>
              <p>{{ $t('pages.adminGroups.emptyResult') }}</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <main class="flex-1 overflow-y-auto">
      <NuxtPage @patch-group="patchGroup" />
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
import { useStoreGroups } from '../../../stores/groups'
import { searchGroups } from '../../../services/group'
import { ApiGroup, Filter } from '../../../interfaces/toMigrate'
import { ref } from '#imports'

const { t } = useI18n({ useScope: 'global' })

const groupsStore = useStoreGroups()
const { groups, error: errorGroups } = storeToRefs(groupsStore)

const suggestionGroups = ref<ApiGroup | null>(null)
const currentFilters = ref<Filter[] | null>(null)
const wantedGroup = ref(null)
const error = ref(false)

const columnsDefinition = [
  {
    slug: 'name',
    name: `${t('pages.adminGroups.filters.name')}`,
    column_type_id: COLUMN_TYPE.STRING,
    original_type_id: COLUMN_TYPE.STRING,
  },
  {
    slug: 'workspace.name',
    name: `${t('pages.adminGroups.filters.workspace')}`,
    column_type_id: COLUMN_TYPE.STRING,
    original_type_id: COLUMN_TYPE.STRING,
  },
]

// Initialization
if (!groups.value) {
  await groupsStore.updateGroups({ $eager: 'workspace' })
}

const applySearch = () => {
  setTimeout(() => {
    search()
  }, 300)
}

const search = async (
  currentPageIndex = 0,
  limit: number | undefined = undefined,
) => {
  error.value = false
  const res = await searchGroups({
    query: wantedGroup.value,
    filters: currentFilters.value,
    params: {
      $joinEager: 'workspace',
    },
    pageIndex: currentPageIndex,
    limit,
  })
  if (res instanceof Error) {
    error.value = true
  } else {
    suggestionGroups.value = res
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

const patchGroup = async (data: { id: string; name: string }) => {
  await groupsStore.squashGroups({
    id: data.id,
    name: data.name,
  })
  if (suggestionGroups.value && suggestionGroups.value.total > 0) {
    const groupFound = suggestionGroups.value.data.find(
      ({ id }: { id: string }) => id === data.id,
    )
    if (groupFound && groupFound.name !== data.name) {
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
