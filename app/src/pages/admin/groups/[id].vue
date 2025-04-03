<template>
  <error-handler :loading="pageLoading" :error="pageError">
    <template #not-found>
      <p>{{ t('locokit.pages.recordGroup.noGroupFound') }}</p>
      <p>{{ t('locokit.error.redundantError') }}</p>
    </template>

    <div class="max-w-3xl mx-auto flex flex-col">
      <h1 class="mb-4 text-2xl text-primary font-bold">
        {{ t('locokit.pages.recordGroup.title', { name: group?.name }) }}
      </h1>
      <div class="mb-12">
        <generic-form
          :fields
          :initial-values="formInitialValues"
          :loading="formLoading"
          :message="formMessage"
          :autocomplete-suggestions="suggestions"
          @complete="onComplete"
          @submit="onSubmit"
          :buttons="{
            submit: true,
            reset: true,
            cancel: false,
          }"
          field-area-class="grid grid-cols-2 gap-x-8 gap-y-4"
          button-position="block"
        />
      </div>
      <div>
        <h2 class="mb-4 text-xl text-primary font-bold">
          {{ t('locokit.pages.recordGroup.users') }}
        </h2>
        <p>
          {{ t('locokit.pages.recordGroup.explanationAddingUsers') }}
        </p>
        <p class="mb-4">
          {{ t('locokit.pages.recordGroup.explanationRemovingUsers') }}
        </p>

        <PrimeMessage
          v-if="membershipFormMessage"
          :severity="membershipFormMessage.status"
          @close="() => membershipFormMessage = null"
          class="mb-4"
          closable
        >
          {{ membershipFormMessage.text }}
        </PrimeMessage>

        <div class="flex items-center gap-2 mb-4">
          <PrimeAutoComplete
            v-model="selectedUser"
            @complete="onUserComplete"
            :suggestions="userSuggestions"
            :option-label="(opt) => `${opt.username} (${opt.firstName} ${opt.lastName})`"
            :placeholder="t('locokit.pages.recordGroup.userSearchPlaceholder')"
            force-selection
            class="flex-grow"
            fluid
          >
            <template #option="scope">
              <div class="flex flex-col">
                <span>
                  {{ scope.option.username }}
                </span>
                <span class="text-xs">
                  {{ scope.option.firstName }}
                  {{ scope.option.lastName }}
                </span>
              </div>
            </template>
          </PrimeAutoComplete>

          <PrimeSelect
            v-model="selectedRole"
            :options="roles"
            option-label="label"
            option-value="value"
          />

          <PrimeButton
            icon="bi bi-person-plus-fill"
            :label="t('locokit.pages.recordGroup.memberAdd')"
            :aria-label="t('locokit.pages.recordGroup.memberAddAria')"
            :disabled="!selectedUser || typeof selectedUser !== 'object'"
            @click="onAddButtonClick()"
          />
        </div>

        <PrimeDataTable
          :value="groupMembers.data"
          :paginator="Boolean(groupMembers.data)"
          :total-records="groupMembers.total"
          :rows="MEMBERS_PER_PAGE"
          @page="(event) => membershipPage = event.page"
          data-key="id"
          lazy
        >
          <template #empty>
            <p>{{ t('locokit.pages.recordGroup.noUserFound') }}</p>
          </template>
          <PrimeColumn :header="t('locokit.pages.recordGroup.memberColumnAccount')">
            <template #body="scope">
              <div class="flex gap-2 items-center">
                <div class="flex-auto">
                  <PrimeAvatar
                    v-if="scope.data.avatarURL"
                    :image="scope.data.avatarURL"
                    shape="circle"
                    size="large"
                  />
                  <PrimeAvatar
                    v-else
                    icon="bi bi-person-fill"
                    shape="circle"
                    size="large"
                  />
                </div>
                <div class="w-full flex-grow flex flex-col">
                  <span>
                    <RouterLink
                      :to="{
                        name: ROUTE_NAMES.ADMIN.USERS.RECORD,
                        params: { id: scope.data.id }
                      }"
                      :title="t('locokit.pages.recordGroup.memberLinkTitle', {
                        username: scope.data.username,
                      })"
                      class="hover:underline"
                    >
                      {{ scope.data.username }}
                    </RouterLink>
                  </span>
                  <span class="text-xs">
                    {{ scope.data.firstName }}
                    {{ scope.data.lastName }}
                  </span>
                </div>
              </div>
            </template>
          </PrimeColumn>
          <PrimeColumn :header="t('locokit.pages.recordGroup.memberColumnRole')">
            <template #body="scope">
              <PrimeSelect
                :options="roles"
                v-model="memberRoles[scope.data.id]"
                option-label="label"
                option-value="value"
                @change="(event) => onMemberRoleChange(event.value, scope.data)"
              />
            </template>
          </PrimeColumn>
          <PrimeColumn :header="t('locokit.pages.recordGroup.memberColumnCreatedAt')">
            <template #body="scope">
              {{ d(new Date(scope.data.createdAt), 'dateShort') }}
            </template>
          </PrimeColumn>
          <PrimeColumn class="text-right">
            <template #body="scope">
              <PrimeButton
                icon="bi bi-person-dash-fill"
                severity="danger"
                variant="outlined"
                @click="(event) => onRemoveButtonClick(event, scope.data)"
              />
            </template>
          </PrimeColumn>
        </PrimeDataTable>
      </div>
    </div>
  </error-handler>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onWatcherCleanup,
  ref,
  shallowRef,
  watch,
  watchEffect,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { type Paginated } from '@feathersjs/feathers'
import { Conflict } from '@feathersjs/errors'
import PrimeAutoComplete, { type AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import PrimeAvatar from 'primevue/avatar'
import PrimeButton from 'primevue/button'
import PrimeColumn from 'primevue/column'
import PrimeDataTable, { type DataTablePageEvent } from 'primevue/datatable'
import PrimeMessage from 'primevue/message'
import PrimeSelect from 'primevue/select'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { GenericForm, type GenericFormInitialValues } from '@locokit/vue-components'
import {
  FIELD_COMPONENT,
  FIELD_TYPE,
  GROUP_ROLE,
  SERVICES,
  type LocoKitFormField,
  type LocoKitFormFieldAutocomplete,
  type LocoKitMessage,
} from '@locokit/definitions'
import type {
  GroupResult,
  PolicyResult,
  UserResult,
  WorkspaceResult,
} from '@locokit/sdk'
import ErrorHandler from '@/components/error-handler.vue'
import { sdkClient } from '@/services/sdk'
import { searchUsers } from '@/services/core/user'
import { findPolicies } from '@/services/core/policy'
import ROUTE_NAMES from '@/router/routes'

interface LabelValuePair {
  label: string
  value: string
}

const { t, d } = useI18n()

definePage({
  name: ROUTE_NAMES.ADMIN.GROUPS.RECORD
})
useHead({
  titleTemplate: `${t('locokit.pages.admin.title')} | %s`,
})

const emit = defineEmits<{
  /**
   * Triggered when a group has been successfully patched.
   */
  'patch-group': [form: { id: string, name: string }],
}>()

const confirm = useConfirm()
const route = useRoute()
const toast = useToast()

const pageLoading = ref<boolean>(true)
const pageError = ref<unknown>(null)

const groupService = sdkClient.service(SERVICES.CORE_GROUP)
const userService = sdkClient.service(SERVICES.CORE_USER)
const userGroupService = sdkClient.service(SERVICES.CORE_USERGROUP)

const group = ref<GroupResult | null>(null)
const groupMembers = shallowRef<Paginated<UserResult>>({
  limit: 0, skip: 0, total: 0, data: []
})

const suggestions = ref<WorkspaceResult[] | PolicyResult[]>([])
const formLoading = ref(false)
const formMessage = ref<LocoKitMessage | null>(null)

const userSuggestions = ref<UserResult[]>([])
const selectedUser = ref<UserResult | string | null>(null)
const selectedRole = ref<keyof typeof GROUP_ROLE>(GROUP_ROLE.MEMBER)
const memberRoles = ref<Record<string, string>>({})
const membershipFormMessage = ref<LocoKitMessage | null>(null)
const membershipPage = ref<number>(0)
const MEMBERS_PER_PAGE = 20

const roles = computed<LabelValuePair[]>(() => {
  return [
    { label: t('locokit.commons.groupRole.member'), value: GROUP_ROLE.MEMBER },
    { label: t('locokit.commons.groupRole.owner'), value: GROUP_ROLE.OWNER },
    { label: t('locokit.commons.groupRole.admin'), value: GROUP_ROLE.ADMIN },
  ]
})

const fields = computed<LocoKitFormField[]>(() => {
  return [
    {
      id: 'id',
      label: t('locokit.pages.recordGroup.id'),
      type: FIELD_TYPE.ID_UUID,
      component: FIELD_COMPONENT.INPUT_TEXT,
      readonly: true,
    },
    {
      id: 'name',
      label: t('locokit.pages.recordGroup.name'),
      type: FIELD_TYPE.STRING,
      component: FIELD_COMPONENT.INPUT_TEXT,
      validationRules: {
        required: true,
        maxLength: 255,
      },
    },
    {
      id: 'workspace',
      label: t('locokit.pages.recordGroup.workspace'),
      type: FIELD_TYPE.STRING,
      component: FIELD_COMPONENT.INPUT_TEXT,
      disabled: true,
    },
    {
      id: 'policy',
      label: t('locokit.pages.recordGroup.policy'),
      type: FIELD_TYPE.ID_UUID,
      component: FIELD_COMPONENT.AUTOCOMPLETE,
      freeInput: false,
      source: {
        table: 'lck_policy',
        value: 'id',
        label: 'name',
      },
      validationRules: {
        required: true,
      },
    },
    {
      id: 'documentation',
      label: t('locokit.pages.recordGroup.documentation'),
      type: FIELD_TYPE.TEXT,
      component: FIELD_COMPONENT.TEXTAREA,
      rows: 5,
      validationRules: {
        required: false,
      },
      wrapperClass: 'col-span-2',
    },
  ]
})

const formInitialValues = computed<GenericFormInitialValues>(() => {
  if (!group.value) {
    return {} as GenericFormInitialValues
  }

  return {
    id: group.value.id,
    name: group.value.name,
    documentation: group.value.documentation,
    workspace: group.value.workspace.name,
    policy: {
      id: group.value.policy.id,
      name: group.value.policy.name,
    },
  }
})

watchEffect(async () => {
  pageLoading.value = true

  const controller = new AbortController()
  onWatcherCleanup(() => {
    controller.abort()
  })

  try {
    group.value = await groupService.get(route.params.id, {
      query: { $eager: '[workspace,policy]' },
      connection: {
        signal: controller.signal,
      },
    })
  } catch (e) {
    pageError.value = e
  }

  pageLoading.value = false
})

watch([group, membershipPage], async ([group, page]: [GroupResult | null, number]) => {
  if (!group) {
    return
  }

  const controller = new AbortController()
  onWatcherCleanup(() => {
    controller.abort()
  })

  try {
    groupMembers.value = await userService.find({
      query: {
        $joinEager: 'memberships',
        'memberships.groupId': group.id,
        $sort: { username: 1 },
        $limit: MEMBERS_PER_PAGE,
        $skip: page * MEMBERS_PER_PAGE,
      },
      connection: {
        signal: controller.signal,
      }
    }) as Paginated<UserResult>
  } catch (e) {
    console.log(e)
  }
})

watchEffect(() => {
  const roles = {} as Record<string, string>

  if (groupMembers.value.data) {
    groupMembers.value.data.forEach((member) => {
      roles[member.id] = member.memberships[0].role
    })
  }

  memberRoles.value = roles
})

async function fetchGroupMembers() {
  try {
    groupMembers.value = await userService.find({
      query: {
        $joinEager: 'memberships',
        'memberships.groupId': group.value.id,
        $sort: { username: 1 },
        $limit: MEMBERS_PER_PAGE,
        $skip: membershipPage.value * MEMBERS_PER_PAGE,
      },
    }) as Paginated<UserResult>
  } catch (e) {
    console.log(e)
  }
}

async function onAddButtonClick() {
  if (!group.value || !selectedUser.value) {
    return;
  }

  try {
    await userGroupService.create({
      userId: selectedUser.value.id,
      groupId: group.value.id,
      role: selectedRole.value,
    })

    toast.add({
      severity: 'success',
      summary: t('locokit.pages.recordGroup.memberAdded', {
        username: selectedUser.value.username,
      }),
      life: 3000,
    })

    selectedUser.value = null
    membershipFormMessage.value = null

    fetchGroupMembers()
  } catch (e) {
    if (e instanceof Conflict) {
      membershipFormMessage.value = {
        status: 'warn',
        text: t('locokit.pages.recordGroup.alreadyMemberError', {
          username: selectedUser.value.username,
        }),
      }

      selectedUser.value = null
    } else {
      membershipFormMessage.value = {
        status: 'error',
        text: (e instanceof Error) ? e.message : (e as string),
      }
    }
  }
}

function onRemoveButtonClick(event: MouseEvent, user: UserResult) {
  if (!group.value) {
    return;
  }

  confirm.require({
    target: event.currentTarget as HTMLElement,
    appendTo: 'self',
    message: t('locokit.pages.recordGroup.memberRemovalConfirm', {
      username: user.username,
    }),
    acceptProps: {
      label: t('locokit.pages.recordGroup.memberRemovalAccept'),
    },
    rejectProps: {
      label: t('locokit.pages.recordGroup.memberRemovalReject'),
      severity: 'secondary',
      outlined: true,
    },
    accept: async () => {
      try {
        await userGroupService.remove(`${user.id},${group.value.id}`)

        toast.add({
          severity: 'success',
          summary: t('locokit.pages.recordGroup.memberRemoved', {
            username: user.username,
          }),
          life: 3000,
        })

        membershipFormMessage.value = null

        fetchGroupMembers()
      } catch (e) {
        membershipFormMessage.value = {
          status: 'error',
          text: (e instanceof Error) ? e.message : (e as string),
        }
      }
    },
  })
}

async function onMemberRoleChange(newRole: keyof typeof GROUP_ROLE, user: UserResult) {
  const member = groupMembers.value.data.find((item) => item.id === user.id)

  try {
    await userGroupService.patch(`${user.id},${group.value.id}`, {
      role: newRole,
    })

    membershipFormMessage.value = null

    toast.add({
      severity: 'success',
      summary: t('locokit.pages.recordGroup.memberRoleChanged', {
        username: user.username,
        role: t('locokit.commons.userProfile.' + newRole.toLowerCase()),
      }),
      life: 3000,
    })

    member.memberships[0].role = newRole
  } catch (e) {
    membershipFormMessage.value = {
      status: 'error',
      text: (e instanceof Error) ? e.message : (e as string),
    }

    // We have to restore the initial role to keep the UI consistent with the
    // reality. But modifying the value of the component's model while we are
    // already reacting to its change does not work at all: data and render
    // end up desynchronized. For that reason, we defer the restoration of
    // the initial role until the next tick to preserve a consistent state.
    await nextTick()
    memberRoles.value[member.id] = member.memberships[0].role
  }
}

async function onUserComplete(event: AutoCompleteCompleteEvent) {
  try {
    const params: Record<string, unknown> = {}

    const result = await searchUsers({
      search: event.query,
      params,
      limit: 10,
      sort: { username: 1 }
    }) as Paginated<UserResult>

    userSuggestions.value = result.data
  } catch (e) {
    membershipFormMessage.value = {
      status: 'error',
      text: (e instanceof Error) ? e.message : (e as string),
    }
  }
}

async function onComplete(
  event: AutoCompleteCompleteEvent,
  field: LocoKitFormFieldAutocomplete,
  values: Record<string, unknown>
) {
  try {
    const params: Record<string, unknown> = {}

    switch (field.id) {
      case 'policy':
        //params.workspaceId = values.workspace
        params.workspaceId = group.value.workspace.id
        if (event.query) {
          params.name = { $ilike: `%${event.query}%` }
        }

        const policies = await findPolicies({ params, sort: { name: 1 } }) as Paginated<PolicyResult>

        suggestions.value = policies.data
        break
    }
  } catch (e) {
    formMessage.value = {
      status: 'error',
      text: (e instanceof Error) ? e.message : (e as string),
    }
  }
}

async function onSubmit(values: Record<string, unknown>) {
  if (!group.value) {
    return
  }

  try {
    await groupService.patch(group.value.id, {
      name: values.name,
      policyId: values.policy,
      documentation: values.documentation,
    })

    group.value = await groupService.get(group.value.id, {
      query: { $eager: '[workspace,policy]' },
    })

    formMessage.value = null

    toast.add({
      severity: 'success',
      summary: t('locokit.success.basic'),
      life: 3000,
    })

    emit('patch-group', {
      id: group.value.id,
      name: group.value.name,
    })
  } catch (err) {
    pageError.value = err as Error
  }
}
</script>

<style scoped>
:deep(.p-inputtext:read-only) {
  color: var(--p-slate-500);
}
:deep(.p-avatar-icon.bi::before),
:deep(.p-avatar-icon[class^="bi-"]::before),
:deep(.p-avatar-icon[class*=" bi-"]::before) {
  vertical-align: top;
}
</style>
