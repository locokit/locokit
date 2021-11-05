import app from '../../app'

describe('\'table_view_has_table_column\' service', () => {
  it('registered the service', () => {
    const service = app.service('table-view-has-table-column')
    expect(service).toBeTruthy()
  })
})
