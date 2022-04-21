import { DecoratorFunction, StoryContext, StoryFn } from '@storybook/addons'

const dataToReturn = {
  limit: 0,
  total: 0,
  data: [],
}
function defaultServiceFunction (..._args: any[]) {
  return new Promise(resolve => {
    resolve(dataToReturn)
  })
}

const feathersService = {
  find: defaultServiceFunction,
  get: defaultServiceFunction,
  put: defaultServiceFunction,
  patch: defaultServiceFunction,
  remove: defaultServiceFunction,
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
  group: feathersService,
  signup: {
    create: defaultServiceFunction,
  },
  /**
   * Ŵorkspace
   */
  workspace: feathersService,
}

type lckServicesName = 'database' | 'table' | 'tableColumn' | 'tableView' | 'tableRow' | 'tableViewColumn'
  | 'visuChapter' | 'page' | 'visuContainer' | 'visuBlock'
  | 'process' | 'processRun'
  | 'user' | 'group'
  | 'workspace'

export const lckServicesDecorator: DecoratorFunction = function (
  story: StoryFn,
  context: StoryContext,
) {
  console.log(context.kind, context.name)
  if (context.parameters?.lckServices) {
    (Object.keys(context.parameters.lckServices) as lckServicesName[])
      .forEach(serviceName => {
        lckServices[serviceName] = context.parameters.lckServices[serviceName]
      })
  }
  return {
    components: { story },
    template: '<story />',
  }
}
