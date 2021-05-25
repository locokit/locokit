// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Group as LckGroup } from '../../models/group.model'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.params.query?.$eager?.indexOf('chapters') > -1) {
      if (context.params.user?.profile !== 'SUPERADMIN') {
        // find groups between user and workspaceId
        // choose the first one
        // find
        const groupWithWorkspaces: LckGroup[] = await context.app.services.group.find({
          query: {
            $eager: '[users, aclset]',
            $joinRelation: 'users',
            'users.id': context.params.user?.id,
          },
          paginate: false,
        })
        const $in: string[] = []
        groupWithWorkspaces.forEach((group: LckGroup) => {
          // if (workspace.role === 'OWNER' && workspace.chapters) {
          //   $in.push(...workspace.chapters.map(c => c.id))
          // } else
          if (group.aclset.chapter_id !== undefined && group.aclset.chapter_id !== null) {
            $in.push(group.aclset.chapter_id)
          }
        });
        (context.params.query).$joinRelation = 'chapters';
        (context.params.query).$modifyEager = {
          chapters: {
            id: {
              $in,
            },
          },
        }
        // (context.params.query as Query)['chapters.id'] = { $in }
        // console.log(context.params.query)
      }
    }
    return context
  }
}
