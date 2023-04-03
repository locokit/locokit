<template>
  <div class="max-w-md lg:h-full mx-auto px-4 lg:px-0 flex flex-col">
    <div class="my-8">
      <h1>
        {{ $t('pages.recordUser.title') }}
      </h1>
    </div>
    <div v-if="!currentUser">
      <p>{{ $t('pages.recordUser.noUserFound') }}</p>
      <p>{{ $t('error.redundantError') }}</p>
    </div>
    <div v-else>
      <div class="flex flex-col mb-8">
        <PrimeConfirmDialog />
        <div class="flex flex-row justify-around">
          <div class="flex flex-col">
            <span v-if="currentUser.blocked">
              {{ $t('pages.recordUser.unblocking') }}
            </span>
            <span v-else>
              {{ $t('pages.recordUser.blocking') }}
            </span>
            <PrimeButton
              class="p-button-rounded p-button-outlined"
              icon="bi-envelope"
              :label="$t('pages.recordUser.send')"
              @click="confirmBlockingUser"
            />
          </div>
          <div class="flex flex-col">
            <span>{{ $t('pages.recordUser.inviting') }}</span>
            <PrimeButton
              :disabled="currentUser.isVerified"
              class="p-button-rounded p-button-outlined"
              icon="bi-envelope"
              :label="$t('pages.recordUser.resend')"
              @click="confirmSendVerifySignup"
            />
          </div>
        </div>
        <MessageForUser
          v-if="
            ((errorUserStore && errorUserStore.name) ||
              (errorAuthStore && errorAuthStore.name)) &&
            actionFromButton
          "
          status="failed"
        />
      </div>
      <div class="mb-12">
        <FormGeneric
          label-tk-button-submit="pages.recordUser.submit"
          :response="response || errorUserStore"
          :loading="loading"
          color-submit-button="secondary"
          :full-width-button="true"
          icon-submit-button="bi-check-2"
          :reset-form-with-empty-value="false"
          @submit="onSubmit"
          @reset="onReset"
        >
          <div class="mb-4">
            <label for="id">
              {{ $t('pages.recordUser.id') }}
            </label>
            <PrimeInputText id="id" v-model="currentUser.id" :disabled="true" />
          </div>
          <Field
            v-slot="{ field, errorMessage, meta: { valid, touched } }"
            v-model="currentUser.username"
            class="mb-4"
            name="recordUser.username"
            rules="required"
            as="div"
          >
            <label for="username" class="label-field-required">
              {{ $t('pages.recordUser.username') }}
            </label>
            <PrimeInputText
              id="username"
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
            v-model="currentUser.lastName"
            class="mb-4"
            name="recordUser.lastName"
            as="div"
          >
            <label for="lastName">
              {{ $t('pages.recordUser.lastName') }}
            </label>
            <PrimeInputText
              id="lastName"
              v-bind="field"
              :class="{ 'p-invalid': !valid && touched }"
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
            v-model="currentUser.firstName"
            class="mb-4"
            name="recordUser.firstName"
            as="div"
          >
            <label for="firstName">
              {{ $t('pages.recordUser.firstName') }}
            </label>
            <PrimeInputText
              id="firstName"
              v-bind="field"
              :class="{ 'p-invalid': !valid && touched }"
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
            v-model="currentUser.email"
            class="mb-4"
            name="recordUser.email"
            rules="required|email"
            as="div"
          >
            <label for="email" class="label-field-required">
              {{ $t('pages.recordUser.email') }}
            </label>
            <PrimeInputText
              id="email"
              type="email"
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
            v-slot="{ field }"
            v-model="profile"
            class="mb-4"
            name="recordUser.profile"
            rules="required"
            as="div"
          >
            <label for="profile" class="label-field-required">
              {{ $t('pages.recordUser.profile') }}
            </label>
            <PrimeDropdown
              v-bind="{
                ...field,
                onChange: ({ value: newValue }) =>
                  field.onChange.forEach((fct) => fct(newValue)),
                'model-value': field.value,
              }"
              input-id="profile"
              :options="PROFILE"
              option-label="label"
              dropdown-icon="bi-chevron-down"
              required
            >
              <template #value="slotProps">
                <span v-if="slotProps.value">
                  {{ $t(`pages.recordUser.${slotProps.value.label}`) }}
                </span>
              </template>
              <template #option="slotProps">
                <span>
                  {{ $t(`pages.recordUser.${slotProps.option.label}`) }}
                </span>
              </template>
            </PrimeDropdown>
          </Field>
          <div class="mb-4 flex flex-col">
            <label for="isVerified">
              {{ $t('pages.recordUser.isVerified') }}
            </label>
            <PrimeSwitch
              id="isVerified"
              v-model="currentUser.isVerified"
              :true-value="true"
              :false-value="false"
              :disabled="true"
            />
          </div>
          <div class="mb-4 flex flex-col">
            <label for="isBlocked">
              {{ $t('pages.recordUser.isBlocked') }}
            </label>
            <PrimeSwitch
              id="isBlocked"
              v-model="currentUser.blocked"
              :true-value="true"
              :false-value="false"
              :disabled="true"
            />
          </div>
        </FormGeneric>
      </div>
      <div>
        <h2 class="mb-4">
          {{ $t('pages.recordUser.groups') }}
        </h2>
        <p>
          {{ $t('pages.recordUser.explanationAddingGroups') }}
        </p>
        <p class="mb-4">
          {{ $t('pages.recordUser.explanationRemovingGroups') }}
        </p>
        <PickData
          v-if="groups && suggestGroups"
          v-model="groups"
          :from-data="suggestGroups.data"
          @update:model-value="updateUserGroupForCurrentUser"
        >
          <template #fromDataHeader>
            <div>
              <p>
                {{ $t('pages.recordUser.groupsAvailable') }}
              </p>
              <PrimeInputText
                v-model="queryForAvailableGroup"
                :placeholder="$t('pages.recordUser.searchPlaceholder')"
                type="text"
                class="search-input"
                @input="searchGroupsExceptJoined"
              />
            </div>
          </template>
          <template #toDataHeader>
            <div>
              <p>
                {{ $t('pages.recordUser.groupsJoined') }}
              </p>
              <PrimeInputText
                v-model="queryForJoinedGroup"
                :placeholder="$t('pages.recordUser.searchPlaceholder')"
                type="text"
                class="search-input"
                @input="searchGroupsJoined"
              />
            </div>
          </template>
          <template #item="slotProps">
            <IdentityCard
              :title="slotProps.item.name"
              :name-tag="slotProps.item.workspace.name"
              icon="bi bi-people"
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
import PrimeButton from 'primevue/button'
import PrimeSwitch from 'primevue/inputswitch'
import PrimeInputText from 'primevue/inputtext'
import PrimeDropdown from 'primevue/dropdown'
import PrimeConfirmDialog from 'primevue/confirmdialog'
import {
  FormGeneric,
  MessageForUser,
  PickData,
  IdentityCard,
} from '@locokit/designsystem'
import { Field } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { useConfirm } from 'primevue/useconfirm'
import { useI18n } from 'vue-i18n'
import { useStoreUsers } from '../../../../stores/users'
import {
  ApiGroup,
  Group,
  PROFILE,
  ProfileType,
  User,
} from '../../../../interfaces/toMigrate'
import { useStoreAuth } from '../../../../stores/auth'
import {
  removeUserGroup,
  updateUserGroup,
} from '../../../../services/usergroup'
import {
  findGroups,
  findGroupsFomUser,
  ITEMS_PER_PAGE_GROUPS,
  searchGroups,
} from '../../../../services/group'
import { getUser, patchUser } from '../../../../services/user'
import { useRoute, ref, computed } from '#imports'

const emit = defineEmits<{
  (
    e: 'patch-user',
    form: {
      id: string
      username: string
      lastName: string | null
      firstName: string | null
    },
  ): void
}>()

const route = useRoute()
const usersStore = useStoreUsers()
const { loading, error: errorUserStore } = storeToRefs(usersStore)
const authStore = useStoreAuth()
const { error: errorAuthStore } = storeToRefs(authStore)
const { t } = useI18n()
const confirm = useConfirm()

const currentUser = ref<User>()
const currentGroupsForUser = ref<ApiGroup | null>(null) // Member groups with Pagination
const groups = ref<Group[]>([]) // Array for PickList based on currentGroupsForUser
const suggestGroups = ref(null) // Other groups with Pagination
const queryForAvailableGroup = ref<string | null>(null) // Query for search in available group
const queryForJoinedGroup = ref<string | null>(null) // Query for search in joined group
const actionFromButton = ref(false)
const response = ref(null)
const errorUserGroup = ref(false)

const searchGroupsExceptJoined = async () => {
  if (groups.value.length > 0) {
    const userGroupsIds = groups.value.reduce((acc: string[], group) => {
      acc.push(group.id)
      return acc
    }, [])
    if (queryForAvailableGroup.value) {
      suggestGroups.value = await searchGroups({
        query: queryForAvailableGroup.value,
        params: { id: { $nin: userGroupsIds }, $eager: 'workspace' },
      })
    } else {
      suggestGroups.value = await findGroups({
        params: { id: { $nin: userGroupsIds }, $eager: 'workspace' },
      })
    }
  } else {
    suggestGroups.value = await findGroups({
      params: { $eager: 'workspace' },
    })
  }
}

// Initialization
currentUser.value = await getUser(route.params.id as string)
if (currentUser.value) {
  const res = await findGroupsFomUser(currentUser.value.id)
  currentGroupsForUser.value = res
  if (res && res.total >= 0) {
    groups.value = [...res.data]
    await searchGroupsExceptJoined()
  }
}

const profile = computed<ProfileType>({
  get() {
    return PROFILE.find(
      ({ value }) => value === currentUser.value?.profile,
    ) as ProfileType
  },
  set(newValue) {
    if (!currentUser.value || !newValue || !newValue.value) return
    currentUser.value = {
      ...currentUser.value,
      profile: newValue.value,
    }
  },
})

const blockUser = async () => {
  if (!currentUser.value) return
  await usersStore.blockAccountUser(
    currentUser.value.id,
    currentUser.value?.isBlocked,
  )
  actionFromButton.value = true
}

const confirmBlockingUser = () => {
  if (!currentUser.value) return
  confirm.require({
    message: t('pages.recordUser.messageBlockingUser', {
      username: currentUser.value.username,
    }),
    header: t('pages.recordUser.confirmation'),
    icon: 'bi bi-exclamation-triangle-fill',
    accept: () => {
      blockUser()
    },
  })
}

const sendVerifySignup = async () => {
  if (!currentUser.value) return
  await authStore.sendEmailVerifySignup(currentUser.value.email)
  actionFromButton.value = true
}

const confirmSendVerifySignup = () => {
  if (!currentUser.value) return
  confirm.require({
    message: t('pages.recordUser.messageResendVerifySignup', {
      username: currentUser.value.username,
    }),
    header: t('pages.recordUser.confirmation'),
    icon: 'bi bi-exclamation-triangle-fill',
    accept: () => {
      sendVerifySignup()
    },
  })
}

const onSubmit = async () => {
  if (!currentUser.value) return
  const res = await patchUser(currentUser.value.id, {
    username: currentUser.value.username,
    lastName: currentUser.value.lastName,
    firstName: currentUser.value.firstName,
    email: currentUser.value.email,
    profile: currentUser.value.profile,
  })

  if (res && res.id) {
    response.value = res
    emit('patch-user', {
      id: currentUser.value.id,
      username: currentUser.value.username,
      lastName: currentUser.value.lastName,
      firstName: currentUser.value.firstName,
    })
  }
}

const addUserInGroup = () => {
  ;(groups.value as Group[]).forEach(async (group) => {
    const alreadyMember = (
      currentGroupsForUser.value as ApiGroup
    ).data.findIndex(({ id }) => id === group.id)
    if (alreadyMember === -1) {
      const res = await updateUserGroup({
        userId: (currentUser.value as User).id,
        groupId: group.id,
      })
      if (res instanceof Error) {
        errorUserGroup.value = true
      }
    }
  })
}

const removeUserInGroup = () => {
  ;(currentGroupsForUser.value as ApiGroup).data.forEach(
    async (groupForUser) => {
      const revokedMember = (groups.value as Group[]).findIndex(
        ({ id }) => id === groupForUser.id,
      )

      if (revokedMember === -1) {
        const res = await removeUserGroup({
          userId: (currentUser.value as User).id,
          groupId: groupForUser.id,
        })
        if (res instanceof Error) {
          errorUserGroup.value = true
        }
      }
    },
  )
}

const updateUserGroupForCurrentUser = async () => {
  // Limit because there is no pagination (for now)
  if (
    groups.value &&
    currentGroupsForUser.value &&
    groups.value.length < ITEMS_PER_PAGE_GROUPS
  ) {
    if (groups.value.length > currentGroupsForUser.value.data.length) {
      addUserInGroup()
    }
    if (groups.value.length < currentGroupsForUser.value.data.length) {
      removeUserInGroup()
    }
    if (!errorUserGroup.value) {
      queryForAvailableGroup.value = null
      await searchGroupsExceptJoined()
    }
  }
}

const searchGroupsJoined = async () => {
  if (groups.value) {
    const userGroupsIds = groups.value.reduce((acc: string[], group) => {
      acc.push(group.id)
      return acc
    }, [])

    if (queryForJoinedGroup.value) {
      const res = await searchGroups({
        query: queryForJoinedGroup.value,
        params: { id: { $in: userGroupsIds } },
      })
      groups.value = res.data
    } else if (currentGroupsForUser.value) {
      // Retrieve data from previous request
      groups.value = currentGroupsForUser.value.data
    }
  }
}

const onReset = async () => {
  currentUser.value = await getUser(route.params.id as string)
}
</script>

<style scoped>
.search-input {
  @apply py-2 px-[2.5rem];
  background: white url('../../../../assets/search.svg') no-repeat 10px center;
}
</style>
