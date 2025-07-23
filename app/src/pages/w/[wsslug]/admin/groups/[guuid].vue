<template>
  <error-handler :error="state.error">
    <template #not-found>
      <p>{{ t('locokit.pages.recordGroup.noGroupFound') }}</p>
      <p>{{ t('locokit.error.redundantError') }}</p>
    </template>

    <div class="max-w-4xl lg:h-full mx-auto p-3 lg:px-0 flex flex-col">
      <h1 class="mb-2 text-2xl text-primary">
        {{ t('locokit.pages.recordGroup.title', { name: state.group?.name }) }}
      </h1>
      <p class="text-xs mb-4 font-mono">id: {{ state.group?.id }}</p>
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
          class="rounded-xl border border-surface-300 bg-white p-4"
        />
      </div>
      <div class="rounded-xl border border-surface-300 bg-white p-4 mb-12">
        <h2 class="mb-4 text-xl text-primary">
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
          @close="() => (membershipFormMessage = null)"
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
          :value="state.members?.data"
          :paginator="Boolean(state.members?.data)"
          :total-records="state.members?.total"
          :rows="MEMBERS_PER_PAGE"
          @page="fetchUserGroup(state.group.id, $event.page)"
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
                    v-if="scope.data.user.avatarURL"
                    :image="scope.data.user.avatarURL"
                    shape="circle"
                    size="large"
                  />
                  <PrimeAvatar v-else icon="bi bi-person-fill" shape="circle" size="large" />
                </div>
                <div class="w-full flex-grow flex flex-col">
                  <span>
                    {{ scope.data.user.username }}
                  </span>
                  <span class="text-xs">
                    {{ scope.data.user.firstName }}
                    {{ scope.data.user.lastName }}
                  </span>
                </div>
              </div>
            </template>
          </PrimeColumn>
          <PrimeColumn :header="t('locokit.pages.recordGroup.memberColumnRole')">
            <template #body="scope">
              <PrimeSelect
                :options="roles"
                :model-value="scope.data.role"
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
      <div class="rounded-xl border border-surface-300 bg-white p-4 mb-12">
        <h2 class="mb-4 text-xl text-primary">Variables</h2>
        <PrimeDataTable
          :value="state.policyVariables?.data"
          :total-records="state.policyVariables?.total"
          data-key="id"
          lazy
        >
          <template #empty>
            <p>{{ t('locokit.pages.recordGroup.noUserFound') }}</p>
          </template>
          <PrimeColumn header="name">
            <template #body="scope">
              <div class="flex flex-col">
                {{ scope.data.name }}
                <span class="text-xs">{{ scope.data.documentation }}</span>
              </div>
            </template>
          </PrimeColumn>
          <PrimeColumn header="slug">
            <template #body="scope">
              <span class="font-mono">
                {{ scope.data.slug }}
              </span>
            </template>
          </PrimeColumn>
          <PrimeColumn header="value">
            <template #body="scope">
              <PrimeInputText
                :model-value="state.groupPolicyVariables?.[scope.data.id]?.value?.string"
                @change="
                  onPolicyVariableChange(
                    $event.target.value,
                    scope.data.id,
                    state.groupPolicyVariables?.[scope.data.id]?.value?.string,
                  )
                "
              />
            </template>
          </PrimeColumn>
          <PrimeColumn class="text-right">
            <template #body="scope">
              <PrimeButton
                v-if="state.groupPolicyVariables?.[scope.data.id]"
                icon="bi bi-x-circle"
                severity="danger"
                variant="outlined"
                @click="onRemoveGroupPolicyVariable(scope.data.id)"
              />
            </template>
          </PrimeColumn>
        </PrimeDataTable>
      </div>
    </div>
  </error-handler>
</template>

<script setup lang="ts">
import ROUTE_NAMES from '@/router/routes'
import { useGroup } from '@/composables/useGroup'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { type Id, type Paginated } from '@feathersjs/feathers'
import { Conflict } from '@feathersjs/errors'
import PrimeAutoComplete, { type AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import PrimeAvatar from 'primevue/avatar'
import PrimeButton from 'primevue/button'
import PrimeColumn from 'primevue/column'
import PrimeDataTable from 'primevue/datatable'
import PrimeMessage from 'primevue/message'
import PrimeSelect from 'primevue/select'
import PrimeInputText from 'primevue/inputtext'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { GenericForm, type GenericFormInitialValues } from '@locokit/vue-components'
import {
  FIELD_COMPONENT,
  FIELD_TYPE,
  GROUP_ROLE,
  type LocoKitFormField,
  type LocoKitFormFieldAutocomplete,
  type LocoKitMessage,
} from '@locokit/definitions'
import type { PolicyResult, UserGroupData, UserResult } from '@locokit/sdk'
import ErrorHandler from '@/components/error-handler.vue'
import { searchUsers } from '@/services/core/user'

definePage({
  name: ROUTE_NAMES.WORKSPACE.ADMIN.GROUPS.UUID,
})
const route = useRoute()

/**
 * Load the group :
 * * the group itself
 * * the users related to this group
 * * policies variables
 */
const {
  state,
  findPolicies,
  patchGroup,
  fetchGroup,
  fetchUserGroup,
  createUserGroup,
  patchUserGroup,
  removeUserGroup,
  fetchGroupPolicyVariable,
  createGroupPolicyVariable,
  patchGroupPolicyVariable,
  removeGroupPolicyVariable,
} = useGroup(route.params.wsslug)
interface LabelValuePair {
  label: string
  value: string
}

const { t, d } = useI18n()

useHead({
  titleTemplate: `${t('locokit.pages.admin.title')} | %s`,
})

const emit = defineEmits<{
  'group-patched': []
}>()

const confirm = useConfirm()
const toast = useToast()

const pageError = ref<unknown>(null)

const suggestions = ref<PolicyResult[]>([])
const formLoading = ref(false)
const formMessage = ref<LocoKitMessage | null>(null)

const userSuggestions = ref<UserResult[]>([])
const selectedUser = ref<UserResult | string | null>(null)
const selectedRole = ref<keyof typeof GROUP_ROLE>(GROUP_ROLE.MEMBER)
const memberRoles = ref<Record<string, string>>({})
const membershipFormMessage = ref<LocoKitMessage | null>(null)
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
  if (!state.value.group) {
    return {} as GenericFormInitialValues
  }

  return {
    id: state.value.group.id,
    name: state.value.group.name,
    documentation: state.value.group.documentation,
    policy: {
      id: state.value.group.policy.id,
      name: state.value.group.policy.name,
    },
  }
})

/**
 * User Group form
 */
async function onAddButtonClick() {
  if (!state.value.group || !selectedUser.value) {
    return
  }

  try {
    await createUserGroup({
      userId: selectedUser.value.id,
      groupId: state.value.group.id,
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

    await fetchUserGroup(state.value.group.id)
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
        text: e instanceof Error ? e.message : (e as string),
      }
    }
  }
}

function onRemoveButtonClick(event: MouseEvent, usergroup: UserGroupData) {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    appendTo: 'self',
    message: t('locokit.pages.recordGroup.memberRemovalConfirm', {
      username: usergroup.user.username,
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
        await removeUserGroup(usergroup.id)

        toast.add({
          severity: 'success',
          summary: t('locokit.pages.recordGroup.memberRemoved', {
            username: usergroup.user.username,
          }),
          life: 3000,
        })

        membershipFormMessage.value = null

        fetchUserGroup(state.value.group.id)
      } catch (e) {
        membershipFormMessage.value = {
          status: 'error',
          text: e instanceof Error ? e.message : (e as string),
        }
      }
    },
  })
}

async function onMemberRoleChange(newRole: keyof typeof GROUP_ROLE, usergroup: UserGroupData) {
  try {
    await patchUserGroup(usergroup.id, {
      role: newRole,
    })

    membershipFormMessage.value = null

    toast.add({
      severity: 'success',
      summary: t('locokit.pages.recordGroup.memberRoleChanged', {
        username: usergroup.user.username,
        role: t('locokit.commons.userProfile.' + newRole.toLowerCase()),
      }),
      life: 3000,
    })
  } catch (e) {
    membershipFormMessage.value = {
      status: 'error',
      text: e instanceof Error ? e.message : (e as string),
    }
  }
}

async function onUserComplete(event: AutoCompleteCompleteEvent) {
  try {
    const params: Record<string, unknown> = {}

    const result = (await searchUsers({
      search: event.query,
      params,
      limit: 10,
      sort: { username: 1 },
    })) as Paginated<UserResult>

    userSuggestions.value = result.data
  } catch (e) {
    membershipFormMessage.value = {
      status: 'error',
      text: e instanceof Error ? e.message : (e as string),
    }
  }
}

/**
 * Group form
 */
async function onComplete(
  event: AutoCompleteCompleteEvent,
  field: LocoKitFormFieldAutocomplete,
  _values: Record<string, unknown>,
) {
  try {
    switch (field.id) {
      case 'policy':
        suggestions.value = await findPolicies(event.query)
        break
    }
  } catch (e) {
    formMessage.value = {
      status: 'error',
      text: e instanceof Error ? e.message : (e as string),
    }
  }
}

async function onSubmit(values: Record<string, unknown>) {
  if (!state.value.group) {
    return
  }

  try {
    await patchGroup(state.value.group?.id, {
      name: values.name,
      policyId: values.policy,
      documentation: values.documentation,
    })
    await fetchGroup(state.value.group?.id)

    formMessage.value = null

    toast.add({
      severity: 'success',
      summary: t('locokit.success.basic'),
      life: 3000,
    })

    emit('group-patched')
  } catch (err) {
    pageError.value = err as Error
  }
}

/**
 * Variables form
 */
// async function onCreateGroupPolicyVariable(policyId, variableValue) {
//   try {
//     await variableValue(policyId, variableValue)

//     formMessage.value = null

//     toast.add({
//       severity: 'success',
//       summary: t('locokit.success.basic'),
//       life: 3000,
//     })
//   } catch (err) {
//     pageError.value = err as Error
//   }
// }
async function onPolicyVariableChange(
  newValue: string,
  policyVariableId: string,
  previousVariableValue: string | number | boolean,
) {
  try {
    if (!previousVariableValue) {
      await createGroupPolicyVariable(policyVariableId, state.value.group?.id, newValue)
      await fetchGroup(state.value.group?.id)
    } else {
      const currentGroupPolicyVariable = state.value.groupPolicyVariables[policyVariableId]
      await patchGroupPolicyVariable(currentGroupPolicyVariable.id, newValue)
      await fetchGroup(state.value.group?.id)
    }
    formMessage.value = null

    toast.add({
      severity: 'success',
      summary: t('locokit.success.basic'),
      life: 3000,
    })
  } catch (err) {
    pageError.value = err as Error
  }
}
async function onRemoveGroupPolicyVariable(policyVariableId: string) {
  try {
    const currentGroupPolicyVariable = state.value.groupPolicyVariables[policyVariableId]
    await removeGroupPolicyVariable(currentGroupPolicyVariable.id)
    await fetchGroup(state.value.group?.id)

    formMessage.value = null

    toast.add({
      severity: 'success',
      summary: t('locokit.success.basic'),
      life: 3000,
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
:deep(.p-avatar-icon[class^='bi-']::before),
:deep(.p-avatar-icon[class*=' bi-']::before) {
  vertical-align: top;
}
</style>
