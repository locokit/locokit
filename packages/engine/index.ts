import { BaserowAdapter } from './adapters/baserow'
import { Connexion, GenericAdapter } from './adapters/interface'
import { SQLAdapter } from './adapters/sql'

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
