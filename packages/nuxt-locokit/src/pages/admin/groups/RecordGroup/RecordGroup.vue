<template>
  <div class="max-w-2xl lg:h-full mx-auto px-4 lg:px-0 flex flex-col">
    <div class="my-8">
      <h1>
        {{ $t('pages.recordGroup.title') }}
      </h1>
    </div>
    <div v-if="!currentGroup">
      <p>{{ $t('pages.recordGroup.noGroupFound') }}</p>
      <p>{{ $t('error.redundantError') }}</p>
    </div>
    <div v-else>
      <div class="mb-12">
        <FormGeneric
          label-tk-button-submit="pages.recordGroup.submit"
          :response="response || errorGroupsStore"
          :loading="loading"
          color-submit-button="secondary"
          :full-width-button="true"
          icon-submit-button="bi-check-2"
          :reset-form-with-empty-value="false"
          @submit="onSubmit"
          @reset="onReset"
        >
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-4">
              <label for="id">
                {{ $t('pages.recordGroup.id') }}
              </label>
              <PrimeInputText
                id="id"
                v-model="currentGroup.id"
                :disabled="true"
              />
            </div>
            <Field
              v-slot="{ field, errorMessage, meta: { valid, touched } }"
              v-model="currentGroup.name"
              class="mb-4"
              name="recordGroup.name"
              rules="required"
              as="div"
            >
              <label for="name" class="label-field-required">
                {{ $t('pages.recordGroup.name') }}
              </label>
              <PrimeInputText
                id="name"
                v-bind="field"
                :class="{ 'p-invalid': !valid && touched }"
                required
              />
              <span
                v-if="errorMessage"
                class="p-text-error"
                role="alert"
                aria-live="assertive"
              >
                {{ errorMessage }}
              </span>
            </Field>
            <Field
              v-slot="{ field, errorMessage, meta: { valid, touched } }"
              v-model="policy"
              class="mb-4"
              name="recordGroup.policy"
              rules="required"
              as="div"
            >
              <label for="policy" class="label-field-required">
                {{ $t('pages.recordGroup.policy') }}
              </label>
              <PrimeAutoComplete
                v-bind="{
                  ...field,
                  onChange: ({ value: newValue }) =>
                    field.onChange.forEach((fct) => fct(newValue)),
                  'model-value': field.value,
                }"
                input-id="policy"
                :placeholder="$t('pages.recordGroup.search')"
                :empty-search-message="$t('pages.recordGroup.emptyResult')"
                :suggestions="suggestedPolicies"
                option-label="name"
                :class="{ 'p-invalid': !valid && touched }"
                force-selection
                @complete="searchPolicies"
              />
              <span
                v-if="errorMessage"
                class="p-text-error"
                role="alert"
                aria-live="assertive"
              >
                {{ errorMessage }}
              </span>
            </Field>
            <Field
              v-slot="{ field, errorMessage, meta: { valid, touched } }"
              v-model="workspace"
              class="mb-4"
              name="recordGroup.workspace"
              rules="required"
              as="div"
            >
              <label for="workspace" class="label-field-required">
                {{ $t('pages.recordGroup.workspace') }}
              </label>
              <PrimeAutoComplete
                v-bind="{
                  ...field,
                  onChange: ({ value: newValue }) =>
                    field.onChange.forEach((fct) => fct(newValue)),
                  'model-value': field.value,
                }"
                input-id="workspace"
                :placeholder="$t('pages.recordGroup.search')"
                :empty-search-message="$t('pages.recordGroup.emptyResult')"
                :suggestions="suggestedWorkspaces"
                option-label="name"
                :class="{ 'p-invalid': !valid && touched }"
                force-selection
                @complete="searchWorkspaces"
              />
              <span
                v-if="errorMessage"
                class="p-text-error"
                role="alert"
                aria-live="assertive"
              >
                {{ errorMessage }}
              </span>
            </Field>
            <Field
              v-slot="{ field }"
              v-model="currentGroup.documentation"
              class="mb-4 col-span-full"
              name="recordGroup.documentation"
              as="div"
            >
              <label for="name">
                {{ $t('pages.recordGroup.documentation') }}
              </label>
              <PrimeTextarea
                id="documentation"
                v-bind="field"
                auto-resize
                rows="5"
              />
            </Field>
          </div>
        </FormGeneric>
      </div>
      <div>
        <h2 class="mb-4">
          {{ $t('pages.recordGroup.users') }}
        </h2>
        <p>
          {{ $t('pages.recordGroup.explanationAddingUsers') }}
        </p>
        <p class="mb-4">
          {{ $t('pages.recordGroup.explanationRemovingUsers') }}
        </p>
        <PickData
          v-if="users && suggestUsers"
          v-model="users"
          :from-data="suggestUsers.data"
          @update:model-value="updateUserGroupForCurrentUser"
        >
          <template #fromDataHeader>
            <div>
              <p>
                {{ $t('pages.recordGroup.usersAvailable') }}
              </p>
              <PrimeInputText
                v-model="queryForAvailableUser"
                :placeholder="$t('pages.recordGroup.searchPlaceholder')"
                type="text"
                class="search-input"
                @input="searchUsersExceptMembers"
              />
            </div>
          </template>
          <template #toDataHeader>
            <div>
              <p>
                {{ $t('pages.recordGroup.userMembers') }}
              </p>
              <PrimeInputText
                v-model="queryForUserMembers"
                :placeholder="$t('pages.recordGroup.searchPlaceholder')"
                type="text"
                class="search-input"
                @input="searchUserMembers"
              />
            </div>
          </template>
          <template #fromDataFooter>
            <div>
              <p>
                {{
                  $t('pages.recordGroup.result', {
                    elements: suggestUsers.limit,
                  })
                }}
              </p>
            </div>
          </template>
          <template #fromNoResult>
            <p>{{ $t('pages.recordGroup.noUserFound') }}</p>
          </template>
          <template #toNoResult>
            <p>{{ $t('pages.recordGroup.noUserFound') }}</p>
          </template>
          <template #toDataFooter>
            <div>
              <p>
                {{
                  $t('pages.recordGroup.result', {
                    elements: suggestUsers.limit,
                  })
                }}
              </p>
            </div>
          </template>
          <template #item="slotProps">
            <IdentityCard
              :title="slotProps.item.username"
              :subtitle="slotProps.item.email"
              :name-tag="
                $t(
                  `pages.adminUsers.${
                    PROFILE.find(
                      (profile) => profile.value === slotProps.item.profile,
                    ).name
                  }`,
                )
              "
              :icon="
                slotProps.item.blocked
                  ? 'bi-person-fill-lock'
                  : 'bi-person-fill'
              "
              :color-icon="
                slotProps.item.isVerified ? 'text-primary' : 'text-secondary'
              "
              border-color-tag="var(--primary-color)"
              color-tag="var(--primary-color)"
              bg-color-tag="transparent"
            />
          </template>
        </PickData>
        <MessageForUser v-if="errorUserGroup" status="failed" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PrimeInputText from 'primevue/inputtext'
import PrimeTextarea from 'primevue/textarea'
import PrimeAutoComplete from 'primevue/autocomplete'
import {
  FormGeneric,
  IdentityCard,
  PickData,
  MessageForUser,
} from '@locokit/designsystem'
import { Field } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { useStoreGroups } from '../../../../stores/groups'
import {
  Group,
  Policy,
  LabelValueType,
  Workspace,
  User,
  ApiUser,
  PROFILE,
} from '../../../../interfaces/toMigrate'
import {
  getGroup,
  ITEMS_PER_PAGE_GROUPS,
  patchGroup,
} from '../../../../services/group'
import {
  findMembersFomGroup,
  findUsers,
  searchUsers,
} from '../../../../services/user'
import { findPolicies } from '../../../../services/policy'
import { findWorkspaces } from '../../../../services/workspace'
import {
  removeUserGroup,
  updateUserGroup,
} from '../../../../services/usergroup'
import { useRoute, ref, computed } from '#imports'

const emit = defineEmits<{
  (
    e: 'patch-group',
    form: {
      id: string
      name: string
    },
  ): void
}>()

const route = useRoute()
const groupsStore = useStoreGroups()
const { loading, error: errorGroupsStore } = storeToRefs(groupsStore)

const currentGroup = ref<Group>()
const response = ref(null)
const suggestedPolicies = ref<Policy[] | null>(null)
const suggestedWorkspaces = ref<Workspace[] | null>(null)
const currentUsersForGroup = ref<ApiUser | null>(null) // user already in group with Pagination
const users = ref<User[]>([]) // Array for PickList based on currentUsersForGroup
const suggestUsers = ref(null) // Other users with Pagination
const queryForAvailableUser = ref<string | null>(null) // Query for search to find available user
const queryForUserMembers = ref<string | null>(null) // Query for search to find member's user
const errorUserGroup = ref(false)

const searchUsersExceptMembers = async () => {
  if (users.value.length > 0) {
    const userGroupsIds = users.value.reduce((acc: string[], user) => {
      acc.push(user.id)
      return acc
    }, [])
    if (queryForAvailableUser.value) {
      suggestUsers.value = await searchUsers({
        query: queryForAvailableUser.value,
        params: { id: { $nin: userGroupsIds } },
      })
    } else {
      suggestUsers.value = await findUsers({
        params: { id: { $nin: userGroupsIds } },
      })
    }
  } else {
    suggestUsers.value = await findUsers()
  }
}

// Initialization
const resGroup = await getGroup(route.params.id as string, {
  query: { $eager: '[workspace,policy]' },
})
if (resGroup.id) currentGroup.value = resGroup
if (currentGroup.value) {
  const res = await findMembersFomGroup(currentGroup.value.id)
  currentUsersForGroup.value = res
  if (res && res.total >= 0) {
    users.value = [...res.data]
    await searchUsersExceptMembers()
  }
}

const policy = computed<LabelValueType>({
  get() {
    return {
      name: currentGroup.value?.policy?.name as string,
      value: currentGroup.value?.policy?.id as string,
    }
  },
  set(newValue: LabelValueType) {
    if (!currentGroup.value || !newValue || !newValue.value) return
    currentGroup.value = {
      ...currentGroup.value,
      roleId: newValue.value,
    }
  },
})

const workspace = computed<LabelValueType>({
  get() {
    return {
      name: currentGroup.value?.workspace?.name as string,
      value: currentGroup.value?.workspace?.id as string,
    }
  },
  set(newValue: LabelValueType) {
    if (!currentGroup.value || !newValue || !newValue.value) return
    currentGroup.value = {
      ...currentGroup.value,
      workspaceId: newValue.value,
    }
  },
})

const searchWorkspaces = async (event: {
  originalEvent: Event
  query: string
}) => {
  const workspaces = await findWorkspaces({
    params: {
      name: {
        $ilike: `%${event.query}%`,
      },
    },
  })
  if (workspaces.total > 0) {
    suggestedWorkspaces.value = workspaces.data
  }
}

const searchPolicies = async (event: {
  originalEvent: Event
  query: string
}) => {
  const policies = await findPolicies({
    params: {
      name: {
        $ilike: `%${event.query}%`,
      },
    },
  })
  if (policies.total > 0) {
    suggestedPolicies.value = policies.data
  }
}

const searchUserMembers = async () => {
  if (users.value) {
    const userGroupsIds = users.value.reduce((acc: string[], group) => {
      acc.push(group.id)
      return acc
    }, [])

    if (queryForUserMembers.value) {
      const res = await searchUsers({
        query: queryForUserMembers.value,
        params: { id: { $in: userGroupsIds } },
      })
      users.value = res.data
    } else if (currentUsersForGroup.value) {
      // Retrieve data from previous request
      users.value = currentUsersForGroup.value.data
    }
  }
}

const addUserInGroup = () => {
  ;(users.value as User[]).forEach(async (user) => {
    const alreadyMember = (
      currentUsersForGroup.value as ApiUser
    ).data.findIndex(({ id }) => id === user.id)
    if (alreadyMember === -1) {
      const res = await updateUserGroup({
        userId: user.id,
        groupId: (currentGroup.value as Group).id,
      })
      if (res instanceof Error) {
        errorUserGroup.value = true
      }
    }
  })
}

const removeUserInGroup = () => {
  ;(currentUsersForGroup.value as ApiUser).data.forEach(async (user) => {
    const revokedMember = (users.value as User[]).findIndex(
      ({ id }) => id === user.id,
    )

    if (revokedMember === -1) {
      const res = await removeUserGroup({
        userId: user.id,
        groupId: (currentGroup.value as Group).id,
      })
      if (res instanceof Error) {
        errorUserGroup.value = true
      }
    }
  })
}

const updateUserGroupForCurrentUser = async () => {
  // Limit because there is no pagination in PickData (for now)
  if (
    users.value &&
    currentUsersForGroup.value &&
    users.value.length < ITEMS_PER_PAGE_GROUPS
  ) {
    if (users.value.length > currentUsersForGroup.value.data.length) {
      await addUserInGroup()
    }
    if (users.value.length < currentUsersForGroup.value.data.length) {
      await removeUserInGroup()
    }
    queryForAvailableUser.value = null
    queryForUserMembers.value = null
    const members = await findMembersFomGroup((currentGroup.value as Group).id)
    if (members.total) users.value = members.data
  }
}

const onSubmit = async () => {
  if (!currentGroup.value) return
  const res = await patchGroup(currentGroup.value.id, {
    name: currentGroup.value.name,
    roleId: policy.value.value,
    workspaceId: workspace.value.value,
    documentation: currentGroup.value?.documentation,
  })

  if (res && res.id) {
    response.value = res
    emit('patch-group', {
      id: currentGroup.value.id,
      name: currentGroup.value.name,
    })
  }
}

const onReset = async () => {
  currentGroup.value = await getGroup(route.params.id as string)
}
</script>
