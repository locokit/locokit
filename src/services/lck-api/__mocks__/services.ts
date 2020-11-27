import { StoryContext, StoryFn } from '@storybook/addons/dist/types'

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
  get: defaultServiceFunction,
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
  visuPage: feathersService,
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
  | 'visuChapter' | 'visuPage' | 'visuContainer' | 'visuBlock'
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
