import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'

import { datasourceMermaidQueryValidator } from './datasource-mermaid.schema'

export const datasourceMermaidHooks = {
  around: {
    all: [authenticate('jwt')],
  },
  before: {
    find: [schemaHooks.validateQuery(datasourceMermaidQueryValidator)],
  },
  after: {},
  error: {},
}
