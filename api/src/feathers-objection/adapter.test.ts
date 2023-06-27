import { describe, it } from 'vitest'

describe('feathers-objection adapter', () => {
  it.todo('count distinct rows')
  it.todo('count rows if the table has a composite key')
  it.todo(
    'count rows if the table has a composite key correctly if join / eager are in query param',
  )
  it.todo('count distinct rows correctly if join / eager are in query param')

  it.todo('create rows with composable key')
  it.todo('update rows with composable key')
  it.todo('patch rows with composable key')
  it.todo('remove rows with composable key')
  it.todo('find rows with composable key')
  it.todo('get rows with composable key')

  it.todo('sort correctly rows by a table column')
  it.todo(
    'sort correctly rows by a table column event with a $eager relation containing the same column',
  )
  it.todo('sort correctly rows by a table column event with a $joinRelated relation')
  it.todo('sort correctly rows by a table column event with a $joinEager relation')

  it.todo('filter a sqlite with a ilike operator')
  it.todo('filter a pg with a ilike operator')

  // actually, finding workspaces with datasources change the total
  it.todo('count correctly element with $eager')
})
