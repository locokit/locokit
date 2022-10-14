import type { Application } from '../../declarations'

import { WService, wHooks } from './w.class'

// A configure function that registers the service and its hooks via `app.configure`
export function w(app: Application): void {
  const options = {
    paginate: app.get('paginate'),
    Model: app.get('db'),
    name: 'w',
    // Service options will go here
  }

  // Register our service on the Feathers application
  app.use('w', new WService(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
  })
  // Initialize hooks
  app.service('w').hooks(wHooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    w: WService
  }
}
