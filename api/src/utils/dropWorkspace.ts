import { Application, Paginated } from '@feathersjs/feathers'
import { Database } from '../models/database.model'
import { Workspace } from '../models/workspace.model'
import { Page } from '../models/page.model'
import { User } from '../models/user.model'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

/**
 * Remove a workspace and all its children
 */
export async function dropWorkspace (app: Application, workspaceId: string): Promise<void> {
  const workspace = await app.service('workspace').get(workspaceId, {
    query: {
      $eager: '[aclsets.[groups.[usergroups]]]',
    },
  }) as Workspace
  const allIdsChapters: string[] = []
  const allIdsGroups: string[] = []
  const allIdsUsers: Set<number> = new Set()
  const allIdsUsersGroups: {group_id: string; user_id: number}[] = []
  const allIdsAclsets: string[] = []

  workspace.aclsets?.forEach(a => {
    a.chapter_id !== null && allIdsChapters.push(a.chapter_id as string)
    allIdsAclsets.push(a.id as string)
    a.groups?.forEach(g => {
      allIdsGroups.push(g.id as string)
      g.usergroups?.forEach(ug => {
        allIdsUsersGroups.push(ug)
        allIdsUsers.add(ug.user_id)
      })
    })
  })

  /**
   * First part : chapter > page > container > block
   */
  const pages = await app.service('page').find({
    query: {
      chapter_id: {
        $in: allIdsChapters,
      },
      $eager: '[containers.[blocks]]',
    },
  }) as Paginated<Page>
  const allIdsBlocks: string[] = []
  const allIdsContainers: string[] = []
  const allIdsPages: string[] = []
  pages.data?.forEach(p => {
    allIdsPages.push(p.id)
    p.containers?.forEach(c => {
      allIdsContainers.push(c.id)
      c.blocks?.forEach(b => {
        allIdsBlocks.push(b.id)
      })
    })
  })

  await Promise.all(allIdsBlocks.map(async id => {
    return app.service('block').remove(id)
  }))
  await Promise.all(allIdsContainers.map(async id => {
    return app.service('container').remove(id)
  }))
  await Promise.all(allIdsPages.map(async id => {
    return app.service('page').remove(id)
  }))

  /**
   * Second part : database > tables > columns, rows, views
   */
  const databases = await app.service('database').find({
    query: {
      workspace_id: workspaceId,
      $eager: '[tables.[columns, rows, views.[columns]]]',
    },
  }) as Paginated<Database>

  const allIdsViews: string[] = []
  const allIdsViewsColumns: string[] = []
  const allIdsRows: string[] = []
  const allIdsColumnsFirst: string[] = []
  const allIdsColumnsSecond: string[] = []
  const allIdsTables: string[] = []
  const allIdsDatabases: string[] = []
  databases.data?.forEach(d => {
    allIdsDatabases.push(d.id)
    d.tables?.forEach(t => {
      allIdsTables.push(t.id)
      t.views?.forEach(v => {
        allIdsViews.push(v.id)
        v.columns?.forEach(vc => {
          allIdsViewsColumns.push(`${v.id},${vc.id}`)
        })
      })
      t.columns?.forEach(c => {
        switch (c.column_type_id) {
          case COLUMN_TYPE.LOOKED_UP_COLUMN:
            allIdsColumnsFirst.push(c.id)
            break
          default:
            allIdsColumnsSecond.push(c.id)
        }
      })
      t.rows?.forEach(r => {
        allIdsRows.push(r.id)
      })
    })
  })

  await Promise.all(allIdsViewsColumns.map(async id => {
    return app.service('table-view-has-table-column').remove(id)
  }))
  await Promise.all(allIdsViews.map(async id => {
    return app.service('view').remove(id)
  }))
  await Promise.all(allIdsColumnsFirst.map(async id => {
    return app.service('column').remove(id)
  }))
  await Promise.all(allIdsColumnsSecond.map(async id => {
    return app.service('column').remove(id)
  }))

  await Promise.all(allIdsRows.map(async id => {
    return app.service('row').remove(id)
  }))
  await Promise.all(allIdsTables.map(async id => {
    return app.service('table').remove(id)
  }))
  await Promise.all(allIdsDatabases.map(async id => {
    return app.service('database').remove(id)
  }))

  /**
   * Last part : group, usergroup, user, acl, workspace
   */
  await Promise.all(allIdsUsersGroups.map(async ug => {
    return app.service('usergroup').remove(`${ug.user_id},${ug.group_id}`)
  }))
  await Promise.all(allIdsGroups.map(async id => {
    return app.service('group').remove(id)
  }))
  // const p: Promise<User>[] = []
  // allIdsUsers.forEach(async id => {
  //   p.push(app.service('user').remove(id))
  // })
  // await Promise.all(p)
  await Promise.all(allIdsAclsets.map(async id => {
    return app.service('aclset').remove(id)
  }))
  await Promise.all(allIdsChapters.map(async id => {
    return app.service('chapter').remove(id)
  }))
  await app.service('workspace').remove(workspaceId)
}
