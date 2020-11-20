import { StoryContext, StoryFn } from '@storybook/addons/dist/types'

let dataToReturn = {
  limit: 0,
  total: 0,
  data: []
}
function defaultServiceFunction () {
  return dataToReturn
}

const feathersService = {
  find: defaultServiceFunction,
  get: defaultServiceFunction,
  put: defaultServiceFunction,
  patch: defaultServiceFunction,
  remove: defaultServiceFunction
}

export const lckServices = {
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
  processTrigger: feathersService,
  processExecution: feathersService,
  /**
   * User
   */
  user: feathersService,
  group: feathersService
}

export function lckServicesDecorator (
  story: StoryFn,
  { parameters }: StoryContext
) {
  if (parameters && parameters.lckServices) {
    dataToReturn = parameters.lckServices.data
  }
  return story()
}
