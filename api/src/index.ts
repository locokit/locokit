/**
 * This file start the API
 * This file IS NOT USED in development,
 * as we start the server with feathers-vite plugin
 */
import { createApp } from './app'
import { logger } from './logger'

const app = createApp()

console.log(app.get('settings'))

const port = app.get('port')
const host = app.get('host')

// Close previous port and open it again
const listenGlobal = globalThis as any

async function boot(): Promise<void> {
  const server = listenGlobal.FeathersServer as any
  if (server === undefined || server.close()) {
    listenGlobal.FeathersServer = await app.listen(port)
    logger.info(
      `Whoot whoot !! LocoKit started and moving on http://${host}:${port}`,
    )
  }
}

void boot()
