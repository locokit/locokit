import { describe, it } from 'vitest'

describe('datasource service', () => {
  it.todo('is well configured')
  it.todo('allow user to retrieve datasource from a workspace id')
  it.todo('forbid user to retrieve datasource of workspace they do not have access to')
  it.todo('allow user to patch datasource on workspace they manage')
  it.todo('allow to sync the datasource model in locokit meta model (tables + fields + relations)')

  it.todo('forbid user to access datasource if he is not authorized to access this datasource')
  it.todo(
    'forbid user to access datasource if he is not authorized to access the related workspace',
  )

  it.todo('prevent to sync at the same time the meta model ? (type of transaction ?)')

  it.todo('add a table when a new one appear in the datasource')
  it.todo('add a field when a new one appear in the datasource')
  it.todo('add a relation when a new one appear in the datasource')
  it.todo('update a table when a new one appear in the datasource')
  it.todo('update a field when a new one appear in the datasource')
  it.todo('update a relation when a new one appear in the datasource')
  it.todo('remove a table when a new one appear in the datasource')
  it.todo('remove a field when a new one appear in the datasource')
  it.todo('remove a relation when a new one appear in the datasource')
})