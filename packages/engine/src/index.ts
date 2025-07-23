import { BaserowAdapter } from './adapters/baserow'
import { SQLAdapter } from './adapters/sql'

import { type GenericAdapter, type Connexion } from './adapters/interface'

export async function createAdapter(adapterOptions: Connexion): Promise<GenericAdapter> {
  let adapter
  switch (adapterOptions.type) {
    case 'baserow':
      adapter = new BaserowAdapter(adapterOptions)
      break
    case 'pg':
    case 'sqlite3':
      adapter = new SQLAdapter(adapterOptions)
      break
  }
  await adapter.boot()
  return adapter
}

export { GenericAdapter, Connexion }
