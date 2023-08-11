import { describe, it } from 'vitest'

describe('table-record service', () => {
  it.todo('is well configured')
  it.todo('allow user to retrieve records of a table')
  it.todo('forbid (404) user to retrieve records of a table he does not have access')
  it.todo('allow user to retrieve records of a table according its fields permissions')
  it.todo('allow user to retrieve records of a table according its filters permissions')

  it.todo(
    'allow to retrieve records from tables that could be named the same way than the locokit ones, to avoid conflicts in validators',
  )

  it.todo(
    'return a boolean (true/false) for boolean fields in a SQLite datasource (need to use resolver ?)',
  )

  it.todo('validate a creation with nullable fields')
  it.todo('validate a creation after a migration has been done correctly (model objection updates)')

  it.todo('allow to create a new record')
  it.todo('allow to patch a record')
  it.todo('allow to update a record')
  it.todo('allow to delete a record')

  it.todo('fail on a patch if validation is not ok')
  it.todo('fail on a create if validation is not ok')
  it.todo('fail on a patch if validation is data is wrong ?')

  it.todo('accept to join on several relation')

  it.todo('restrict filters for relation fields')
  it.todo('forbid filters for unauthorized relations')
  it.todo('allow to retrieve one nested level of relation')
  it.todo('allow to retrieve two nested level of relation')

  it.todo('go faster when creating a new record (because validator already exist)')

  it.todo('filter relations authorized with permissions')

  it.todo('test the regexp for filtering relations')

  it.todo('allow access to the endpoint if public access is granted for a specific table')
  it.todo('allow access to the endpoint if public access is granted for the workspace')
  it.todo(
    'forbid access to the endpoint on a table if public access is granted for the workspace but not the table',
  )

  // Are missing :

  // tests on all related endpoints for synchronization
  // tests on record Create / Update / Delete using validators & resolvers
  // tests on record query through nested relations using validators

  it.todo('use the right role to access dedicated schema for GET')
  it.todo('use the right role to access dedicated schema for POST')
  it.todo('use the right role to access dedicated schema for PUT')
  it.todo('use the right role to access dedicated schema for DELETE')
  it.todo('use the right role to access dedicated schema for find')
})
