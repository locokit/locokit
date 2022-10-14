import { app } from './app'
import { logger } from './logger'

const port = app.get('port')
const host = app.get('host')

async function boot(): Promise<void> {
  await app.listen(port)
  logger.info(
    `Whoot whoot !! LocoKit started and moving on http://${host}:${port}`,
  )
}

void boot()
