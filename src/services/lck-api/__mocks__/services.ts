import { Params } from '@feathersjs/feathers'
import { StoryContext, StoryFn } from '@storybook/addons'

const dataToReturn = {
  limit: 0,
  total: 0,
  data: []
}
function defaultServiceFunction () {
  return new Promise(resolve => {
    resolve(dataToReturn)
  })
}

const feathersService = {
  find: defaultServiceFunction,
  get: (id: string, params: Params) => ({ id, params }),
  put: defaultServiceFunction,
  patch: defaultServiceFunction,
  remove: defaultServiceFunction
}

export const lckServices = {
  __mock: true,
  /**
   * Database part
   */
  database: feathersService,
  table: feathersService,
  tableColumn: feathersService,
  tableView: feathersService,
  tableRow: feathersService,
  tableViewColumn: feathersService,
  /**
   * Visualization
   */
  visuChapter: feathersService,
  page: feathersService,
  visuContainer: feathersService,
  visuBlock: feathersService,
  /**
   * Processes
   */
  process: feathersService,
  processRun: feathersService,
  /**
   * User
   */
  user: feathersService,
  group: feathersService
}

type lckServicesName = 'database' | 'table' | 'tableColumn' | 'tableView' | 'tableRow' | 'tableViewColumn'
  | 'visuChapter' | 'page' | 'visuContainer' | 'visuBlock'
  | 'process' | 'processRun'
  | 'user' | 'group'

export function lckServicesDecorator (
  story: StoryFn,
  { parameters }: StoryContext
) {
  if (parameters?.lckServices) {
    (Object.keys(parameters.lckServices) as lckServicesName[]).forEach(serviceName => {
      lckServices[serviceName] = parameters.lckServices[serviceName]
    })
  }
  return story()
}
