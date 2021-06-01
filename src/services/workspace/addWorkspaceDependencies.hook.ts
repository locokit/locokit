import { HookContext } from "@feathersjs/feathers";
import { GROUP_ROLE } from "@locokit/lck-glossary";

/**
 * Config a workspace just created
 * * create a database
 * * create a manager aclset
 * * create a group and attach it to the aclset
 * * add the current user to this new group
 * * enhance the context.result with this new data
 *
 * @param context Hook context
 * @returns a Hook context enhanced with new data
 */
export async function addWorkspaceDependencies (context: HookContext): Promise<HookContext> {
  /**
   * First check we are on a workspace after hook
   */
   if (context.method !== 'create' || context.type !== 'after') return context

  /**
   * Create a new Database
   */
  context.result.databases = [
    await context.app.service('database').create({
      text: 'Default database',
      workspace_id: context.result.id
    })
  ]
  /**
   * Create a new manager aclset
   */
  const aclset = await context.app.service('aclset').create({
    label: 'ACL manager',
    manager: true,
    workspace_id: context.result.id
  })
  /**
   * Create a new group linked to the previous aclset
   * with the current user as the owner
   */
  if (context.params.user) {
    const group = await context.app.service('group').create({
      name: 'Group manager',
      aclset_id: aclset.id,
      users: [{
        ...context.params.user,
        uhg_role: GROUP_ROLE.OWNER
      }]
    })
    context.result.aclsets = [{
      ...aclset,
      groups: [ group ]
    }]
  } else {
    context.result.aclsets = [ aclset ]
  }
  return context
}
