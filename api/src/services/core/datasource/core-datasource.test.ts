import { describe, it } from 'vitest'

describe('datasource service', () => {
  it.todo('is well configured')
  it.todo('allow user to retrieve datasource from a workspace id')
  it.todo('forbid user to retrieve datasource of workspace they do not have access to')
  it.todo('allow user to patch datasource on workspace they manage')
  it.todo('allow to sync the datasource model in locokit meta model (tables + fields + relations)')
  it.todo(
    'allow to create a migration and apply it to sync datasource model in LocoKit meta model (tables + fields + relations)',
  )
  it.todo('allow to retrieve migrations')
  it.todo('does not return credentials when user is not admin / manager of the workspace')
})
