import type { GroupResult, PolicyResult } from '@locokit/sdk'
import { computed, ref, watch } from 'vue'
import { sdkClient } from '@/services/sdk'
import { useRoute } from 'vue-router'
import type { Id, Paginated } from '@feathersjs/feathers'
import type {
  WorkspaceGroupData,
  WorkspaceGroupPatch,
} from '@locokit/sdk/dist/src/services/workspace/group/group.schema'
import type {
  UserGroupData,
  UserGroupPatch,
  UserGroupResult,
} from '@locokit/sdk/dist/src/services/workspace/user-group/user-group.schema'

import type { WorkspacePolicyVariableSchema } from '@locokit/sdk/dist/src/services/workspace/policy-variable/policy-variable.schema'

/**
 * Workspace group composable,
 * helpful for CRUD operations on a group, and other helpers for policies/variables/etc.
 *
 * @param workspaceSlug Slug of the workspace, useful for computing service route
 * @returns composable for managing groups at the workspace level
 */
export function useGroup(workspaceSlug: string) {
  const route = useRoute()
  const guuid = computed(() => route.params.guuid)
  const workspaceGroupService = sdkClient.service('/workspace/' + workspaceSlug + '/group')
  const workspacePolicyService = sdkClient.service('/workspace/' + workspaceSlug + '/policy')
  const workspacePolicyVariableService = sdkClient.service(
    '/workspace/' + workspaceSlug + '/policy-variable',
  )
  const workspaceUserGroupService = sdkClient.service('/workspace/' + workspaceSlug + '/user-group')
  const workspaceGroupPolicyVariableService = sdkClient.service(
    '/workspace/' + workspaceSlug + '/group-policy-variable',
  )

  const state = ref<{
    loading: boolean
    error: Error | null
    group: GroupResult | null
    members: Paginated<UserGroupResult> | null
    policyVariables: WorkspacePolicyVariableSchema[]
    groupPolicyVariables: Record<
      string,
      { policyVariableId: string; value: any; id: string; groupId: string }
    >
  }>({
    loading: false,
    group: null,
    error: null,
    members: null,
    policyVariables: [],
    groupPolicyVariables: {},
  })

  /**
   * Group part
   */
  async function fetchGroup(id: string) {
    state.value.loading = true
    state.value.error = null
    try {
      const group = (await workspaceGroupService.get(id, {
        query: {
          $joinEager: '[users, policy, groupPolicyVariable]',
        },
      })) as GroupResult
      state.value.group = group
      await fetchUserGroup(id)
      await fetchPolicyVariables(group.policyId)
      await fetchGroupPolicyVariable(id)
    } catch (error) {
      state.value.error = error as Error
      console.error(error)
    }
    state.value.loading = false
  }
  async function createGroup(data: WorkspaceGroupData) {
    return workspaceGroupService.create(data)
  }
  async function patchGroup(id: Id, data: WorkspaceGroupPatch) {
    return workspaceGroupService.patch(id, data)
  }
  async function removeGroup(id: Id) {
    return workspaceGroupService.remove(id)
  }

  /**
   * Policy section
   */
  async function findPolicies(q: string): Promise<PolicyResult[]> {
    const result = await workspacePolicyService.find({
      query: {
        name: {
          $ilike: '%' + q + '%',
        },
        $sort: {
          name: 1,
        },
      },
    })
    return result.data
  }
  async function fetchPolicyVariables(id: Id) {
    state.value.policyVariables = await workspacePolicyVariableService.find({
      query: {
        policyId: id,
      },
    })
  }

  /**
   * Group policy variable section
   */
  async function fetchGroupPolicyVariable(groupId: Id) {
    const groupPolicyVariable = await workspaceGroupPolicyVariableService.find({
      query: {
        groupId,
      },
    })
    const result: Record<
      string,
      { policyVariableId: string; value: any; id: string; groupId: string }
    > = {}
    state.value.policyVariables?.data.forEach((pv) => {
      const currentGPV = groupPolicyVariable?.data.find((v) => v.policyVariableId === pv.id)
      result[pv.id] = currentGPV || null
    })
    state.value.groupPolicyVariables = result
  }
  async function createGroupPolicyVariable(
    policyVariableId: Id,
    groupId: Id,
    variableValue: string | number | boolean,
  ) {
    const value: { string: string | null; number: number | null; boolean: boolean | null } = {
      string: null,
      number: null,
      boolean: null,
    }
    switch (typeof variableValue) {
      case 'boolean':
        value.boolean = variableValue
        break
      case 'number':
        value.number = variableValue
        break
      case 'string':
      default:
        value.string = variableValue
    }
    return workspaceGroupPolicyVariableService.create({
      policyVariableId,
      groupId,
      value,
    })
  }
  async function patchGroupPolicyVariable(id: Id, newVariableValue: string | number | boolean) {
    const value: { string: string | null; number: number | null; boolean: boolean | null } = {
      string: null,
      number: null,
      boolean: null,
    }
    switch (typeof newVariableValue) {
      case 'boolean':
        value.boolean = newVariableValue
        break
      case 'number':
        value.number = newVariableValue
        break
      case 'string':
      default:
        value.string = newVariableValue
    }
    return workspaceGroupPolicyVariableService.patch(id, {
      value,
    })
  }
  async function removeGroupPolicyVariable(id: Id) {
    return workspaceGroupPolicyVariableService.remove(id)
  }

  /**
   * User groups section
   */
  async function fetchUserGroup(groupId: Id, page: number = 0) {
    state.value.members = (await workspaceUserGroupService.find({
      query: {
        groupId,
        $skip: page * 20,
        $limit: 20,
        $joinEager: 'user',
      },
    })) as Paginated<UserGroupResult>
  }
  async function createUserGroup(data: UserGroupData) {
    return workspaceUserGroupService.create(data)
  }
  async function patchUserGroup(id: Id, data: UserGroupPatch) {
    return workspaceUserGroupService.patch(id, data)
  }
  async function removeUserGroup(id: Id) {
    return workspaceUserGroupService.remove(id)
  }

  /**
   * Watch the route guuid params to fetch immediately the group
   */
  watch(
    () => guuid.value,
    async (guuid: string | null) => {
      if (!guuid) return
      state.value.members = null
      fetchGroup(guuid)
    },
    {
      immediate: true,
    },
  )

  return {
    state,
    fetchGroup,
    createGroup,
    patchGroup,
    removeGroup,
    fetchUserGroup,
    createUserGroup,
    patchUserGroup,
    removeUserGroup,
    fetchGroupPolicyVariable,
    createGroupPolicyVariable,
    patchGroupPolicyVariable,
    removeGroupPolicyVariable,
    findPolicies,
  }
}
