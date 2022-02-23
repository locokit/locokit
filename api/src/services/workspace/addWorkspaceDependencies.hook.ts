import { HookContext } from '@feathersjs/feathers'
import { COLUMN_TYPE, GROUP_ROLE } from '@locokit/lck-glossary/src'

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
   * Create a new Database / Table / Column / View / Rows
   */
  const newDatabase = await context.app.service('database').create({
    text: 'Default database',
    workspace_id: context.result.id,
  })
  context.result.databases = [newDatabase]
  const newTable = await context.app.service('table').create({
    text: 'Task (Example table)',
    slug: 'task',
    database_id: newDatabase.id,
  })
  const newColumnName = await context.app.service('column').create({
    text: 'Name',
    slug: 'name',
    column_type_id: COLUMN_TYPE.STRING,
    table_id: newTable.id,
  })
  const uuidBacklog = 'db24b322-b8fd-4e1f-831c-8293a7259722'
  const uuidTodo = '518855e5-43df-4fbf-81fe-7eeab420df6e'
  const uuidDoing = 'af653ef4-a208-4ee3-8a80-68fcdb3cacdf'
  const uuidDone = 'aee351bd-4b27-43bc-a2f8-79419df58141'
  const newColumnStatus = await context.app.service('column').create({
    text: 'Status',
    slug: 'status',
    column_type_id: COLUMN_TYPE.SINGLE_SELECT,
    table_id: newTable.id,
    settings: {
      values: {
        [uuidBacklog]: {
          label: 'Backlog',
          color: '#484848',
          backgroundColor: '#e1e0ff',
          position: 0,
        },
        [uuidTodo]: {
          label: 'To do',
          color: '#484848',
          backgroundColor: '#ffbc2',
          position: 1,
        },
        [uuidDoing]: {
          label: 'Doing',
          color: '#484848',
          backgroundColor: '#dffbff',
          position: 2,
        },
        [uuidDone]: {
          label: 'Done',
          color: '#484848',
          backgroundColor: '#e4f7cf',
          position: 3,
        },
      },
    },
  })
  const newView = await context.app.service('view').create({
    text: 'All tasks',
    table_id: newTable.id,
  })
  await context.app.service('table-view-has-table-column').create({
    table_view_id: newView.id,
    table_column_id: newColumnName.id,
  })
  await context.app.service('table-view-has-table-column').create({
    table_view_id: newView.id,
    table_column_id: newColumnStatus.id,
  })
  await context.app.service('row').create({
    data: {
      [newColumnName.id]: 'Push locokit code on github',
      [newColumnStatus.id]: uuidDone,
    },
    table_id: newTable.id,
  })
  await context.app.service('row').create({
    data: {
      [newColumnName.id]: 'Create a locokit community',
      [newColumnStatus.id]: uuidDoing,
    },
    table_id: newTable.id,
  })
  await context.app.service('row').create({
    data: {
      [newColumnName.id]: 'Create a locokit saas (one day, maybe)',
      [newColumnStatus.id]: uuidBacklog,
    },
    table_id: newTable.id,
  })
  await context.app.service('row').create({
    data: {
      [newColumnName.id]: 'Add the CalendarSet',
      [newColumnStatus.id]: uuidTodo,
    },
    table_id: newTable.id,
  })
  await context.app.service('row').create({
    data: {
      [newColumnName.id]: 'Add the KanbanSet',
      [newColumnStatus.id]: uuidTodo,
    },
    table_id: newTable.id,
  })

  /**
   * Create a new chapter / page / container / block with a TableSet
   */
  const newChapter = await context.app.service('chapter').create({
    text: 'Default chapter',
    workspace_id: context.result.id,
  })
  const newPage = await context.app.service('page').create({
    text: 'All tasks',
    chapter_id: newChapter.id,
    layout: 'classic',
  })
  const newContainer = await context.app.service('container').create({
    text: 'Main container',
    page_id: newPage.id,
    display_title: false,
  })
  await context.app.service('block').create({
    title: '',
    container_id: newContainer.id,
    type: 'TableSet',
    settings: {
      id: newView.id,
    },
  })

  /**
   * Create a new manager aclset with the previous chapter
   */
  const aclset = await context.app.service('aclset').create({
    label: 'ACL manager',
    manager: true,
    workspace_id: context.result.id,
    chapter_id: newChapter.id,
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
        uhg_role: GROUP_ROLE.OWNER,
      }],
    })
    context.result.aclsets = [{
      ...aclset,
      groups: [group],
    }]
  } else {
    context.result.aclsets = [aclset]
  }
  return context
}
