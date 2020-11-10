// Initializes the `table_view_has_table_column` service on path `/table-view-has-table-column`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { TableViewHasTableColumn } from './table_view_has_table_column.class'
import createModel from '../../models/tableviewcolumn'
import hooks from './table_view_has_table_column.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'table-view-has-table-column': TableViewHasTableColumn & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/table-view-has-table-column', new TableViewHasTableColumn(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('table-view-has-table-column')

  service.hooks(hooks)
}
